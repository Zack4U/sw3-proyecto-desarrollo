import { IsEmail, IsOptional, IsString, IsEnum, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EstablishmentType } from '@prisma/client';

export class UpdateEstablishmentProfileDto {
  // User fields
  @ApiProperty({ example: 'user@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '+34 912 345 678', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'username', required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ example: '12345678A', required: false })
  @IsOptional()
  @IsString()
  documentNumber?: string;

  // Establishment fields
  @ApiProperty({ example: 'Mi Restaurante', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Descripción del establecimiento', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Calle Principal 123', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'Centro', required: false })
  @IsOptional()
  @IsString()
  neighborhood?: string;

  @ApiProperty({
    example: 'RESTAURANT',
    required: false,
    enum: EstablishmentType,
    description: 'Type of establishment from the available options',
  })
  @IsOptional()
  @IsEnum(EstablishmentType, {
    message: `establishmentType must be one of the following values: ${Object.values(EstablishmentType).join(', ')}`,
  })
  establishmentType?: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', required: false })
  @IsOptional()
  @IsString()
  cityId?: string;

  @ApiProperty({ example: { type: 'Point', coordinates: [-3.7038, 40.4168] }, required: false })
  @IsOptional()
  @IsObject()
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
}
