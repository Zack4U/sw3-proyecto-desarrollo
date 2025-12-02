import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class ForgotPasswordDto {
  @ApiProperty({
    example: "user@example.com",
    description: "Email address os the user requesting password reset",
  })
  @IsEmail({}, { message: "Please provide a valid email address" })
  @IsNotEmpty({ message: "Email is required "})
  email: string;
}
