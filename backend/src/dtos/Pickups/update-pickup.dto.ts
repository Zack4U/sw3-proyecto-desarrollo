import { IsOptional, IsDateString, IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdatePickupDto {
  @ApiProperty({
    description: 'Nueva fecha y hora programada',
    example: '2025-12-02T14:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  scheduledDate?: string;

  @ApiProperty({
    description: 'Notas del beneficiario',
    example: 'Cambié la hora porque tengo un compromiso',
    required: false,
  })
  @IsOptional()
  @IsString()
  beneficiaryNotes?: string;

  @ApiProperty({
    description: 'Notas del establecimiento',
    example: 'Traer bolsas para llevar',
    required: false,
  })
  @IsOptional()
  @IsString()
  establishmentNotes?: string;
}
