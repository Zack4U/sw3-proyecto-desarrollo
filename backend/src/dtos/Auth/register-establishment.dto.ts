import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterEstablishmentDto {
  @ApiProperty({
    description: 'Establishment email',
    example: 'info@restaurant.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Establishment name',
    example: 'Mi Restaurante',
  })
  @IsNotEmpty()
  @IsString()
  establishmentName: string;

  @ApiProperty({
    description: 'Document number (optional, but unique)',
    example: '1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  documentNumber?: string;

  @ApiProperty({
    description: 'Establishment password',
    example: 'SecurePassword123!',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'Password confirmation',
    example: 'SecurePassword123!',
  })
  @IsNotEmpty()
  @IsString()
  @ValidateIf((dto) => dto.password === dto.confirmPassword)
  confirmPassword: string;
}
