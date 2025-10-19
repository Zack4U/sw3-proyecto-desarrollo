import { ApiProperty } from '@nestjs/swagger';
import { FoodCategory, UnitOfMeasure, FoodStatus } from '@prisma/client';

export class UpdateFoodDto {
  @ApiProperty({
    description: 'Food name',
    example: 'Whole wheat bread',
    required: false,
    type: String,
  })
  readonly name?: string;

  @ApiProperty({
    description: 'Food description',
    example: 'Freshly baked whole wheat bread, 100% whole wheat flour',
    required: false,
    type: String,
  })
  readonly description?: string;

  @ApiProperty({
    description: 'Food category',
    example: 'BAKERY',
    enum: FoodCategory,
    required: false,
    type: String,
  })
  readonly category?: FoodCategory;

  @ApiProperty({
    description: 'Available quantity',
    example: 12,
    required: false,
    type: Number,
  })
  readonly quantity?: number;

  @ApiProperty({
    description: 'Unit of measurement',
    example: 'UNIT',
    enum: UnitOfMeasure,
    required: false,
    type: String,
  })
  readonly unitOfMeasure?: UnitOfMeasure;

  @ApiProperty({
    description: 'Food status',
    example: 'AVAILABLE',
    enum: FoodStatus,
    required: false,
  })
  readonly status?: FoodStatus;

  @ApiProperty({
    description: 'URL of the food image',
    example: 'https://example.com/image.jpg',
    required: false,
    type: String,
  })
  readonly imageUrl?: string;

  @ApiProperty({
    description: 'Expiration date',
    example: '2025-10-20',
    required: false,
    type: Date,
  })
  readonly expiresAt?: Date;

  @ApiProperty({
    description: 'UUID of the establishment this food belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    type: String,
  })
  readonly establishmentId?: string;
}
