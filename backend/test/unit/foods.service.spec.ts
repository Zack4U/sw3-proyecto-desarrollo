import { Test, TestingModule } from '@nestjs/testing';
import { FoodsService } from '../../src/services/foods.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CreateFoodDto } from '../../src/dtos/Foods/create-food.dto';
import { UpdateFoodDto } from '../../src/dtos/Foods/update-food.dto';
import { FoodStatus } from '@prisma/client';

describe('FoodsService', () => {
  let service: FoodsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    food: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockFood = {
    foodId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Whole Wheat Bread',
    description: 'Fresh whole wheat bread',
    category: 'Bakery',
    quantity: 10,
    weightOfUnit: 'units',
    status: FoodStatus.AVAILABLE,
    imageUrl: 'https://example.com/bread.jpg',
    expiresAt: new Date('2025-10-20'),
    establishmentId: '123e4567-e89b-12d3-a456-426614174000',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FoodsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<FoodsService>(FoodsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new food', async () => {
      const createDto: CreateFoodDto = {
        name: mockFood.name,
        description: mockFood.description,
        category: mockFood.category,
        quantity: mockFood.quantity,
        weightOfUnit: mockFood.weightOfUnit,
        status: 'AVAILABLE',
        imageUrl: mockFood.imageUrl,
        expiresAt: mockFood.expiresAt,
        establishmentId: mockFood.establishmentId,
      };

      mockPrismaService.food.create.mockResolvedValue(mockFood);

      const result = await service.create(createDto);

      expect(result).toEqual(mockFood);
      expect(mockPrismaService.food.create).toHaveBeenCalledWith({
        data: {
          ...createDto,
          status: FoodStatus.AVAILABLE,
        },
      });
      expect(mockPrismaService.food.create).toHaveBeenCalledTimes(1);
    });

    it('should create a food with default status if not provided', async () => {
      const createDto: CreateFoodDto = {
        name: mockFood.name,
        quantity: mockFood.quantity,
        weightOfUnit: mockFood.weightOfUnit,
        expiresAt: mockFood.expiresAt,
        establishmentId: mockFood.establishmentId,
      };

      mockPrismaService.food.create.mockResolvedValue(mockFood);

      await service.create(createDto);

      expect(mockPrismaService.food.create).toHaveBeenCalledWith({
        data: {
          ...createDto,
          status: undefined,
        },
      });
    });

    it('should throw an error if creation fails', async () => {
      const createDto: CreateFoodDto = {
        name: mockFood.name,
        quantity: mockFood.quantity,
        weightOfUnit: mockFood.weightOfUnit,
        expiresAt: mockFood.expiresAt,
        establishmentId: mockFood.establishmentId,
      };

      const error = new Error('Database error');
      mockPrismaService.food.create.mockRejectedValue(error);

      await expect(service.create(createDto)).rejects.toThrow('Database error');
      expect(mockPrismaService.food.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of foods', async () => {
      const foods = [mockFood];
      mockPrismaService.food.findMany.mockResolvedValue(foods);

      const result = await service.findAll();

      expect(result).toEqual(foods);
      expect(mockPrismaService.food.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array if no foods exist', async () => {
      mockPrismaService.food.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockPrismaService.food.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single food by id', async () => {
      mockPrismaService.food.findUnique.mockResolvedValue(mockFood);

      const result = await service.findOne(mockFood.foodId);

      expect(result).toEqual(mockFood);
      expect(mockPrismaService.food.findUnique).toHaveBeenCalledWith({
        where: { foodId: mockFood.foodId },
      });
      expect(mockPrismaService.food.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should return null if food does not exist', async () => {
      mockPrismaService.food.findUnique.mockResolvedValue(null);

      const result = await service.findOne('non-existent-id');

      expect(result).toBeNull();
      expect(mockPrismaService.food.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update a food', async () => {
      const updateDto: UpdateFoodDto = {
        name: 'Updated Bread',
        quantity: 15,
        status: 'RESERVED',
      };

      const updatedFood = {
        ...mockFood,
        name: updateDto.name,
        quantity: updateDto.quantity,
        status: FoodStatus.RESERVED,
      };
      mockPrismaService.food.update.mockResolvedValue(updatedFood);

      const result = await service.update(mockFood.foodId, updateDto);

      expect(result).toEqual(updatedFood);
      expect(mockPrismaService.food.update).toHaveBeenCalledWith({
        where: { foodId: mockFood.foodId },
        data: {
          name: updateDto.name,
          quantity: updateDto.quantity,
          status: FoodStatus.RESERVED,
        },
      });
      expect(mockPrismaService.food.update).toHaveBeenCalledTimes(1);
    });

    it('should exclude establishmentId from update data', async () => {
      const updateDto: UpdateFoodDto = {
        name: 'Updated Bread',
        establishmentId: 'new-establishment-id',
        status: FoodStatus.RESERVED,
      };

      const updatedFood = {
        ...mockFood,
        name: updateDto.name,
        status: FoodStatus.RESERVED,
      };

      mockPrismaService.food.update.mockResolvedValue(updatedFood);

      await service.update(mockFood.foodId, updateDto);

      expect(mockPrismaService.food.update).toHaveBeenCalledWith({
        where: { foodId: mockFood.foodId },
        data: {
          name: updateDto.name,
          status: FoodStatus.RESERVED,
        },
      });
    });

    it('should throw an error if update fails', async () => {
      const updateDto: UpdateFoodDto = { name: 'Updated Bread' };
      const error = new Error('Update failed');
      mockPrismaService.food.update.mockRejectedValue(error);

      await expect(service.update(mockFood.foodId, updateDto)).rejects.toThrow('Update failed');
      expect(mockPrismaService.food.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should delete a food', async () => {
      mockPrismaService.food.delete.mockResolvedValue(mockFood);

      const result = await service.remove(mockFood.foodId);

      expect(result).toEqual(mockFood);
      expect(mockPrismaService.food.delete).toHaveBeenCalledWith({
        where: { foodId: mockFood.foodId },
      });
      expect(mockPrismaService.food.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if deletion fails', async () => {
      const error = new Error('Deletion failed');
      mockPrismaService.food.delete.mockRejectedValue(error);

      await expect(service.remove(mockFood.foodId)).rejects.toThrow('Deletion failed');
      expect(mockPrismaService.food.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByEstablishment', () => {
    it('should return foods by establishment id', async () => {
      const foods = [mockFood];
      mockPrismaService.food.findMany.mockResolvedValue(foods);

      const result = await service.findByEstablishment(mockFood.establishmentId);

      expect(result).toEqual(foods);
      expect(mockPrismaService.food.findMany).toHaveBeenCalledWith({
        where: { establishmentId: mockFood.establishmentId },
      });
      expect(mockPrismaService.food.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array if no foods found for establishment', async () => {
      mockPrismaService.food.findMany.mockResolvedValue([]);

      const result = await service.findByEstablishment('non-existent-id');

      expect(result).toEqual([]);
      expect(mockPrismaService.food.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByCategory', () => {
    it('should return foods by category', async () => {
      const foods = [mockFood];
      mockPrismaService.food.findMany.mockResolvedValue(foods);

      const result = await service.findByCategory('Bakery');

      expect(result).toEqual(foods);
      expect(mockPrismaService.food.findMany).toHaveBeenCalledWith({
        where: { category: 'Bakery' },
      });
      expect(mockPrismaService.food.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array if no foods found for category', async () => {
      mockPrismaService.food.findMany.mockResolvedValue([]);

      const result = await service.findByCategory('NonExistent');

      expect(result).toEqual([]);
      expect(mockPrismaService.food.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByName', () => {
    it('should return foods by name (case insensitive)', async () => {
      const foods = [mockFood];
      mockPrismaService.food.findMany.mockResolvedValue(foods);

      const result = await service.findByName('bread');

      expect(result).toEqual(foods);
      expect(mockPrismaService.food.findMany).toHaveBeenCalledWith({
        where: { name: { contains: 'bread', mode: 'insensitive' } },
      });
      expect(mockPrismaService.food.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array if no foods match the name', async () => {
      mockPrismaService.food.findMany.mockResolvedValue([]);

      const result = await service.findByName('nonexistent');

      expect(result).toEqual([]);
      expect(mockPrismaService.food.findMany).toHaveBeenCalledTimes(1);
    });
  });
});
