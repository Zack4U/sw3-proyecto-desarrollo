import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para registro básico de usuario
 * Crea usuario con isActive=false hasta que complete el perfil
 */
export class RegisterBasicDto {
    @ApiProperty({
        description: 'User email',
        example: 'john@example.com',
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

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
    @MinLength(8)
    confirmPassword: string;
}
