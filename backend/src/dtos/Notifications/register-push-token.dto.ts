import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterPushTokenDto {
  @ApiProperty({
    description: 'Push notification token from Expo or FCM',
    example: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]',
  })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({
    description: 'Mobile platform',
    example: 'android',
    enum: ['android', 'ios'],
  })
  @IsNotEmpty()
  @IsEnum(['android', 'ios'])
  platform: 'android' | 'ios';
}
