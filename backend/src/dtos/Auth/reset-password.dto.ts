import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class ResetPasswordDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Password reset token received via email',
  })
  @IsString()
  @IsNotEmpty({ message: 'Token is required' })
  token: string;

  @ApiProperty({
    example: 'NewSecurePassword@123!',
    description: 'New password (min 8 characters, must contain uppercase, lowercase, and numbers)',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain uppercase letters, lowercase letters, and numbers',
  })
  @IsNotEmpty({ message: 'New password is required' })
  newPassword: string;
}
