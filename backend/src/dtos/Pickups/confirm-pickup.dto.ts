import { IsBoolean, IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmPickupDto {
  @ApiProperty({
    description: 'True para confirmar, False para rechazar',
    example: true,
  })
  @IsBoolean()
  confirmed: boolean;

  @ApiProperty({
    description: 'Fecha alternativa si se rechaza o necesita reprogramar',
    example: '2025-12-03T10:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  alternativeDate?: string;

  @ApiProperty({
    description: 'Notas del establecimiento',
    example: 'Confirmado, lo esperamos a las 10am',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
