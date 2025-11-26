import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { NotificationsService } from 'src/services/notifications.service';
import { RegisterPushTokenDto } from 'src/dtos/Notifications/register-push-token.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('register')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Register push notification token',
    description:
      'Registers or updates a push notification token for the authenticated user. Requires JWT authentication.',
  })
  @ApiBody({ type: RegisterPushTokenDto })
  @ApiResponse({
    status: 201,
    description: 'Token registered successfully',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        token: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]',
        platform: 'android',
        isActive: true,
        userId: '123e4567-e89b-12d3-a456-426614174000',
        createdAt: '2025-11-25T16:45:00.000Z',
        updatedAt: '2025-11-25T16:45:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid data',
  })
  async registerPushToken(@Request() req, @Body() registerPushTokenDto: RegisterPushTokenDto) {
    // El userId se extrae del token JWT que viene en el request
    const userId = req.user.userId;

    return this.notificationsService.registerPushToken(userId, registerPushTokenDto);
  }
}
