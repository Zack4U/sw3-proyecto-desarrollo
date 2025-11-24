import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import {
  LoginDto,
  RegisterDto,
  RegisterBasicDto,
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
import { EmailService } from 'src/notifications/email.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
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

    this.emailService
      .sendWelcomeEmail(user.email, user.username || 'User')
      .catch((err) =>this.logger.error('Error sending welcome email:', err));

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

      // Generar username único
      const baseName = googleAuthDto.name?.split(' ')[0] || googleAuthDto.email?.split('@')[0];
      const uniqueUsername = `${baseName}_${Date.now()}`;

      user = await this.prisma.user.create({
        data: {
          userId,
          email: googleAuthDto.email || '',
          username: uniqueUsername, // Username único
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

      // Generar username único
      const baseName = googleAuthDto.name || googleAuthDto.email?.split('@')[0];
      const uniqueUsername = `${baseName}_${Date.now()}`;

      user = await this.prisma.user.create({
        data: {
          userId,
          email: googleAuthDto.email || '',
          username: uniqueUsername, // Username único
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
    // Si el usuario es un establecimiento, buscar su establishmentId
    let establishmentId: string | undefined;
    if (user.role === 'ESTABLISHMENT') {
      const establishment = await this.prisma.establishment.findFirst({
        where: { userId: user.userId },
        select: { establishmentId: true },
      });
      establishmentId = establishment?.establishmentId;
      console.log(
        `🔍 [AUTH] Establecimiento encontrado para userId ${user.userId}: ${establishmentId}`,
      );
    }

    const payload = {
      sub: user.userId,
      email: user.email,
      username: user.username,
      role: user.role,
      isActive: user.isActive,
      ...(establishmentId && { establishmentId }), // Incluir establishmentId si existe
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
      ...(establishmentId && { establishmentId }), // Incluir establishmentId en la respuesta
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

      // Generar username único
      const baseName = googleAuthDto.name?.split(' ')[0] || googleAuthDto.email?.split('@')[0];
      const uniqueUsername = `${baseName}_${Date.now()}`;

      user = await this.prisma.user.create({
        data: {
          userId,
          email: googleAuthDto.email,
          username: uniqueUsername, // Username único temporal
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
   * Registro básico - crea usuario con email y password
   * isActive = false hasta que complete el perfil
   * Similar a googleLoginCommon pero con contraseña
   */
  async registerBasic(registerDto: RegisterBasicDto): Promise<AuthResponseDto> {
    const { email, password, confirmPassword } = registerDto;

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Verificar si el usuario ya existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario con isActive = false
    const userId = uuidv4();

    // Generar username único: email_parte + timestamp
    const baseUsername = email.split('@')[0];
    const uniqueUsername = `${baseUsername}_${Date.now()}`;

    const user = await this.prisma.user.create({
      data: {
        userId,
        email,
        username: uniqueUsername, // Username único temporal
        password: hashedPassword,
        role: 'BENEFICIARY', // Rol por defecto, se actualizará al completar perfil
        isVerified: true,
        isActive: false, // Requiere completar perfil
      },
    });

    return this.generateTokens(user);
  }

  /**
   * Completar perfil del usuario después de Google login o registro básico
   * Actualiza los datos del usuario y establece isActive = true
   *
   * FLUJO COMPLETO:
   * 1. Usuario hace login con Google (POST /auth/google/login) O
   *    Usuario crea cuenta básica (POST /auth/register)
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

    // Ya no validamos si tiene contraseña o no - puede venir de Google o de registro básico
    // Solo verificamos que no esté ya activo
    if (user.isActive) {
      throw new BadRequestException('User profile is already complete');
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

      // Verificar que la ciudad existe antes de crear el establecimiento
      if (completeProfileDto.cityId) {
        const cityExists = await this.prisma.city.findUnique({
          where: { cityId: completeProfileDto.cityId },
        });

        if (!cityExists) {
          throw new BadRequestException(
            `City with ID ${completeProfileDto.cityId} does not exist. Please select a valid city.`,
          );
        }
      }

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
            location: completeProfileDto.location
              ? {
                  type: completeProfileDto.location.type,
                  coordinates: completeProfileDto.location.coordinates,
                }
              : { type: 'Point', coordinates: [] }, // Formato GeoJSON válido pero vacío si no se proporciona
          },
        });
      } catch (error: any) {
        console.error('Error creating establishment:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        console.error('CityId provided:', completeProfileDto.cityId);
        throw new BadRequestException(
          `Error creating establishment. ${error.message || 'Please verify all required fields are valid.'}`,
        );
      }

      return this.generateTokens(updatedUser);
    }

    throw new BadRequestException('Invalid role provided');
  }

  /**
   * Solicitar recuperación de contraseña
   * Genera un token único y lo almacena en la base de datos
   *
   * @param email - Email del usuario
   * @returns Mensaje de confirmación y token (solo en desarrollo)
   */
  async requestPasswordReset(
    email: string,
  ): Promise<{ message: string; token?: string }> {
    this.logger.log(`Password reset requested for email: ${email}`);

    // Buscar usuario por email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // Por seguridad, NO se revela si el correo existe o no
    // Siempre se devuelve el mismo mensaje
    if (!user) {
      this.logger.warn(`Password reset requested for non-existent email: ${email}`);
      return {
        message:
          'Si el correo electrónico está registrado, recibirás instrucciones para recuperar tu contraseña',
      };
    }

    // Validar que el usuario tenga contraseña (no sea cuenta de Google)
    if (!user.password) {
      this.logger.warn(`Password reset requested for Google account: ${email}`);
      return {
        message:
          'Si el correo electrónico está registrado, recibirás instrucciones para recuperar tu contraseña',
      };
    }

    // Generar token único
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // Token válido por 10 minutos

    // Invalidar tokens anteriores del usuario que no hayan sido usados
    await this.prisma.passwordResetToken.updateMany({
      where: {
        userId: user.userId,
        used: false,
      },
      data: {
        used: true,
      },
    });

    // Crear nuevo token
    await this.prisma.passwordResetToken.create({
      data: {
        id: uuidv4(),
        token,
        userId: user.userId,
        expiresAt,
      },
    });

    this.logger.log(`Password reset token created for user: ${user.userId}`);

    // TODO: Implementar envío de email cuando el servicio esté disponible
    // await this.emailService.sendPasswordResetEmail(user.email, token);

    // TEMPORAL: En desarrollo, devolver el token en la respuesta
    // IMPORTANTE: Eliminar esto en producción
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (isDevelopment) {
      this.logger.debug(`[DEV ONLY] Reset token: ${token}`);
    }

    return {
      message:
        'Si el correo electrónico está registrado, recibirás instrucciones para recuperar tu contraseña',
      ...(isDevelopment && { token }), // Solo incluir token en desarrollo
    };
  }

  /**
   * Validar token de recuperación de contraseña
   *
   * @param token - Token a validar
   * @returns true si el token es válido, false en caso contrario
   */
  async validateResetToken(
    token: string
  ): Promise<boolean> {
    this.logger.log(`Validating reset token: ${token.substring(0, 8)}...`);

    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token },
    });

    // Validar que el token existe
    if (!resetToken) {
      this.logger.warn(`Token not found: ${token.substring(0, 8)}...`);
      return false;
    }

    // Validar que no haya sido usado
    if (resetToken.used) {
      this.logger.warn(`Token already used: ${token.substring(0, 8)}...`);
      return false;
    }

    // Validar que no haya expirado
    if (new Date() > resetToken.expiresAt) {
      this.logger.warn(`Token expired: ${token.substring(0, 8)}...`);
      return false;
    }

    this.logger.log(`Token is valid: ${token.substring(0, 8)}...`);
    return true;
  }

  /**
   * Restablecer contraseña usando token válido
   *
   * @param token - Token de recuperación
   * @param newPassword - Nueva contraseña
   * @returns Mensaje de confirmación
   */
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    this.logger.log(`Password reset attempt with token: ${token.substring(0, 8)}...`);

    // Buscar token con información del usuario
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    // Validar que el token existe
    if (!resetToken) {
      this.logger.warn(`Invalid token: ${token.substring(0, 8)}...`);
      throw new UnauthorizedException('Token inválido o expirado');
    }

    // Validar que no haya sido usado
    if (resetToken.used) {
      this.logger.warn(`Token already used: ${token.substring(0, 8)}...`);
      throw new UnauthorizedException('Este token ya ha sido utilizado');
    }

    // Validar que no haya expirado
    if (new Date() > resetToken.expiresAt) {
      this.logger.warn(`Token expired: ${token.substring(0, 8)}...`);
      throw new UnauthorizedException('El token ha expirado. Solicita uno nuevo');
    }

    // Validar que el usuario existe y tiene contraseña
    if (!resetToken.user) {
      this.logger.error(`User not found for token: ${token.substring(0, 8)}...`);
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (!resetToken.user.password) {
      this.logger.warn(`Cannot reset password for Google account: ${resetToken.user.email}`);
      throw new BadRequestException(
        'Esta cuenta está vinculada con Google. No puedes cambiar la contraseña',
      );
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña y marcar token como usado en una transacción
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { userId: resetToken.userId },
        data: { password: hashedPassword },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
      }),
    ]);

    this.logger.log(`Password successfully reset for user: ${resetToken.user.email}`);

    return { message: 'Contraseña actualizada exitosamente' };
  }
}
