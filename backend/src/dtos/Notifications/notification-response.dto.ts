import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';

export class NotificationResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  userId: string;

  @ApiProperty({ example: 'Nueva solicitud de recogida' })
  title: string;

  @ApiProperty({ example: 'Juan ha solicitado recoger 5 manzanas' })
  body: string;

  @ApiProperty({ enum: NotificationType, example: NotificationType.PICKUP_NEW_REQUEST })
  type: NotificationType;

  @ApiProperty({ example: { pickupId: '456', screen: 'PickupManagement' }, required: false })
  data?: Record<string, any>;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  pickupId?: string;

  @ApiProperty({ example: false })
  isRead: boolean;

  @ApiProperty({ example: false })
  isDeleted: boolean;

  @ApiProperty({ example: '2025-01-15T10:00:00.000Z', required: false })
  readAt?: string;

  @ApiProperty({ example: '2025-01-15T10:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-01-15T10:00:00.000Z' })
  updatedAt: string;
}

export class NotificationsListResponseDto {
  @ApiProperty({ type: [NotificationResponseDto] })
  notifications: NotificationResponseDto[];

  @ApiProperty({
    example: {
      total: 25,
      page: 1,
      limit: 20,
      totalPages: 2,
    },
  })
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };

  @ApiProperty({ example: 5 })
  unreadCount: number;
}
