import { IsUUID, IsNumber, IsDateString, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePickupDto {
  @ApiProperty({
    description: 'ID del alimento a recoger',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  foodId: string;

  @ApiProperty({
    description: 'Cantidad solicitada (debe ser menor o igual a la disponible)',
    example: 5,
    minimum: 0.1,
  })
  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0.1, { message: 'La cantidad debe ser mayor a 0' })
  requestedQuantity: number;

  @ApiProperty({
    description: 'Fecha y hora programada para la recogida (formato ISO 8601)',
    example: '2025-12-01T10:00:00.000Z',
  })
  @IsDateString()
  scheduledDate: string;

  @ApiProperty({
    description: 'Notas adicionales del beneficiario',
    example: 'Llegaré puntual a las 10am',
    required: false,
  })
  @IsOptional()
  @IsString()
  beneficiaryNotes?: string;
}
