import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MarkNotificationsReadDto {
  @ApiProperty({
    description: 'IDs de las notificaciones a marcar como leídas',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  notificationIds: string[];
}
