import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ValidateTokenDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Password reset token to validate',
  })
  @IsString()
  @IsNotEmpty({ message: 'Token is required' })
  token: string;
}
