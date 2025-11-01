import { Test, TestingModule } from '@nestjs/testing';
import { EstablishmentsService } from '../../src/services/establishment.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CreateEstablishmentDto } from '../../src/dtos/Establishments/create-establishment.dto';
import { UpdateEstablishmentDto } from '../../src/dtos/Establishments/update-establishment.dto';
import { EstablishmentType } from '@prisma/client';

describe('EstablishmentsService', () => {
  let service: EstablishmentsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    establishment: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  const mockCity = {
    cityId: 'c8813235-6f94-4f56-b9dc-22e2a3206e6b',
    name: 'Cali',
    departmentId: 'd8813235-6f94-4f56-b9dc-22e2a3206e6b',
    department: {
      departmentId: 'd8813235-6f94-4f56-b9dc-22e2a3206e6b',
      name: 'Valle del Cauca',
    },
  };

  const mockEstablishment = {
    establishmentId: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Bakery',
    description: 'A test bakery',
    address: 'Calle 5 #23-45',
    neighborhood: 'Granada',
    location: { type: 'Point', coordinates: [-76.532, 3.4516] },
    establishmentType: EstablishmentType.BAKERY,
    userId: '123e4567-e89b-12d3-a456-426614174001',
    cityId: mockCity.cityId,
    createdAt: new Date(),
    updatedAt: new Date(),
    city: mockCity,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstablishmentsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<EstablishmentsService>(EstablishmentsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new establishment', async () => {
      const createDto: CreateEstablishmentDto = {
        establishmentId: mockEstablishment.establishmentId,
        name: mockEstablishment.name,
        description: mockEstablishment.description,
        address: mockEstablishment.address,
        neighborhood: mockEstablishment.neighborhood,
        location: mockEstablishment.location,
        establishmentType: mockEstablishment.establishmentType,
        userId: mockEstablishment.userId,
        cityId: mockEstablishment.cityId,
      };

      mockPrismaService.establishment.create.mockResolvedValue(mockEstablishment);

      const result = await service.create(createDto);

      expect(result).toEqual(mockEstablishment);
      expect(mockPrismaService.establishment.create).toHaveBeenCalledWith({
        data: createDto,
      });
      expect(mockPrismaService.establishment.create).toHaveBeenCalledTimes(1);
    });

    it('should create an establishment without optional fields', async () => {
      const createDto: CreateEstablishmentDto = {
        establishmentId: mockEstablishment.establishmentId,
        name: mockEstablishment.name,
        address: mockEstablishment.address,
        location: mockEstablishment.location,
        userId: mockEstablishment.userId,
        cityId: mockEstablishment.cityId,
      };

      const establishmentWithoutOptionals = {
        establishmentId: mockEstablishment.establishmentId,
        name: mockEstablishment.name,
        address: mockEstablishment.address,
        location: mockEstablishment.location,
        userId: mockEstablishment.userId,
        cityId: mockEstablishment.cityId,
        createdAt: new Date(),
        updatedAt: new Date(),
        city: mockCity,
      };

      mockPrismaService.establishment.create.mockResolvedValue(establishmentWithoutOptionals);

      const result = await service.create(createDto);

      expect(result).toEqual(establishmentWithoutOptionals);
      expect(mockPrismaService.establishment.create).toHaveBeenCalledWith({
        data: createDto,
      });
      expect(mockPrismaService.establishment.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if creation fails', async () => {
      const createDto: CreateEstablishmentDto = {
        establishmentId: mockEstablishment.establishmentId,
        name: mockEstablishment.name,
        address: mockEstablishment.address,
        location: mockEstablishment.location,
        userId: mockEstablishment.userId,
        cityId: mockEstablishment.cityId,
      };

      const error = new Error('Database error');
      mockPrismaService.establishment.create.mockRejectedValue(error);

      await expect(service.create(createDto)).rejects.toThrow('Database error');
      expect(mockPrismaService.establishment.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of establishments', async () => {
      const establishments = [mockEstablishment];
      mockPrismaService.establishment.findMany.mockResolvedValue(establishments);

      const result = await service.findAll();

      expect(result).toEqual(establishments);
      expect(mockPrismaService.establishment.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array if no establishments exist', async () => {
      mockPrismaService.establishment.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockPrismaService.establishment.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single establishment by id', async () => {
      mockPrismaService.establishment.findUnique.mockResolvedValue(mockEstablishment);

      const result = await service.findOne(mockEstablishment.establishmentId);

      expect(result).toEqual(mockEstablishment);
      expect(mockPrismaService.establishment.findUnique).toHaveBeenCalledWith({
        where: { establishmentId: mockEstablishment.establishmentId },
      });
      expect(mockPrismaService.establishment.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should return null if establishment does not exist', async () => {
      mockPrismaService.establishment.findUnique.mockResolvedValue(null);

      const result = await service.findOne('non-existent-id');

      expect(result).toBeNull();
      expect(mockPrismaService.establishment.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByUserId', () => {
    it('should return establishment by userId', async () => {
      mockPrismaService.establishment.findFirst.mockResolvedValue(mockEstablishment);

      const result = await service.findByUserId(mockEstablishment.userId);

      expect(result).toEqual(mockEstablishment);
      expect(mockPrismaService.establishment.findFirst).toHaveBeenCalledWith({
        where: { userId: mockEstablishment.userId },
      });
      expect(mockPrismaService.establishment.findFirst).toHaveBeenCalledTimes(1);
    });

    it('should return null if no establishment found for userId', async () => {
      mockPrismaService.establishment.findFirst.mockResolvedValue(null);

      const result = await service.findByUserId('non-existent-user-id');

      expect(result).toBeNull();
      expect(mockPrismaService.establishment.findFirst).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update an establishment', async () => {
      const updateDto: UpdateEstablishmentDto = {
        name: 'Updated Bakery',
        description: 'An updated bakery',
      };

      const updatedEstablishment = { ...mockEstablishment, ...updateDto };
      mockPrismaService.establishment.update.mockResolvedValue(updatedEstablishment);

      const result = await service.update(mockEstablishment.establishmentId, updateDto);

      expect(result).toEqual(updatedEstablishment);
      expect(mockPrismaService.establishment.update).toHaveBeenCalledWith({
        where: { establishmentId: mockEstablishment.establishmentId },
        data: updateDto,
      });
      expect(mockPrismaService.establishment.update).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if update fails', async () => {
      const updateDto: UpdateEstablishmentDto = { name: 'Updated Bakery' };
      const error = new Error('Update failed');
      mockPrismaService.establishment.update.mockRejectedValue(error);

      await expect(service.update(mockEstablishment.establishmentId, updateDto)).rejects.toThrow(
        'Update failed',
      );
      expect(mockPrismaService.establishment.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should delete an establishment', async () => {
      mockPrismaService.establishment.delete.mockResolvedValue(mockEstablishment);

      const result = await service.remove(mockEstablishment.establishmentId);

      expect(result).toEqual(mockEstablishment);
      expect(mockPrismaService.establishment.delete).toHaveBeenCalledWith({
        where: { establishmentId: mockEstablishment.establishmentId },
      });
      expect(mockPrismaService.establishment.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if deletion fails', async () => {
      const error = new Error('Deletion failed');
      mockPrismaService.establishment.delete.mockRejectedValue(error);

      await expect(service.remove(mockEstablishment.establishmentId)).rejects.toThrow(
        'Deletion failed',
      );
      expect(mockPrismaService.establishment.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByCity', () => {
    it('should return establishments by city id', async () => {
      const establishments = [mockEstablishment];
      mockPrismaService.establishment.findMany.mockResolvedValue(establishments);

      const result = await service.findByCity(mockCity.cityId);

      expect(result).toEqual(establishments);
      expect(mockPrismaService.establishment.findMany).toHaveBeenCalledWith({
        where: { cityId: mockCity.cityId },
        include: {
          city: {
            include: {
              department: true,
            },
          },
        },
      });
      expect(mockPrismaService.establishment.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return empty array if no establishments found in city', async () => {
      mockPrismaService.establishment.findMany.mockResolvedValue([]);

      const result = await service.findByCity('non-existent-city-id');

      expect(result).toEqual([]);
      expect(mockPrismaService.establishment.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByDepartment', () => {
    it('should return establishments by department id', async () => {
      const establishments = [mockEstablishment];
      mockPrismaService.establishment.findMany.mockResolvedValue(establishments);

      const result = await service.findByDepartment(mockCity.department.departmentId);

      expect(result).toEqual(establishments);
      expect(mockPrismaService.establishment.findMany).toHaveBeenCalledWith({
        where: {
          city: {
            departmentId: mockCity.department.departmentId,
          },
        },
        include: {
          city: {
            include: {
              department: true,
            },
          },
        },
      });
      expect(mockPrismaService.establishment.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return empty array if no establishments found in department', async () => {
      mockPrismaService.establishment.findMany.mockResolvedValue([]);

      const result = await service.findByDepartment('non-existent-department-id');

      expect(result).toEqual([]);
      expect(mockPrismaService.establishment.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByNeighborhood', () => {
    it('should return establishments by neighborhood (case-insensitive)', async () => {
      const establishments = [mockEstablishment];
      mockPrismaService.establishment.findMany.mockResolvedValue(establishments);

      const result = await service.findByNeighborhood('Granada');

      expect(result).toEqual(establishments);
      expect(mockPrismaService.establishment.findMany).toHaveBeenCalledWith({
        where: {
          neighborhood: {
            contains: 'Granada',
            mode: 'insensitive',
          },
        },
        include: {
          city: {
            include: {
              department: true,
            },
          },
        },
      });
      expect(mockPrismaService.establishment.findMany).toHaveBeenCalledTimes(1);
    });

    it('should find establishments with partial neighborhood match', async () => {
      const establishments = [mockEstablishment];
      mockPrismaService.establishment.findMany.mockResolvedValue(establishments);

      const result = await service.findByNeighborhood('gran');

      expect(result).toEqual(establishments);
      expect(mockPrismaService.establishment.findMany).toHaveBeenCalledWith({
        where: {
          neighborhood: {
            contains: 'gran',
            mode: 'insensitive',
          },
        },
        include: {
          city: {
            include: {
              department: true,
            },
          },
        },
      });
      expect(mockPrismaService.establishment.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return empty array if no establishments found in neighborhood', async () => {
      mockPrismaService.establishment.findMany.mockResolvedValue([]);

      const result = await service.findByNeighborhood('NonExistentNeighborhood');

      expect(result).toEqual([]);
      expect(mockPrismaService.establishment.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByLocation', () => {
    it('should find establishments by city id', async () => {
      const establishments = [mockEstablishment];
      mockPrismaService.establishment.findMany.mockResolvedValue(establishments);

      const result = await service.findByLocation({ cityId: mockCity.cityId });

      expect(result).toEqual(establishments);
      expect(mockPrismaService.establishment.findMany).toHaveBeenCalledWith({
        where: { cityId: mockCity.cityId },
        include: {
          city: {
            include: {
              department: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });
      expect(mockPrismaService.establishment.findMany).toHaveBeenCalledTimes(1);
    });

    it('should find establishments by department id', async () => {
      const establishments = [mockEstablishment];
      mockPrismaService.establishment.findMany.mockResolvedValue(establishments);

      const result = await service.findByLocation({
        departmentId: mockCity.department.departmentId,
      });

      expect(result).toEqual(establishments);
      expect(mockPrismaService.establishment.findMany).toHaveBeenCalledWith({
        where: {
          city: {
            departmentId: mockCity.department.departmentId,
          },
        },
        include: {
          city: {
            include: {
              department: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });
      expect(mockPrismaService.establishment.findMany).toHaveBeenCalledTimes(1);
    });

    it('should find establishments by neighborhood', async () => {
      const establishments = [mockEstablishment];
      mockPrismaService.establishment.findMany.mockResolvedValue(establishments);

      const result = await service.findByLocation({ neighborhood: 'Granada' });

      expect(result).toEqual(establishments);
      expect(mockPrismaService.establishment.findMany).toHaveBeenCalledWith({
        where: {
          neighborhood: {
            contains: 'Granada',
            mode: 'insensitive',
          },
        },
        include: {
          city: {
            include: {
              department: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });
      expect(mockPrismaService.establishment.findMany).toHaveBeenCalledTimes(1);
    });

    it('should find establishments by city and neighborhood combined', async () => {
      const establishments = [mockEstablishment];
      mockPrismaService.establishment.findMany.mockResolvedValue(establishments);

      const result = await service.findByLocation({
        cityId: mockCity.cityId,
        neighborhood: 'Granada',
      });

      expect(result).toEqual(establishments);
      expect(mockPrismaService.establishment.findMany).toHaveBeenCalledWith({
        where: {
          cityId: mockCity.cityId,
          neighborhood: {
            contains: 'Granada',
            mode: 'insensitive',
          },
        },
        include: {
          city: {
            include: {
              department: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });
      expect(mockPrismaService.establishment.findMany).toHaveBeenCalledTimes(1);
    });

    it('should prioritize city over department when both provided', async () => {
      const establishments = [mockEstablishment];
      mockPrismaService.establishment.findMany.mockResolvedValue(establishments);

      const result = await service.findByLocation({
        cityId: mockCity.cityId,
        departmentId: mockCity.department.departmentId,
      });

      expect(result).toEqual(establishments);
      expect(mockPrismaService.establishment.findMany).toHaveBeenCalledWith({
        where: {
          cityId: mockCity.cityId,
        },
        include: {
          city: {
            include: {
              department: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });
      expect(mockPrismaService.establishment.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return establishments ordered by name', async () => {
      const establishments = [
        { ...mockEstablishment, name: 'Bakery A' },
        { ...mockEstablishment, name: 'Bakery B' },
      ];
      mockPrismaService.establishment.findMany.mockResolvedValue(establishments);

      const result = await service.findByLocation({ cityId: mockCity.cityId });

      expect(result).toEqual(establishments);
      expect(mockPrismaService.establishment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: {
            name: 'asc',
          },
        }),
      );
    });

    it('should return empty array if no establishments match filters', async () => {
      mockPrismaService.establishment.findMany.mockResolvedValue([]);

      const result = await service.findByLocation({
        cityId: 'non-existent-id',
        neighborhood: 'NonExistent',
      });

      expect(result).toEqual([]);
      expect(mockPrismaService.establishment.findMany).toHaveBeenCalledTimes(1);
    });
  });
});
