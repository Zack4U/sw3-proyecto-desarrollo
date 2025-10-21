import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import {
  LoginDto,
  RegisterDto,
  GoogleAuthDto,
  AuthResponseDto,
  RegisterBeneficiaryDto,
  RegisterEstablishmentDto,
  GoogleAuthBeneficiaryDto,
  GoogleAuthEstablishmentDto,
  GoogleLoginCommonDto,
  CompleteProfileDto,
} from '../dtos/Auth';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validar usuario por identifier (username, email o documentNumber) y contraseña
   */
  async validateUser(identifier: string, password: string): Promise<any> {
    // Buscar usuario por username, email o documentNumber
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: identifier }, { email: identifier }, { documentNumber: identifier }],
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.password) {
      throw new UnauthorizedException('User registered with Google. Use Google login.');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Retornar usuario sin la contraseña
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Login con usuario y contraseña
   */
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(loginDto.identifier, loginDto.password);
    return this.generateTokens(user);
  }

  /**
   * Registrar nuevo beneficiario
   */
  async registerBeneficiary(registerDto: RegisterBeneficiaryDto): Promise<AuthResponseDto> {
    const { email, username, documentNumber, password, confirmPassword } = registerDto;

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Verificar si el usuario ya existe
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username: username || undefined },
          { documentNumber: documentNumber || undefined },
        ].filter((condition) => Object.values(condition)[0]),
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'User with this email, username or document number already exists',
      );
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario beneficiario
    const userId = uuidv4();
    const user = await this.prisma.user.create({
      data: {
        userId,
        email,
        username: username || null,
        documentNumber: documentNumber || null,
        password: hashedPassword,
        role: 'BENEFICIARY',
        isVerified: true,
        isActive: true,
      },
    });

    // Generar tokens
    return this.generateTokens(user);
  }

  /**
   * Login con Google para beneficiarios
   */
  async googleLoginBeneficiary(googleAuthDto: GoogleAuthBeneficiaryDto): Promise<AuthResponseDto> {
    let user = await this.prisma.user.findUnique({
      where: { email: googleAuthDto.email },
    });

    if (!user) {
      // Crear nuevo usuario beneficiario de Google
      const userId = uuidv4();
      user = await this.prisma.user.create({
        data: {
          userId,
          email: googleAuthDto.email || '',
          username: googleAuthDto.name?.split(' ')[0] || googleAuthDto.email?.split('@')[0],
          picture: googleAuthDto.name,
          role: 'BENEFICIARY',
          isVerified: true,
          isActive: true,
        },
      });
    } else if (user.role !== 'BENEFICIARY') {
      throw new BadRequestException('This email is registered as an establishment');
    } else if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    return this.generateTokens(user);
  }

  /**
   * Registrar nuevo establecimiento
   */
  async registerEstablishment(registerDto: RegisterEstablishmentDto): Promise<AuthResponseDto> {
    const { email, establishmentName, documentNumber, password, confirmPassword } = registerDto;

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Verificar si el usuario ya existe
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username: establishmentName },
          { documentNumber: documentNumber || undefined },
        ].filter((condition) => Object.values(condition)[0]),
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'Establishment with this email, name or document number already exists',
      );
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario establecimiento
    const userId = uuidv4();
    const user = await this.prisma.user.create({
      data: {
        userId,
        email,
        username: establishmentName,
        documentNumber: documentNumber || null,
        password: hashedPassword,
        role: 'ESTABLISHMENT',
        isVerified: true,
        isActive: true,
      },
    });

    // Generar tokens
    return this.generateTokens(user);
  }

  /**
   * Login con Google para establecimientos
   */
  async googleLoginEstablishment(
    googleAuthDto: GoogleAuthEstablishmentDto,
  ): Promise<AuthResponseDto> {
    let user = await this.prisma.user.findUnique({
      where: { email: googleAuthDto.email },
    });

    if (!user) {
      // Crear nuevo usuario establecimiento de Google
      const userId = uuidv4();
      user = await this.prisma.user.create({
        data: {
          userId,
          email: googleAuthDto.email || '',
          username: googleAuthDto.name || googleAuthDto.email?.split('@')[0],
          picture: googleAuthDto.name,
          role: 'ESTABLISHMENT',
          isVerified: true,
          isActive: true,
        },
      });
    } else if (user.role !== 'ESTABLISHMENT') {
      throw new BadRequestException('This email is registered as a beneficiary');
    } else if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    return this.generateTokens(user);
  }

  /**
   * Generar access token y refresh token
   */
  private async generateTokens(user: any): Promise<AuthResponseDto> {
    const payload = {
      sub: user.userId,
      email: user.email,
      username: user.username,
      role: user.role,
      isActive: user.isActive,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: 3600, // 1 hour in seconds
      userId: user.userId,
      email: user.email,
    };
  }

  /**
   * Refrescar access token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    // Primero verificar el token; si la verificación falla lanzamos Invalid refresh token
    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-this',
      });
    } catch (err) {
      // Error al verificar el refresh token
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Si el token es válido, buscamos el usuario y lanzamos excepciones específicas si aplica
    const user = await this.prisma.user.findUnique({
      where: { userId: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    return this.generateTokens(user);
  }

  /**
   * Obtener perfil del usuario
   */
  async getProfile(userId: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Retornar todos los datos excepto la contraseña
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Validar si el token es válido
   * Endpoint útil para sincronizar estado en la app móvil
   * Ideal para verificar sesión al iniciar la app
   */
  async validateToken(token: string): Promise<{ valid: boolean; user?: any; expiresIn?: number }> {
    try {
      const accessTokenSecret = process.env.JWT_SECRET || 'your-secret-key-change-this';
      const payload = this.jwtService.verify(token, {
        secret: accessTokenSecret,
      });

      const user = await this.prisma.user.findUnique({
        where: { userId: payload.sub },
      });

      if (!user || !user.isActive) {
        return { valid: false };
      }

      const expiresIn = parseInt(process.env.JWT_EXPIRATION || '3600');

      return {
        valid: true,
        user: { userId: user.userId, email: user.email, role: user.role },
        expiresIn,
      };
    } catch (error) {
      return { valid: false };
    }
  }

  /**
   * Cambiar contraseña del usuario
   * Endpoint para seguridad adicional
   */
  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<{ success: boolean; message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.password) {
      throw new BadRequestException('User registered with Google. Cannot change password.');
    }

    // Verificar contraseña antigua
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña
    await this.prisma.user.update({
      where: { userId },
      data: { password: hashedPassword },
    });

    return { success: true, message: 'Password changed successfully' };
  }

  /**
   * Google login común - crea usuario con datos mínimos
   * isActive = false hasta que complete el perfil
   */
  async googleLoginCommon(googleAuthDto: GoogleLoginCommonDto): Promise<AuthResponseDto> {
    // Verificar si el usuario ya existe
    let user = await this.prisma.user.findUnique({
      where: { email: googleAuthDto.email },
    });

    if (!user) {
      // Crear nuevo usuario con isActive = false
      const userId = uuidv4();
      user = await this.prisma.user.create({
        data: {
          userId,
          email: googleAuthDto.email,
          username: googleAuthDto.name?.split(' ')[0] || googleAuthDto.email?.split('@')[0],
          picture: googleAuthDto.picture || googleAuthDto.name,
          googleId: googleAuthDto.googleId || null,
          role: 'BENEFICIARY', // Rol por defecto, se actualizará al completar perfil
          isVerified: true,
          isActive: false, // Requiere completar perfil
        },
      });
    } else if (!user.isActive) {
      // Usuario existe pero no completó perfil - permitir continuar
      // Actualizar googleId si es necesario
      if (googleAuthDto.googleId && !user.googleId) {
        user = await this.prisma.user.update({
          where: { email: googleAuthDto.email },
          data: { googleId: googleAuthDto.googleId },
        });
      }
    } else {
      // Usuario existe y está activo - login normal
      return this.generateTokens(user);
    }

    return this.generateTokens(user);
  }

  /**
   * Completar perfil del usuario después de Google login
   * Actualiza los datos del usuario y establece isActive = true
   *
   * FLUJO COMPLETO:
   * 1. Usuario hace login con Google (endpoints: POST /auth/google/login)
   *    - Se crea usuario con isActive = false
   *    - Se retornan tokens de acceso y refresh
   *
   * 2. App redirecciona a CompleteProfileScreen (frontend)
   *    - Paso 1: Usuario selecciona rol (BENEFICIARY o ESTABLISHMENT)
   *    - Paso 2: Usuario completa datos según el rol
   *
   * 3. Este endpoint se ejecuta (POST /auth/profile/complete)
   *    - Valida los datos completados
   *    - Crea Beneficiario O Establecimiento según el rol
   *    - Actualiza usuario con isActive = true
   *    - Retorna nuevos tokens
   *
   * 4. App navega a HomeScreen
   *    - Usuario ya tiene acceso completo a la plataforma
   *
   * PARA BENEFICIARIO:
   * - Crea registro en tabla Beneficiary
   * - Actualiza campos: name, lastName, phone, documentType, documentNumber
   *
   * PARA ESTABLECIMIENTO:
   * - Crea registro en tabla Establishment
   * - Actualiza campos: name, phone, address, neighborhood, city, description, establishmentType
   */
  async completeUserProfile(
    userId: string,
    completeProfileDto: CompleteProfileDto,
  ): Promise<AuthResponseDto> {
    // Verificar que el usuario existe
    const user = await this.prisma.user.findUnique({
      where: { userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Validar que sea un usuario de Google (sin contraseña)
    if (user.password) {
      throw new BadRequestException('This user was not registered with Google');
    }

    // Preparar datos a actualizar según el rol
    const updateData: any = {
      username: completeProfileDto.username || user.username,
      phone: completeProfileDto.phone || null,
      role: completeProfileDto.role,
      isActive: true, // Activar usuario después de completar perfil
      googleId: completeProfileDto.googleId || user.googleId || null,
    };

    // Datos específicos para beneficiario
    if (completeProfileDto.role === 'BENEFICIARY') {
      if (!completeProfileDto.name || !completeProfileDto.lastName) {
        throw new BadRequestException('Name and lastName are required for beneficiary');
      }

      updateData.documentType = completeProfileDto.documentType || null;
      updateData.documentNumber = completeProfileDto.documentNumber || null;

      // Actualizar usuario
      const updatedUser = await this.prisma.user.update({
        where: { userId },
        data: updateData,
      });

      // Crear registro de beneficiario
      try {
        await this.prisma.beneficiary.create({
          data: {
            beneficiaryId: uuidv4(),
            name: completeProfileDto.name,
            lastName: completeProfileDto.lastName,
            userUserId: userId,
          },
        });
      } catch (error: any) {
        // Si falla la creación del beneficiario, revertir la actualización del usuario
        if (error.code === 'P2002') {
          throw new BadRequestException('A beneficiary with this last name already exists');
        }
        throw error;
      }

      return this.generateTokens(updatedUser);
    }

    // Datos específicos para establecimiento
    if (completeProfileDto.role === 'ESTABLISHMENT') {
      if (!completeProfileDto.name || !completeProfileDto.address || !completeProfileDto.cityId) {
        throw new BadRequestException('Name, address and cityId are required for establishment');
      }

      // Verificar que la ciudad existe
      const city = await this.prisma.city.findUnique({
        where: { cityId: completeProfileDto.cityId },
      });

      if (!city) {
        throw new BadRequestException('City not found');
      }

      updateData.username = completeProfileDto.name;
      updateData.documentNumber = completeProfileDto.documentNumber || null;

      // Actualizar usuario
      const updatedUser = await this.prisma.user.update({
        where: { userId },
        data: updateData,
      });

      // Crear establecimiento
      try {
        await this.prisma.establishment.create({
          data: {
            establishmentId: uuidv4(),
            name: completeProfileDto.name,
            description: completeProfileDto.description || null,
            address: completeProfileDto.address,
            neighborhood: completeProfileDto.neighborhood || null,
            establishmentType: (completeProfileDto.establishmentType as any) || null,
            userId,
            cityId: completeProfileDto.cityId,
            location: {}, // Inicialmente vacío, puede actualizarse después
          },
        });
      } catch (error: any) {
        console.error('Error creating establishment:', error);
        throw new BadRequestException(
          'Error creating establishment. Please verify all required fields are valid.',
        );
      }

      return this.generateTokens(updatedUser);
    }

    throw new BadRequestException('Invalid role provided');
  }
}
