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
}
