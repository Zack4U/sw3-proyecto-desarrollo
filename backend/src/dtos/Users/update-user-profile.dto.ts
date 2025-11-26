import { IsEmail, IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserProfileDto {
  @ApiProperty({ example: 'user@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '+34 912 345 678', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: '12345678A', required: false })
  @IsOptional()
  @IsString()
  documentNumber?: string;

  @ApiProperty({
    example: 'CC',
    required: false,
    enum: ['CC', 'TI', 'CE', 'RC', 'PAS', 'PPT', 'NIT'],
  })
  @IsOptional()
  @IsEnum(['CC', 'TI', 'CE', 'RC', 'PAS', 'PPT', 'NIT'])
  documentType?: string;

  @ApiProperty({ example: 'johndoe', required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ example: 'John', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Doe', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;
}
