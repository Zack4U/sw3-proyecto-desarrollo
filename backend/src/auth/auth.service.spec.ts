import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

// Mock de bcrypt y uuid
jest.mock('bcrypt');
jest.mock('uuid');

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    establishment: {
      findFirst: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockUser = {
    userId: '123e4567-e89b-12d3-a456-426614174000',
    email: 'john@example.com',
    username: 'john_doe',
    documentNumber: '1234567890',
    password: '$2b$10$hashedpassword',
    role: 'BENEFICIARY',
    isVerified: true,
    isActive: true,
    picture: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockEstablishment = {
    userId: '123e4567-e89b-12d3-a456-426614174001',
    email: 'info@restaurant.com',
    username: 'Mi Restaurante',
    documentNumber: '9876543210',
    password: '$2b$10$hashedpassword',
    role: 'ESTABLISHMENT',
    isVerified: true,
    isActive: true,
    picture: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate user with correct password', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);

      const result = await service.validateUser('john@example.com', 'password123');

      expect(result).toEqual(
        expect.objectContaining({
          userId: mockUser.userId,
          email: mockUser.email,
          role: mockUser.role,
        }),
      );
      expect(result.password).toBeUndefined();
      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { username: 'john@example.com' },
            { email: 'john@example.com' },
            { documentNumber: 'john@example.com' },
          ],
        },
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      await expect(service.validateUser('nonexistent@example.com', 'password123')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);

      await expect(service.validateUser('john@example.com', 'wrongpassword')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user is registered with Google', async () => {
      const googleUser = { ...mockUser, password: null };
      mockPrismaService.user.findFirst.mockResolvedValue(googleUser);

      await expect(service.validateUser('john@example.com', 'password123')).rejects.toThrow(
        'User registered with Google. Use Google login.',
      );
    });

    it('should throw UnauthorizedException if user account is inactive', async () => {
      const inactiveUser = { ...mockUser, isActive: false };
      mockPrismaService.user.findFirst.mockResolvedValue(inactiveUser);

      await expect(service.validateUser('john@example.com', 'password123')).rejects.toThrow(
        'User account is inactive',
      );
    });

    it('should search by username, email, or documentNumber', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);

      // Test with documentNumber
      await service.validateUser('1234567890', 'password123');

      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { username: '1234567890' },
            { email: '1234567890' },
            { documentNumber: '1234567890' },
          ],
        },
      });
    });
  });

  describe('login', () => {
    it('should login user and return tokens', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);
      (uuidv4 as jest.Mock).mockReturnValue('token-uuid');
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.login({
        identifier: 'john@example.com',
        password: 'password123',
      });

      expect(result).toEqual({
        accessToken: 'mock-jwt-token',
        refreshToken: 'mock-jwt-token',
        tokenType: 'Bearer',
        expiresIn: 3600,
        userId: mockUser.userId,
        email: mockUser.email,
      });
      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
    });

    it('should throw error if credentials are invalid', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);

      await expect(
        service.login({
          identifier: 'john@example.com',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('registerBeneficiary', () => {
    it('should register a new beneficiary', async () => {
      const registerDto = {
        email: 'newuser@example.com',
        username: 'newuser',
        documentNumber: '1111111111',
        password: 'SecurePassword123',
        confirmPassword: 'SecurePassword123',
      };

      (uuidv4 as jest.Mock).mockReturnValue(mockUser.userId);
      (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$10$hashedpassword');
      mockPrismaService.user.findFirst.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.registerBeneficiary(registerDto);

      expect(result).toEqual({
        accessToken: 'mock-jwt-token',
        refreshToken: 'mock-jwt-token',
        tokenType: 'Bearer',
        expiresIn: 3600,
        userId: mockUser.userId,
        email: mockUser.email,
      });
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          userId: mockUser.userId,
          email: registerDto.email,
          username: registerDto.username,
          documentNumber: registerDto.documentNumber,
          password: '$2b$10$hashedpassword',
          role: 'BENEFICIARY',
          isVerified: true,
          isActive: true,
        },
      });
    });

    it('should throw BadRequestException if passwords do not match', async () => {
      const registerDto = {
        email: 'newuser@example.com',
        username: 'newuser',
        documentNumber: '1111111111',
        password: 'SecurePassword123',
        confirmPassword: 'DifferentPassword123',
      };

      await expect(service.registerBeneficiary(registerDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException if user already exists', async () => {
      const registerDto = {
        email: 'john@example.com',
        username: 'john_doe',
        documentNumber: '1234567890',
        password: 'SecurePassword123',
        confirmPassword: 'SecurePassword123',
      };

      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);

      await expect(service.registerBeneficiary(registerDto)).rejects.toThrow(ConflictException);
    });

    it('should handle optional username and documentNumber', async () => {
      const registerDto = {
        email: 'newuser@example.com',
        password: 'SecurePassword123',
        confirmPassword: 'SecurePassword123',
      };

      (uuidv4 as jest.Mock).mockReturnValue(mockUser.userId);
      (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$10$hashedpassword');
      mockPrismaService.user.findFirst.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        ...mockUser,
        username: null,
        documentNumber: null,
      });
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.registerBeneficiary(registerDto as any);

      expect(result).toBeDefined();
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: registerDto.email,
          username: null,
          documentNumber: null,
          role: 'BENEFICIARY',
        }),
      });
    });
  });

  describe('registerEstablishment', () => {
    it('should register a new establishment', async () => {
      const registerDto = {
        email: 'info@newrestaurant.com',
        establishmentName: 'New Restaurant',
        documentNumber: '2222222222',
        password: 'SecurePassword123',
        confirmPassword: 'SecurePassword123',
      };

      (uuidv4 as jest.Mock).mockReturnValue(mockEstablishment.userId);
      (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$10$hashedpassword');
      mockPrismaService.user.findFirst.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(mockEstablishment);
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.registerEstablishment(registerDto);

      expect(result).toBeDefined();
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          userId: mockEstablishment.userId,
          email: registerDto.email,
          username: registerDto.establishmentName,
          documentNumber: registerDto.documentNumber,
          password: '$2b$10$hashedpassword',
          role: 'ESTABLISHMENT',
          isVerified: true,
          isActive: true,
        },
      });
    });

    it('should throw BadRequestException if passwords do not match', async () => {
      const registerDto = {
        email: 'info@newrestaurant.com',
        establishmentName: 'New Restaurant',
        documentNumber: '2222222222',
        password: 'SecurePassword123',
        confirmPassword: 'DifferentPassword123',
      };

      await expect(service.registerEstablishment(registerDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException if establishment already exists', async () => {
      const registerDto = {
        email: 'info@restaurant.com',
        establishmentName: 'Mi Restaurante',
        documentNumber: '9876543210',
        password: 'SecurePassword123',
        confirmPassword: 'SecurePassword123',
      };

      mockPrismaService.user.findFirst.mockResolvedValue(mockEstablishment);

      await expect(service.registerEstablishment(registerDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('googleLoginBeneficiary', () => {
    it('should login beneficiary with Google', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.googleLoginBeneficiary({
        token: 'google-token',
        email: 'john@example.com',
        name: 'John Doe',
      });

      expect(result).toBeDefined();
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      });
    });

    it('should create new beneficiary if not exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      (uuidv4 as jest.Mock).mockReturnValue(mockUser.userId);
      mockPrismaService.user.create.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.googleLoginBeneficiary({
        token: 'google-token',
        email: 'newuser@gmail.com',
        name: 'New User',
      });

      expect(result).toBeDefined();
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: 'newuser@gmail.com',
          role: 'BENEFICIARY',
          isVerified: true,
          isActive: true,
        }),
      });
    });

    it('should throw BadRequestException if email is registered as establishment', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockEstablishment);

      await expect(
        service.googleLoginBeneficiary({
          token: 'google-token',
          email: 'info@restaurant.com',
          name: 'Restaurant',
        }),
      ).rejects.toThrow('This email is registered as an establishment');
    });

    it('should throw UnauthorizedException if beneficiary account is inactive', async () => {
      const inactiveUser = { ...mockUser, isActive: false };
      mockPrismaService.user.findUnique.mockResolvedValue(inactiveUser);

      await expect(
        service.googleLoginBeneficiary({
          token: 'google-token',
          email: 'john@example.com',
          name: 'John Doe',
        }),
      ).rejects.toThrow('User account is inactive');
    });
  });

  describe('googleLoginEstablishment', () => {
    it('should login establishment with Google', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockEstablishment);
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.googleLoginEstablishment({
        token: 'google-token',
        email: 'info@restaurant.com',
        name: 'Mi Restaurante',
      });

      expect(result).toBeDefined();
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'info@restaurant.com' },
      });
    });

    it('should create new establishment if not exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      (uuidv4 as jest.Mock).mockReturnValue(mockEstablishment.userId);
      mockPrismaService.user.create.mockResolvedValue(mockEstablishment);
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.googleLoginEstablishment({
        token: 'google-token',
        email: 'newrestaurant@gmail.com',
        name: 'New Restaurant',
      });

      expect(result).toBeDefined();
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: 'newrestaurant@gmail.com',
          role: 'ESTABLISHMENT',
          isVerified: true,
          isActive: true,
        }),
      });
    });

    it('should throw BadRequestException if email is registered as beneficiary', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        service.googleLoginEstablishment({
          token: 'google-token',
          email: 'john@example.com',
          name: 'John',
        }),
      ).rejects.toThrow('This email is registered as a beneficiary');
    });
  });

  describe('refreshToken', () => {
    it('should generate new access token', async () => {
      const mockPayload = { sub: mockUser.userId, email: mockUser.email };
      mockJwtService.verify.mockReturnValue(mockPayload);
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('new-access-token');

      const result = await service.refreshToken('valid-refresh-token');

      expect(result).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(mockJwtService.verify).toHaveBeenCalled();
      expect(mockPrismaService.user.findUnique).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refreshToken('invalid-refresh-token')).rejects.toThrow(
        'Invalid refresh token',
      );
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const mockPayload = { sub: 'non-existent-id', email: 'test@example.com' };
      mockJwtService.verify.mockReturnValue(mockPayload);
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.refreshToken('valid-refresh-token')).rejects.toThrow('User not found');
    });

    it('should throw UnauthorizedException if user is inactive', async () => {
      const mockPayload = { sub: mockUser.userId, email: mockUser.email };
      const inactiveUser = { ...mockUser, isActive: false };
      mockJwtService.verify.mockReturnValue(mockPayload);
      mockPrismaService.user.findUnique.mockResolvedValue(inactiveUser);

      await expect(service.refreshToken('valid-refresh-token')).rejects.toThrow(
        'User account is inactive',
      );
    });
  });

  describe('getProfile', () => {
    it('should return user profile without password', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getProfile(mockUser.userId);

      expect(result).toEqual(
        expect.objectContaining({
          userId: mockUser.userId,
          username: mockUser.username,
          email: mockUser.email,
          documentNumber: mockUser.documentNumber,
          role: mockUser.role,
          picture: mockUser.picture,
          createdAt: mockUser.createdAt,
          isActive: mockUser.isActive,
        }),
      );
      expect(result.password).toBeUndefined();
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { userId: mockUser.userId },
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getProfile('non-existent-id')).rejects.toThrow('User not found');
    });
  });

  describe('validateToken', () => {
    it('should validate a valid token', async () => {
      const mockPayload = { sub: mockUser.userId, email: mockUser.email };
      mockJwtService.verify.mockReturnValue(mockPayload);
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.validateToken('valid-token');

      expect(result.valid).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user.userId).toBe(mockUser.userId);
    });

    it('should return invalid for expired token', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Token expired');
      });

      const result = await service.validateToken('expired-token');

      expect(result.valid).toBe(false);
    });

    it('should return invalid if user does not exist', async () => {
      const mockPayload = { sub: 'non-existent-id', email: 'test@example.com' };
      mockJwtService.verify.mockReturnValue(mockPayload);
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.validateToken('valid-token-but-no-user');

      expect(result.valid).toBe(false);
    });

    it('should return invalid if user is inactive', async () => {
      const mockPayload = { sub: mockUser.userId, email: mockUser.email };
      const inactiveUser = { ...mockUser, isActive: false };
      mockJwtService.verify.mockReturnValue(mockPayload);
      mockPrismaService.user.findUnique.mockResolvedValue(inactiveUser);

      const result = await service.validateToken('valid-token');

      expect(result.valid).toBe(false);
    });
  });

  describe('changePassword', () => {
    it('should change user password', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$10$newhashedpassword');
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue({
        ...mockUser,
        password: '$2b$10$newhashedpassword',
      });

      const result = await service.changePassword(
        mockUser.userId,
        'oldPassword123',
        'newPassword123',
      );

      expect(result.success).toBe(true);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { userId: mockUser.userId },
        data: { password: '$2b$10$newhashedpassword' },
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.changePassword(mockUser.userId, 'oldPassword123', 'newPassword123'),
      ).rejects.toThrow('User not found');
    });

    it('should throw BadRequestException if user registered with Google', async () => {
      const googleUser = { ...mockUser, password: null };
      mockPrismaService.user.findUnique.mockResolvedValue(googleUser);

      await expect(
        service.changePassword(mockUser.userId, 'oldPassword123', 'newPassword123'),
      ).rejects.toThrow('User registered with Google. Cannot change password.');
    });

    it('should throw UnauthorizedException if old password is incorrect', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        service.changePassword(mockUser.userId, 'wrongOldPassword', 'newPassword123'),
      ).rejects.toThrow('Current password is incorrect');
    });
  });
});
