import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Logger,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  RegisterBeneficiaryDto,
  RegisterEstablishmentDto,
  RegisterBasicDto,
  GoogleAuthBeneficiaryDto,
  GoogleAuthEstablishmentDto,
  AuthResponseDto,
  LoginDto,
  GoogleLoginCommonDto,
  CompleteProfileDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from '../dtos/Auth';
import { GoogleAuthGuard, JwtAuthGuard, LocalAuthGuard } from './guards';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) { }

  /**
   * Registro básico con email y password
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Basic registration with email and password',
    description: 'Create a new user account with email and password. User must complete profile after registration.',
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered with isActive=false',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or passwords do not match',
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists',
  })
  async registerBasic(@Body() registerDto: RegisterBasicDto): Promise<AuthResponseDto> {
    this.logger.log(`📝 Register basic attempt: ${registerDto.email}`);
    try {
      const result = await this.authService.registerBasic(registerDto);
      this.logger.log(`✅ User registered successfully: ${registerDto.email}`);
      return result;
    } catch (error) {
      this.logger.error(`❌ Registration failed for ${registerDto.email}:`, error);
      throw error;
    }
  }

  /**
   * Registro de beneficiario
   */
  @Post('beneficiary/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a new beneficiary',
    description: 'Create a new beneficiary account',
  })
  @ApiResponse({
    status: 201,
    description: 'Beneficiary successfully registered',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or passwords do not match',
  })
  @ApiResponse({
    status: 409,
    description: 'Beneficiary already exists',
  })
  async registerBeneficiary(@Body() registerDto: RegisterBeneficiaryDto): Promise<AuthResponseDto> {
    return this.authService.registerBeneficiary(registerDto);
  }

  /**
   * Registro de establecimiento
   */
  @Post('establishment/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a new establishment',
    description: 'Create a new establishment account',
  })
  @ApiResponse({
    status: 201,
    description: 'Establishment successfully registered',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or passwords do not match',
  })
  @ApiResponse({
    status: 409,
    description: 'Establishment already exists',
  })
  async registerEstablishment(
    @Body() registerDto: RegisterEstablishmentDto,
  ): Promise<AuthResponseDto> {
    return this.authService.registerEstablishment(registerDto);
  }

  /**
   * Login con username/email/documentNumber y password
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: 'Login with username/email/documentNumber and password',
    description: 'Authenticate user (beneficiary or establishment) using local strategy',
  })
  @ApiBody({
    type: LoginDto,
    description: 'Login credentials (identifier can be username, email or document number)',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  /**
   * Google OAuth para beneficiario
   */
  @Post('beneficiary/google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login or register beneficiary with Google',
    description: 'Authenticate or create beneficiary using Google OAuth',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully authenticated with Google',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or missing Google token, or email registered as establishment',
  })
  async googleAuthBeneficiary(
    @Body() googleAuthDto: GoogleAuthBeneficiaryDto,
  ): Promise<AuthResponseDto> {
    if (!googleAuthDto.email) {
      throw new BadRequestException('Email from Google profile is required');
    }

    return this.authService.googleLoginBeneficiary(googleAuthDto);
  }

  /**
   * Google OAuth para establecimiento
   */
  @Post('establishment/google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login or register establishment with Google',
    description: 'Authenticate or create establishment using Google OAuth',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully authenticated with Google',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or missing Google token, or email registered as beneficiary',
  })
  async googleAuthEstablishment(
    @Body() googleAuthDto: GoogleAuthEstablishmentDto,
  ): Promise<AuthResponseDto> {
    if (!googleAuthDto.email) {
      throw new BadRequestException('Email from Google profile is required');
    }

    return this.authService.googleLoginEstablishment(googleAuthDto);
  }

  /**
   * Refrescar access token
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Generate a new access token using a valid refresh token',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
      required: ['refreshToken'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'New access token generated',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid refresh token',
  })
  async refreshAccessToken(@Body() body: { refreshToken: string }): Promise<AuthResponseDto> {
    if (!body.refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }

    return this.authService.refreshToken(body.refreshToken);
  }

  /**
   * Obtener perfil del usuario autenticado
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Retrieve the authenticated user profile',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getProfile(@Request() req: any): Promise<any> {
    return this.authService.getProfile(req.user.userId);
  }

  /**
   * Logout (endpoint de referencia)
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Logout',
    description: 'Logout the user (invalidate token client-side)',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged out',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async logout(@Request() req: any): Promise<{ message: string }> {
    // En una implementación real, podrías mantener una lista de tokens revocados
    // o usar Redis para invalidar tokens
    return { message: 'Successfully logged out. Please discard the token client-side.' };
  }

  /**
   * Validar token (Critical for mobile apps)
   * Usado para verificar si la sesión es válida al iniciar la app
   */
  @Post('validate-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Validate JWT token',
    description:
      'Check if a JWT token is valid. Used by mobile app to restore session on app startup',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
      required: ['token'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Token validation result',
    schema: {
      type: 'object',
      properties: {
        valid: { type: 'boolean' },
        user: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' },
          },
        },
        expiresIn: { type: 'number' },
      },
    },
  })
  async validateToken(@Body() body: { token: string }): Promise<any> {
    if (!body.token) {
      throw new BadRequestException('Token is required');
    }

    return this.authService.validateToken(body.token);
  }

  /**
   * Cambiar contraseña
   * Protegido con JWT
   */
  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Change user password',
    description: 'Allow authenticated user to change their password',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        oldPassword: { type: 'string', example: 'OldPassword123!' },
        newPassword: { type: 'string', example: 'NewPassword123!' },
      },
      required: ['oldPassword', 'newPassword'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid password or user registered with Google',
  })
  @ApiResponse({
    status: 401,
    description: 'Current password is incorrect or unauthorized',
  })
  async changePassword(
    @Request() req: any,
    @Body() body: { oldPassword: string; newPassword: string },
  ): Promise<{ success: boolean; message: string }> {
    if (!body.oldPassword || !body.newPassword) {
      throw new BadRequestException('Old password and new password are required');
    }

    if (body.oldPassword === body.newPassword) {
      throw new BadRequestException('New password must be different from old password');
    }

    return this.authService.changePassword(req.user.userId, body.oldPassword, body.newPassword);
  }

  /**
   * Google login común - crea usuario con datos mínimos (isActive = false)
   */
  @Post('google/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Common Google login - no role specified',
    description:
      'Authenticate or create user with Google. User is created with isActive=false until profile is completed',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully authenticated with Google. User requires profile completion.',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or missing required fields',
  })
  async googleLoginCommon(@Body() googleAuthDto: GoogleLoginCommonDto): Promise<AuthResponseDto> {
    return this.authService.googleLoginCommon(googleAuthDto);
  }

  /**
   * Completar perfil del usuario después de Google login
   * Actualiza datos y establece isActive = true
   */
  @Post('profile/complete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Complete user profile after Google login',
    description:
      'Complete user profile with role and required fields. Sets isActive=true upon completion.',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile completed successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or missing required fields',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async completeProfile(
    @Request() req: any,
    @Body() completeProfileDto: CompleteProfileDto,
  ): Promise<AuthResponseDto> {
    return this.authService.completeUserProfile(req.user.userId, completeProfileDto);
  }

  /**
   * Solicitar recuperación de contraseña
   */
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Request password reset',
    description:
      'Request a password reset for the given email. A reset token will be sent to the email if it exists.',
  })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password reset instructions sent (if email exists)',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Si el correo electrónico está registrado, recibirás instrucciones para recuperar tu contraseña',
        },
        token: {
          type: 'string',
          example: '550e8400-e29b-41d4-a716-446655440000',
          description: 'Reset token (only in development mode)',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid email format',
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    this.logger.log(`Forgot password request for: ${forgotPasswordDto.email}`);
    return this.authService.requestPasswordReset(forgotPasswordDto.email);
  }

  /**
   * Validar token de recuperación
   */
  @Get('validate-reset-token/:token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Validate password reset token',
    description: 'Check if a password reset token is valid and not expired',
  })
  @ApiResponse({
    status: 200,
    description: 'Token is valid',
    schema: {
      type: 'object',
      properties: {
        valid: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Token válido' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token is invalid, expired, or already used',
    schema: {
      type: 'object',
      properties: {
        valid: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Token inválido o expirado' },
      },
    },
  })
  async validateResetToken(@Param('token') token: string) {
    this.logger.log(`Validating reset token: ${token.substring(0, 8)}...`);

    const isValid = await this.authService.validateResetToken(token);

    if (!isValid) {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    return {
      valid: true,
      message: 'Token válido',
    };
  }

  /**
   * Restablecer contraseña
   */
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reset password',
    description: 'Reset user password using a valid reset token',
  })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password successfully reset',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Contraseña actualizada exitosamente' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid password format or Google account',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid, expired, or already used token',
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    this.logger.log(`Reset password attempt with token: ${resetPasswordDto.token.substring(0, 8)}...`);
    return this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword);
  }
}
