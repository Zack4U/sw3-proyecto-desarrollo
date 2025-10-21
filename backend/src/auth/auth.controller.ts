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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  RegisterBeneficiaryDto,
  RegisterEstablishmentDto,
  GoogleAuthBeneficiaryDto,
  GoogleAuthEstablishmentDto,
  AuthResponseDto,
  LoginDto,
  GoogleLoginCommonDto,
  CompleteProfileDto,
} from '../dtos/Auth';
import { JwtAuthGuard, LocalAuthGuard } from './guards';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
}
