import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GoogleAuthEstablishmentDto {
  @ApiProperty({
    description: 'Google access token from frontend',
    example: 'ya29.a0AfH6SMBx...',
  })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({
    description: 'Establishment email from Google',
    example: 'info@restaurant.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Establishment name from Google',
    example: 'Mi Restaurante',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;
}
