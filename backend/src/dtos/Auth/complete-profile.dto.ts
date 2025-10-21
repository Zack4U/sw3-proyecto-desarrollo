import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para completar el perfil de un usuario después de Google login
 * Actualiza isActive a true una vez completados los datos
 */
export class CompleteProfileDto {
  @ApiProperty({
    description: 'Google ID to link with user account',
    example: '123456789012345678901',
    required: false,
  })
  @IsOptional()
  @IsString()
  googleId?: string;

  @ApiProperty({
    description: 'User role type',
    enum: ['BENEFICIARY', 'ESTABLISHMENT'],
    example: 'BENEFICIARY',
  })
  @IsNotEmpty()
  @IsEnum(['BENEFICIARY', 'ESTABLISHMENT'])
  role: 'BENEFICIARY' | 'ESTABLISHMENT';

  @ApiProperty({
    description: 'Username for the account',
    example: 'john_doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: 'User or establishment name',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Last name (for beneficiary)',
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+57 300 1234567',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Document type (for beneficiary)',
    enum: ['CC', 'TI', 'CE', 'RC', 'PAS', 'PPT', 'NIT'],
    example: 'CC',
    required: false,
  })
  @IsOptional()
  @IsEnum(['CC', 'TI', 'CE', 'RC', 'PAS', 'PPT', 'NIT'])
  documentType?: string;

  @ApiProperty({
    description: 'Document number',
    example: '1000123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  documentNumber?: string;

  @ApiProperty({
    description: 'Address (for establishment)',
    example: 'Carrera 5 #10-50',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'Neighborhood (for establishment)',
    example: 'Centro',
    required: false,
  })
  @IsOptional()
  @IsString()
  neighborhood?: string;

  @ApiProperty({
    description: 'City ID (for establishment)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsOptional()
  @IsString()
  cityId?: string;

  @ApiProperty({
    description: 'Establishment description',
    example: 'Food bank for community',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Establishment type',
    example: 'FOOD_BANK',
    required: false,
  })
  @IsOptional()
  @IsString()
  establishmentType?: string;
}
