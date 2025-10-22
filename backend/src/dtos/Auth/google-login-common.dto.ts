import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para Google login común (sin especificar tipo de usuario)
 * Crea un usuario con datos mínimos e isActive = false
 */
export class GoogleLoginCommonDto {
  @ApiProperty({
    description: 'Google access token from frontend',
    example: 'ya29.a0AfH6SMBx...',
  })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({
    description: 'User email from Google',
    example: 'john@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User name from Google',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'User picture URL from Google',
    example: 'https://lh3.googleusercontent.com/...',
    required: false,
  })
  @IsOptional()
  @IsString()
  picture?: string;

  @ApiProperty({
    description: 'Google ID from react-native-google-signin (user.id)',
    example: '123456789012345678901',
    required: false,
  })
  @IsOptional()
  @IsString()
  googleId?: string;
}
