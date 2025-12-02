import { IsOptional, IsString, IsEnum, IsDateString, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PickupStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class FilterPickupsDto {
  @ApiProperty({
    description: 'Filtrar por estado de la recogida',
    enum: PickupStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(PickupStatus)
  status?: PickupStatus;

  @ApiProperty({
    description: 'Filtrar por ID del beneficiario',
    required: false,
  })
  @IsOptional()
  @IsString()
  beneficiaryId?: string;

  @ApiProperty({
    description: 'Filtrar por ID del establecimiento',
    required: false,
  })
  @IsOptional()
  @IsString()
  establishmentId?: string;

  @ApiProperty({
    description: 'Fecha de inicio del rango de búsqueda',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: 'Fecha de fin del rango de búsqueda',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    description: 'Número de página para paginación',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiProperty({
    description: 'Cantidad de elementos por página',
    example: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}
