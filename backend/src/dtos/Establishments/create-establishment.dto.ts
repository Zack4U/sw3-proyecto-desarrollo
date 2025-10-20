import { ApiProperty } from '@nestjs/swagger';
import { EstablishmentType } from '@prisma/client';

export class CreateEstablishmentDto {
  @ApiProperty({
    description: 'Establishment UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  readonly establishmentId: string;

  @ApiProperty({
    description: 'Establishment name',
    example: 'Central Bakery',
    type: String,
  })
  readonly name: string;

  @ApiProperty({
    description: 'Establishment description',
    example: 'Artisan bakery with over 20 years of experience',
    required: false,
    type: String,
  })
  readonly description?: string;

  @ApiProperty({
    description: 'Physical address of the establishment',
    example: 'Main Street 15, Madrid',
    type: String,
  })
  readonly address: string;

  @ApiProperty({
    description: 'Establishment type/category',
    example: 'RESTAURANT',
    enum: EstablishmentType,
    required: false,
    type: String,
  })
  readonly establishmentType?: EstablishmentType;

  @ApiProperty({
    description: 'Geographic location (GeoJSON format)',
    example: { type: 'Point', coordinates: [-3.7038, 40.4168] },
    type: Object,
  })
  readonly location: object;

  @ApiProperty({
    description: 'UUID of the user who owns the establishment',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  readonly userId: string;

  @ApiProperty({
    description: 'Neighborhood or district',
    example: 'Chapinero',
    required: false,
    type: String,
  })
  readonly neighborhood?: string;

  @ApiProperty({
    description: 'UUID of the city where the establishment is located',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  readonly cityId: string;
}
