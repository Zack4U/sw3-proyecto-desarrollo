import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  UseGuards,
  Request,
  Query,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { NotificationsService } from 'src/services/notifications.service';
import { RegisterPushTokenDto } from 'src/dtos/Notifications/register-push-token.dto';
import { FilterNotificationsDto } from 'src/dtos/Notifications/filter-notifications.dto';
import { MarkNotificationsReadDto } from 'src/dtos/Notifications/mark-notifications-read.dto';
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

  // ==================== ENDPOINTS CRUD PARA NOTIFICACIONES ====================

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user notifications',
    description: 'Gets paginated notifications for the authenticated user',
  })
  @ApiQuery({ name: 'unreadOnly', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Notifications retrieved successfully',
    schema: {
      example: {
        notifications: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            title: 'Nueva solicitud de recogida',
            body: 'Juan ha solicitado recoger 5 manzanas',
            type: 'PICKUP_NEW_REQUEST',
            isRead: false,
            createdAt: '2025-01-15T10:00:00.000Z',
            data: { pickupId: '456', screen: 'PickupManagement' },
          },
        ],
        pagination: {
          total: 25,
          page: 1,
          limit: 20,
          totalPages: 2,
        },
        unreadCount: 5,
      },
    },
  })
  async getNotifications(@Request() req, @Query() filters: FilterNotificationsDto) {
    const userId = req.user.userId;
    return this.notificationsService.getUserNotifications(userId, filters);
  }

  @Get('unread-count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get unread notifications count',
    description: 'Gets the count of unread notifications for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Unread count retrieved successfully',
    schema: { example: { unreadCount: 5 } },
  })
  async getUnreadCount(@Request() req) {
    const userId = req.user.userId;
    const unreadCount = await this.notificationsService.getUnreadCount(userId);
    return { unreadCount };
  }

  @Patch('read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Mark notifications as read',
    description: 'Marks the specified notifications as read',
  })
  @ApiBody({ type: MarkNotificationsReadDto })
  @ApiResponse({
    status: 200,
    description: 'Notifications marked as read',
    schema: { example: { updated: 3 } },
  })
  async markAsRead(@Request() req, @Body() dto: MarkNotificationsReadDto) {
    const userId = req.user.userId;
    return this.notificationsService.markAsRead(userId, dto.notificationIds);
  }

  @Patch('read-all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Mark all notifications as read',
    description: 'Marks all notifications of the authenticated user as read',
  })
  @ApiResponse({
    status: 200,
    description: 'All notifications marked as read',
    schema: { example: { updated: 10 } },
  })
  async markAllAsRead(@Request() req) {
    const userId = req.user.userId;
    return this.notificationsService.markAllAsRead(userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a notification',
    description: 'Deletes (soft) a specific notification',
  })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiResponse({
    status: 200,
    description: 'Notification deleted',
  })
  async deleteNotification(@Request() req, @Param('id') id: string) {
    const userId = req.user.userId;
    return this.notificationsService.deleteNotification(userId, id);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete all notifications',
    description: 'Deletes (soft) all notifications of the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'All notifications deleted',
    schema: { example: { deleted: 15 } },
  })
  async deleteAllNotifications(@Request() req) {
    const userId = req.user.userId;
    return this.notificationsService.deleteAllNotifications(userId);
  }
}
