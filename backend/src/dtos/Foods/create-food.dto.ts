import { ApiProperty } from '@nestjs/swagger';

export class CreateFoodDto {
  @ApiProperty({
    description: 'Food name',
    example: 'Whole wheat bread',
    type: String,
  })
  readonly name: string;

  @ApiProperty({
    description: 'Food description',
    example: 'Freshly baked whole wheat bread, 100% whole wheat flour',
    required: false,
    type: String,
  })
  readonly description?: string;

  @ApiProperty({
    description: 'Food category',
    example: 'Bakery',
    required: false,
    type: String,
  })
  readonly category?: string;

  @ApiProperty({
    description: 'Available quantity',
    example: 12,
    type: Number,
  })
  readonly quantity: number;

  @ApiProperty({
    description: 'Unit of measurement/weight',
    example: 'units',
    type: String,
  })
  readonly weightOfUnit: string;

  @ApiProperty({
    description: 'Food status',
    example: 'AVAILABLE',
    enum: ['AVAILABLE', 'RESERVED', 'DELIVERED', 'EXPIRED'],
    default: 'AVAILABLE',
  })
  readonly status?: string;

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
    type: Date,
  })
  readonly expiresAt: Date;

  @ApiProperty({
    description: 'UUID of the establishment this food belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  readonly establishmentId: string;
}
