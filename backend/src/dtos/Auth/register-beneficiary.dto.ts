import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterBeneficiaryDto {
  @ApiProperty({
    description: 'User email',
    example: 'john@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Username (optional)',
    example: 'john_doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: 'Document number (optional, but unique)',
    example: '1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  documentNumber?: string;

  @ApiProperty({
    description: 'User password',
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
