import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../src/services/users.service';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  const mockUser = {
    userId: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    username: 'testuser',
    phone: '+1234567890',
    picture: null,
    documentNumber: '12345678',
    documentType: 'CC',
    role: 'ESTABLISHMENT',
    isVerified: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('should return a user by userId', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOne(mockUser.userId);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { userId: mockUser.userId },
        select: {
          userId: true,
          email: true,
          username: true,
          phone: true,
          picture: true,
          documentNumber: true,
          documentType: true,
          role: true,
          isVerified: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });

    it('should return null if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findOne('nonexistent-id');

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        userId: mockUser.userId,
        email: mockUser.email,
      });

      const result = await service.findByEmail(mockUser.email);

      expect(result).toEqual({
        userId: mockUser.userId,
        email: mockUser.email,
      });
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockUser.email },
        select: { userId: true, email: true },
      });
    });

    it('should return null if email not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update user with valid data', async () => {
      const updateDto = {
        email: 'newemail@example.com',
        phone: '+9876543210',
      };

      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);
      mockPrismaService.user.findFirst.mockResolvedValueOnce(null);
      mockPrismaService.user.update.mockResolvedValue({
        ...mockUser,
        ...updateDto,
      });

      const result = await service.update(mockUser.userId, updateDto);

      expect(result).toEqual({
        ...mockUser,
        ...updateDto,
      });
      expect(mockPrismaService.user.update).toHaveBeenCalled();
    });

    it('should throw error if email is already in use', async () => {
      const updateDto = {
        email: 'existing@example.com',
      };

      const existingUser = {
        userId: 'other-user-id',
        email: 'existing@example.com',
      };

      mockPrismaService.user.findUnique.mockResolvedValueOnce(existingUser);

      await expect(service.update(mockUser.userId, updateDto)).rejects.toThrow(
        'Email already in use',
      );
    });

    it('should throw error if document number is already in use', async () => {
      const updateDto = {
        documentNumber: '87654321',
      };

      const existingUser = {
        userId: 'other-user-id',
        documentNumber: '87654321',
      };

      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);
      mockPrismaService.user.findFirst.mockResolvedValueOnce(existingUser);

      await expect(service.update(mockUser.userId, updateDto)).rejects.toThrow(
        'Document number already in use',
      );
    });

    it('should allow updating email for the same user', async () => {
      const updateDto = {
        email: 'sameuser@example.com',
      };

      const sameUser = {
        userId: mockUser.userId,
        email: 'sameuser@example.com',
      };

      mockPrismaService.user.findUnique.mockResolvedValueOnce(sameUser);
      mockPrismaService.user.findFirst.mockResolvedValueOnce(null);
      mockPrismaService.user.update.mockResolvedValue({
        ...mockUser,
        ...updateDto,
      });

      const result = await service.update(mockUser.userId, updateDto);

      expect(result).toEqual({
        ...mockUser,
        ...updateDto,
      });
    });

    it('should update only provided fields', async () => {
      const updateDto = {
        phone: '+1111111111',
      };

      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);
      mockPrismaService.user.findFirst.mockResolvedValueOnce(null);
      mockPrismaService.user.update.mockResolvedValue({
        ...mockUser,
        phone: '+1111111111',
      });

      await service.update(mockUser.userId, updateDto);

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { userId: mockUser.userId },
        data: { phone: '+1111111111' },
        select: {
          userId: true,
          email: true,
          username: true,
          phone: true,
          picture: true,
          documentNumber: true,
          documentType: true,
          role: true,
          isVerified: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });
  });

  describe('changePassword', () => {
    it('should update user password', async () => {
      const newPasswordHash = 'hashed_password_123';
      mockPrismaService.user.update.mockResolvedValue({
        ...mockUser,
        password: newPasswordHash,
      });

      const result = await service.changePassword(mockUser.userId, newPasswordHash);

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { userId: mockUser.userId },
        data: { password: newPasswordHash },
      });
      expect(result.password).toBe(newPasswordHash);
    });
  });
});
