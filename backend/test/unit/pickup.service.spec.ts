import { Test, TestingModule } from '@nestjs/testing';
import { PickupsService } from '../../src/services/pickup.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { NotificationsService } from '../../src/services/notifications.service';
import { NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PickupStatus, FoodStatus, FoodCategory, UnitOfMeasure } from '@prisma/client';
import { CreatePickupDto } from '../../src/dtos/Pickups/create-pickup.dto';
import { ConfirmPickupDto } from '../../src/dtos/Pickups/confirm-pickup.dto';
import { CompletePickupDto } from '../../src/dtos/Pickups/complete-pickup.dto';
import { CancelPickupDto } from '../../src/dtos/Pickups/cancel-pickup.dto';

describe('PickupsService', () => {
  let service: PickupsService;
  let prismaService: PrismaService;
  let notificationsService: NotificationsService;

  // Mock data
  const mockUserId = 'user-123';
  const mockEstablishmentUserId = 'establishment-user-456';
  const mockBeneficiaryId = 'beneficiary-789';
  const mockEstablishmentId = 'establishment-123';
  const mockFoodId = 'food-456';
  const mockPickupId = 'pickup-001';

  const mockUser = {
    userId: mockUserId,
    email: 'beneficiary@example.com',
    username: 'Beneficiario Test',
    phone: '3001234567',
    picture: null,
  };

  const mockEstablishmentUser = {
    userId: mockEstablishmentUserId,
    email: 'establishment@example.com',
    username: 'Establecimiento Test',
    phone: '3007654321',
    picture: null,
  };

  const mockBeneficiary = {
    beneficiaryId: mockBeneficiaryId,
    userUserId: mockUserId,
    name: 'Beneficiario Test',
    User: mockUser,
  };

  const mockEstablishment = {
    establishmentId: mockEstablishmentId,
    userId: mockEstablishmentUserId,
    name: 'Restaurante Test',
    address: 'Calle 123',
    phone: '3007654321',
    user: mockEstablishmentUser,
  };

  const mockFood = {
    foodId: mockFoodId,
    name: 'Pan Integral',
    description: 'Pan fresco',
    category: FoodCategory.BAKERY,
    quantity: 10,
    unitOfMeasure: UnitOfMeasure.UNIT,
    status: FoodStatus.AVAILABLE,
    establishmentId: mockEstablishmentId,
    establishment: mockEstablishment,
    expiresAt: new Date('2025-12-31'),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPickup = {
    pickupId: mockPickupId,
    beneficiaryId: mockBeneficiaryId,
    establishmentId: mockEstablishmentId,
    foodId: mockFoodId,
    requestedQuantity: 5,
    deliveredQuantity: null,
    scheduledDate: new Date('2025-12-15T10:00:00.000Z'),
    status: PickupStatus.PENDING,
    beneficiaryNotes: 'Por favor guardar',
    establishmentNotes: null,
    confirmedAt: null,
    visitConfirmedAt: null,
    completedAt: null,
    cancelledAt: null,
    cancellationReason: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    beneficiary: mockBeneficiary,
    establishment: mockEstablishment,
    food: mockFood,
  };

  const mockPrismaService = {
    food: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    beneficiary: {
      findFirst: jest.fn(),
    },
    establishment: {
      findFirst: jest.fn(),
    },
    pickup: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const mockNotificationsService = {
    sendNewPickupRequestNotification: jest.fn(),
    sendPickupConfirmationNotification: jest.fn(),
    sendVisitConfirmedNotification: jest.fn(),
    sendPickupCompletedNotification: jest.fn(),
    sendPickupCancelledNotification: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PickupsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
      ],
    }).compile();

    service = module.get<PickupsService>(PickupsService);
    prismaService = module.get<PrismaService>(PrismaService);
    notificationsService = module.get<NotificationsService>(NotificationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ==================== CREATE ====================
  describe('create', () => {
    const createDto: CreatePickupDto = {
      foodId: mockFoodId,
      requestedQuantity: 5,
      scheduledDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      beneficiaryNotes: 'Por favor guardar',
    };

    it('should create a pickup successfully', async () => {
      mockPrismaService.food.findUnique.mockResolvedValue(mockFood);
      mockPrismaService.beneficiary.findFirst.mockResolvedValue(mockBeneficiary);
      mockPrismaService.pickup.create.mockResolvedValue(mockPickup);

      const result = await service.create(mockUserId, createDto);

      expect(result).toEqual(mockPickup);
      expect(mockPrismaService.food.findUnique).toHaveBeenCalledWith({
        where: { foodId: createDto.foodId },
        include: {
          establishment: {
            include: {
              user: true,
            },
          },
        },
      });
      expect(mockPrismaService.beneficiary.findFirst).toHaveBeenCalledWith({
        where: { userUserId: mockUserId },
      });
      expect(mockPrismaService.pickup.create).toHaveBeenCalled();
      expect(mockNotificationsService.sendNewPickupRequestNotification).toHaveBeenCalled();
    });

    it('should throw NotFoundException if food not found', async () => {
      mockPrismaService.food.findUnique.mockResolvedValue(null);

      await expect(service.create(mockUserId, createDto)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.food.findUnique).toHaveBeenCalledWith({
        where: { foodId: createDto.foodId },
        include: expect.any(Object),
      });
    });

    it('should throw BadRequestException if food is not available', async () => {
      mockPrismaService.food.findUnique.mockResolvedValue({
        ...mockFood,
        status: FoodStatus.RESERVED,
      });

      await expect(service.create(mockUserId, createDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if requested quantity exceeds available', async () => {
      mockPrismaService.food.findUnique.mockResolvedValue({
        ...mockFood,
        quantity: 2,
      });

      await expect(
        service.create(mockUserId, {
          ...createDto,
          requestedQuantity: 5,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if scheduled date is in the past', async () => {
      mockPrismaService.food.findUnique.mockResolvedValue(mockFood);

      await expect(
        service.create(mockUserId, {
          ...createDto,
          scheduledDate: new Date('2020-01-01').toISOString(),
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if beneficiary profile not found', async () => {
      mockPrismaService.food.findUnique.mockResolvedValue(mockFood);
      mockPrismaService.beneficiary.findFirst.mockResolvedValue(null);

      await expect(service.create(mockUserId, createDto)).rejects.toThrow(BadRequestException);
    });
  });

  // ==================== FIND ONE ====================
  describe('findOne', () => {
    it('should return a pickup by ID', async () => {
      mockPrismaService.pickup.findUnique.mockResolvedValue(mockPickup);

      const result = await service.findOne(mockPickupId);

      expect(result).toEqual(mockPickup);
      expect(mockPrismaService.pickup.findUnique).toHaveBeenCalledWith({
        where: { pickupId: mockPickupId },
        include: expect.any(Object),
      });
    });

    it('should throw NotFoundException if pickup not found', async () => {
      mockPrismaService.pickup.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  // ==================== FIND ALL ====================
  describe('findAll', () => {
    it('should return paginated pickups', async () => {
      const pickups = [mockPickup];
      mockPrismaService.pickup.findMany.mockResolvedValue(pickups);
      mockPrismaService.pickup.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result).toEqual({
        data: pickups,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should filter by status', async () => {
      mockPrismaService.pickup.findMany.mockResolvedValue([]);
      mockPrismaService.pickup.count.mockResolvedValue(0);

      await service.findAll({ status: PickupStatus.PENDING, page: 1, limit: 10 });

      expect(mockPrismaService.pickup.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: PickupStatus.PENDING }),
        }),
      );
    });

    it('should filter by date range', async () => {
      const startDate = '2025-12-01';
      const endDate = '2025-12-31';
      mockPrismaService.pickup.findMany.mockResolvedValue([]);
      mockPrismaService.pickup.count.mockResolvedValue(0);

      await service.findAll({ startDate, endDate, page: 1, limit: 10 });

      expect(mockPrismaService.pickup.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            scheduledDate: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          }),
        }),
      );
    });
  });

  // ==================== FIND BY BENEFICIARY ====================
  describe('findByBeneficiary', () => {
    it('should return pickups for a beneficiary', async () => {
      mockPrismaService.beneficiary.findFirst.mockResolvedValue(mockBeneficiary);
      mockPrismaService.pickup.findMany.mockResolvedValue([mockPickup]);
      mockPrismaService.pickup.count.mockResolvedValue(1);

      const result = await service.findByBeneficiary(mockUserId);

      expect(result.data).toEqual([mockPickup]);
      expect(mockPrismaService.beneficiary.findFirst).toHaveBeenCalledWith({
        where: { userUserId: mockUserId },
      });
    });

    it('should throw NotFoundException if beneficiary not found', async () => {
      mockPrismaService.beneficiary.findFirst.mockResolvedValue(null);

      await expect(service.findByBeneficiary(mockUserId)).rejects.toThrow(NotFoundException);
    });
  });

  // ==================== FIND BY ESTABLISHMENT ====================
  describe('findByEstablishment', () => {
    it('should return pickups for an establishment', async () => {
      mockPrismaService.establishment.findFirst.mockResolvedValue(mockEstablishment);
      mockPrismaService.pickup.findMany.mockResolvedValue([mockPickup]);
      mockPrismaService.pickup.count.mockResolvedValue(1);

      const result = await service.findByEstablishment(mockEstablishmentUserId);

      expect(result.data).toEqual([mockPickup]);
      expect(mockPrismaService.establishment.findFirst).toHaveBeenCalledWith({
        where: { userId: mockEstablishmentUserId },
      });
    });

    it('should throw NotFoundException if establishment not found', async () => {
      mockPrismaService.establishment.findFirst.mockResolvedValue(null);

      await expect(service.findByEstablishment(mockEstablishmentUserId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ==================== CONFIRM PICKUP ====================
  describe('confirmPickup', () => {
    const confirmDto: ConfirmPickupDto = {
      confirmed: true,
      notes: 'Confirmado, lo esperamos',
    };

    const rejectDto: ConfirmPickupDto = {
      confirmed: false,
      notes: 'No disponible ese día',
      alternativeDate: new Date(Date.now() + 172800000).toISOString(), // 2 days
    };

    it('should confirm a pickup successfully', async () => {
      mockPrismaService.pickup.findUnique.mockResolvedValue(mockPickup);
      const confirmedPickup = {
        ...mockPickup,
        status: PickupStatus.CONFIRMED,
        confirmedAt: new Date(),
      };
      mockPrismaService.pickup.update.mockResolvedValue(confirmedPickup);

      const result = await service.confirmPickup(mockPickupId, mockEstablishmentUserId, confirmDto);

      expect(result.status).toBe(PickupStatus.CONFIRMED);
      expect(mockPrismaService.pickup.update).toHaveBeenCalledWith({
        where: { pickupId: mockPickupId },
        data: expect.objectContaining({
          status: PickupStatus.CONFIRMED,
          establishmentNotes: confirmDto.notes,
        }),
        include: expect.any(Object),
      });
      expect(mockNotificationsService.sendPickupConfirmationNotification).toHaveBeenCalled();
    });

    it('should reject a pickup successfully', async () => {
      mockPrismaService.pickup.findUnique.mockResolvedValue(mockPickup);
      const rejectedPickup = {
        ...mockPickup,
        status: PickupStatus.REJECTED,
      };
      mockPrismaService.pickup.update.mockResolvedValue(rejectedPickup);

      const result = await service.confirmPickup(mockPickupId, mockEstablishmentUserId, rejectDto);

      expect(result.status).toBe(PickupStatus.REJECTED);
      expect(mockPrismaService.pickup.update).toHaveBeenCalledWith({
        where: { pickupId: mockPickupId },
        data: expect.objectContaining({
          status: PickupStatus.REJECTED,
        }),
        include: expect.any(Object),
      });
    });

    it('should throw ForbiddenException if user is not the establishment owner', async () => {
      mockPrismaService.pickup.findUnique.mockResolvedValue(mockPickup);

      await expect(
        service.confirmPickup(mockPickupId, 'wrong-user-id', confirmDto),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if pickup is not in PENDING status', async () => {
      mockPrismaService.pickup.findUnique.mockResolvedValue({
        ...mockPickup,
        status: PickupStatus.CONFIRMED,
      });

      await expect(
        service.confirmPickup(mockPickupId, mockEstablishmentUserId, confirmDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ==================== CONFIRM VISIT ====================
  describe('confirmVisit', () => {
    it('should confirm visit successfully', async () => {
      const confirmedPickup = {
        ...mockPickup,
        status: PickupStatus.CONFIRMED,
      };
      mockPrismaService.pickup.findUnique.mockResolvedValue(confirmedPickup);

      const inProgressPickup = {
        ...confirmedPickup,
        status: PickupStatus.IN_PROGRESS,
        visitConfirmedAt: new Date(),
      };
      mockPrismaService.pickup.update.mockResolvedValue(inProgressPickup);

      const result = await service.confirmVisit(mockPickupId, mockUserId);

      expect(result.status).toBe(PickupStatus.IN_PROGRESS);
      expect(mockNotificationsService.sendVisitConfirmedNotification).toHaveBeenCalled();
    });

    it('should throw ForbiddenException if user is not the beneficiary', async () => {
      const confirmedPickup = {
        ...mockPickup,
        status: PickupStatus.CONFIRMED,
      };
      mockPrismaService.pickup.findUnique.mockResolvedValue(confirmedPickup);

      await expect(service.confirmVisit(mockPickupId, 'wrong-user-id')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw BadRequestException if pickup is not in CONFIRMED status', async () => {
      mockPrismaService.pickup.findUnique.mockResolvedValue(mockPickup); // PENDING status

      await expect(service.confirmVisit(mockPickupId, mockUserId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  // ==================== COMPLETE PICKUP ====================
  describe('completePickup', () => {
    const completeDto: CompletePickupDto = {
      deliveredQuantity: 5,
      notes: 'Entrega exitosa',
    };

    it('should complete a pickup successfully', async () => {
      const inProgressPickup = {
        ...mockPickup,
        status: PickupStatus.IN_PROGRESS,
      };
      mockPrismaService.pickup.findUnique.mockResolvedValue(inProgressPickup);

      const completedPickup = {
        ...inProgressPickup,
        status: PickupStatus.COMPLETED,
        deliveredQuantity: completeDto.deliveredQuantity,
        completedAt: new Date(),
      };

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const mockTx = {
          pickup: {
            update: jest.fn().mockResolvedValue(completedPickup),
          },
          food: {
            update: jest.fn().mockResolvedValue({
              ...mockFood,
              quantity: mockFood.quantity - completeDto.deliveredQuantity,
            }),
          },
        };
        return callback(mockTx);
      });

      const result = await service.completePickup(
        mockPickupId,
        mockEstablishmentUserId,
        completeDto,
      );

      expect(result.status).toBe(PickupStatus.COMPLETED);
      expect(mockNotificationsService.sendPickupCompletedNotification).toHaveBeenCalled();
    });

    it('should throw ForbiddenException if user is not the establishment owner', async () => {
      const inProgressPickup = {
        ...mockPickup,
        status: PickupStatus.IN_PROGRESS,
      };
      mockPrismaService.pickup.findUnique.mockResolvedValue(inProgressPickup);

      await expect(
        service.completePickup(mockPickupId, 'wrong-user-id', completeDto),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if pickup is not in IN_PROGRESS status', async () => {
      mockPrismaService.pickup.findUnique.mockResolvedValue(mockPickup); // PENDING status

      await expect(
        service.completePickup(mockPickupId, mockEstablishmentUserId, completeDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if delivered quantity exceeds requested', async () => {
      const inProgressPickup = {
        ...mockPickup,
        status: PickupStatus.IN_PROGRESS,
        requestedQuantity: 3,
      };
      mockPrismaService.pickup.findUnique.mockResolvedValue(inProgressPickup);

      await expect(
        service.completePickup(mockPickupId, mockEstablishmentUserId, {
          deliveredQuantity: 10,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ==================== CANCEL PICKUP ====================
  describe('cancelPickup', () => {
    const cancelDto: CancelPickupDto = {
      reason: 'No puedo asistir',
    };

    it('should cancel a PENDING pickup successfully', async () => {
      mockPrismaService.pickup.findUnique.mockResolvedValue(mockPickup);

      const cancelledPickup = {
        ...mockPickup,
        status: PickupStatus.CANCELLED,
        cancelledAt: new Date(),
        cancellationReason: cancelDto.reason,
      };
      mockPrismaService.pickup.update.mockResolvedValue(cancelledPickup);

      const result = await service.cancelPickup(mockPickupId, mockUserId, cancelDto);

      expect(result.status).toBe(PickupStatus.CANCELLED);
      expect(mockNotificationsService.sendPickupCancelledNotification).toHaveBeenCalled();
    });

    it('should cancel a CONFIRMED pickup successfully', async () => {
      const confirmedPickup = {
        ...mockPickup,
        status: PickupStatus.CONFIRMED,
      };
      mockPrismaService.pickup.findUnique.mockResolvedValue(confirmedPickup);

      const cancelledPickup = {
        ...confirmedPickup,
        status: PickupStatus.CANCELLED,
      };
      mockPrismaService.pickup.update.mockResolvedValue(cancelledPickup);

      const result = await service.cancelPickup(mockPickupId, mockUserId, cancelDto);

      expect(result.status).toBe(PickupStatus.CANCELLED);
    });

    it('should throw ForbiddenException if user is not the beneficiary', async () => {
      mockPrismaService.pickup.findUnique.mockResolvedValue(mockPickup);

      await expect(service.cancelPickup(mockPickupId, 'wrong-user-id', cancelDto)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw BadRequestException if pickup is in IN_PROGRESS status', async () => {
      const inProgressPickup = {
        ...mockPickup,
        status: PickupStatus.IN_PROGRESS,
      };
      mockPrismaService.pickup.findUnique.mockResolvedValue(inProgressPickup);

      await expect(service.cancelPickup(mockPickupId, mockUserId, cancelDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if pickup is already COMPLETED', async () => {
      const completedPickup = {
        ...mockPickup,
        status: PickupStatus.COMPLETED,
      };
      mockPrismaService.pickup.findUnique.mockResolvedValue(completedPickup);

      await expect(service.cancelPickup(mockPickupId, mockUserId, cancelDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  // ==================== UPDATE ====================
  describe('update', () => {
    it('should update pickup notes by beneficiary', async () => {
      mockPrismaService.pickup.findUnique.mockResolvedValue(mockPickup);

      const updatedPickup = {
        ...mockPickup,
        beneficiaryNotes: 'Nuevas notas',
      };
      mockPrismaService.pickup.update.mockResolvedValue(updatedPickup);

      const result = await service.update(mockPickupId, mockUserId, {
        beneficiaryNotes: 'Nuevas notas',
      });

      expect(result.beneficiaryNotes).toBe('Nuevas notas');
    });

    it('should update pickup notes by establishment', async () => {
      mockPrismaService.pickup.findUnique.mockResolvedValue(mockPickup);

      const updatedPickup = {
        ...mockPickup,
        establishmentNotes: 'Notas del establecimiento',
      };
      mockPrismaService.pickup.update.mockResolvedValue(updatedPickup);

      const result = await service.update(mockPickupId, mockEstablishmentUserId, {
        establishmentNotes: 'Notas del establecimiento',
      });

      expect(result.establishmentNotes).toBe('Notas del establecimiento');
    });

    it('should throw ForbiddenException if user is not authorized', async () => {
      mockPrismaService.pickup.findUnique.mockResolvedValue(mockPickup);

      await expect(
        service.update(mockPickupId, 'unauthorized-user', { beneficiaryNotes: 'test' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if pickup is in non-editable status', async () => {
      const completedPickup = {
        ...mockPickup,
        status: PickupStatus.COMPLETED,
      };
      mockPrismaService.pickup.findUnique.mockResolvedValue(completedPickup);

      await expect(
        service.update(mockPickupId, mockUserId, { beneficiaryNotes: 'test' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if new scheduled date is in the past', async () => {
      mockPrismaService.pickup.findUnique.mockResolvedValue(mockPickup);

      await expect(
        service.update(mockPickupId, mockUserId, {
          scheduledDate: '2020-01-01T10:00:00.000Z',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ==================== GET STATISTICS ====================
  describe('getStatistics', () => {
    it('should return statistics for all pickups', async () => {
      mockPrismaService.pickup.groupBy.mockResolvedValue([
        { status: PickupStatus.COMPLETED, _count: { status: 10 } },
        { status: PickupStatus.PENDING, _count: { status: 5 } },
        { status: PickupStatus.CANCELLED, _count: { status: 2 } },
      ]);
      mockPrismaService.pickup.findMany.mockResolvedValue([
        { deliveredQuantity: 5, requestedQuantity: 5 },
        { deliveredQuantity: 10, requestedQuantity: 10 },
      ]);

      const result = await service.getStatistics();

      expect(result).toHaveProperty('byStatus');
      expect(result).toHaveProperty('totalPickups');
      expect(result).toHaveProperty('totalCompleted');
      expect(result).toHaveProperty('fulfillmentRate');
      expect(result).toHaveProperty('cancellationRate');
    });

    it('should filter statistics by beneficiary', async () => {
      mockPrismaService.beneficiary.findFirst.mockResolvedValue(mockBeneficiary);
      mockPrismaService.pickup.groupBy.mockResolvedValue([]);
      mockPrismaService.pickup.findMany.mockResolvedValue([]);

      await service.getStatistics(mockUserId, 'BENEFICIARY');

      expect(mockPrismaService.beneficiary.findFirst).toHaveBeenCalledWith({
        where: { userUserId: mockUserId },
      });
    });

    it('should filter statistics by establishment', async () => {
      mockPrismaService.establishment.findFirst.mockResolvedValue(mockEstablishment);
      mockPrismaService.pickup.groupBy.mockResolvedValue([]);
      mockPrismaService.pickup.findMany.mockResolvedValue([]);

      await service.getStatistics(mockEstablishmentUserId, 'ESTABLISHMENT');

      expect(mockPrismaService.establishment.findFirst).toHaveBeenCalledWith({
        where: { userId: mockEstablishmentUserId },
      });
    });

    it('should calculate fulfillment rate correctly', async () => {
      mockPrismaService.pickup.groupBy.mockResolvedValue([
        { status: PickupStatus.COMPLETED, _count: { status: 2 } },
      ]);
      mockPrismaService.pickup.findMany.mockResolvedValue([
        { deliveredQuantity: 8, requestedQuantity: 10 },
        { deliveredQuantity: 5, requestedQuantity: 10 },
      ]);

      const result = await service.getStatistics();

      // Total requested: 20, Total delivered: 13
      // Fulfillment rate: (13/20) * 100 = 65%
      expect(result.fulfillmentRate).toBe(65);
    });
  });
});
