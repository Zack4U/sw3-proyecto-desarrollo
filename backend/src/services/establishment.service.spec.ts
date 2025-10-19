import { Test, TestingModule } from '@nestjs/testing';
import { EstablishmentsService } from './establishment.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEstablishmentDto } from '../dtos/Establishments/create-establishment.dto';
import { UpdateEstablishmentDto } from '../dtos/Establishments/update-establishment.dto';

describe('EstablishmentsService', () => {
  let service: EstablishmentsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    establishment: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockEstablishment = {
    establishmentId: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Bakery',
    description: 'A test bakery',
    phone: '+34 912 345 678',
    email: 'test@bakery.com',
    address: 'Test Street 123',
    location: { type: 'Point', coordinates: [-3.7038, 40.4168] },
    establishmentType: 'Bakery',
    userId: '123e4567-e89b-12d3-a456-426614174001',
    createdAt: new Date(),
    updatedAt: new Date(),
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
        phone: mockEstablishment.phone,
        email: mockEstablishment.email,
        address: mockEstablishment.address,
        location: mockEstablishment.location,
        establishmentType: mockEstablishment.establishmentType,
        userId: mockEstablishment.userId,
      };

      mockPrismaService.establishment.create.mockResolvedValue(mockEstablishment);

      const result = await service.create(createDto);

      expect(result).toEqual(mockEstablishment);
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

      await expect(
        service.update(mockEstablishment.establishmentId, updateDto),
      ).rejects.toThrow('Update failed');
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
});
