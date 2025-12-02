import { ApiProperty } from '@nestjs/swagger';
import { FoodCategory, UnitOfMeasure, FoodStatus } from '@prisma/client';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateFoodDto {
  @ApiProperty({
    description: 'Food name',
    example: 'Whole wheat bread',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({
    description: 'Food description',
    example: 'Freshly baked whole wheat bread, 100% whole wheat flour',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({
    description: 'Food category',
    example: 'BAKERY',
    enum: FoodCategory,
    required: false,
    type: String,
  })
  @IsOptional()
  @IsEnum(FoodCategory)
  readonly category?: FoodCategory;

  @ApiProperty({
    description: 'Available quantity',
    example: 12,
    required: false,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0.0000001)
  readonly quantity?: number;

  @ApiProperty({
    description: 'Unit of measurement',
    example: 'UNIT',
    enum: UnitOfMeasure,
    required: false,
    type: String,
  })
  @IsOptional()
  @IsEnum(UnitOfMeasure)
  readonly unitOfMeasure?: UnitOfMeasure;

  @ApiProperty({
    description: 'Food status',
    example: 'AVAILABLE',
    enum: FoodStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(FoodStatus)
  readonly status?: FoodStatus;

  @ApiProperty({
    description: 'URL of the food image',
    example: 'https://example.com/image.jpg',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsUrl()
  readonly imageUrl?: string;

  @ApiProperty({
    description: 'Expiration date',
    example: '2025-10-20',
    required: false,
    type: Date,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly expiresAt?: Date;

  @ApiProperty({
    description: 'UUID of the establishment this food belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsUUID()
  readonly establishmentId?: string;
}
