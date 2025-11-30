import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'ID del usuario destinatario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Título de la notificación',
    example: 'Nueva solicitud de recogida',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Cuerpo de la notificación',
    example: 'Juan ha solicitado recoger 5 manzanas',
  })
  @IsString()
  body: string;

  @ApiProperty({
    description: 'Tipo de notificación',
    enum: NotificationType,
    example: NotificationType.PICKUP_NEW_REQUEST,
  })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({
    description: 'Datos adicionales (pickupId, screen, etc.)',
    required: false,
    example: { pickupId: '123', screen: 'PickupDetails' },
  })
  @IsOptional()
  @IsObject()
  data?: Record<string, any>;
}
