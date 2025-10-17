import { ApiProperty } from '@nestjs/swagger';

export class UpdateEstablishmentDto {
  @ApiProperty({
    description: 'Establishment UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    type: String,
  })
  readonly establishmentId?: string;

  @ApiProperty({
    description: 'Establishment name',
    example: 'Central Bakery',
    required: false,
    type: String,
  })
  readonly name?: string;

  @ApiProperty({
    description: 'Establishment description',
    example: 'Artisan bakery with over 20 years of experience',
    required: false,
    type: String,
  })
  readonly description?: string;

  @ApiProperty({
    description: 'Contact phone number',
    example: '+34 912 345 678',
    required: false,
    type: String,
  })
  readonly phone?: string;

  @ApiProperty({
    description: 'Contact email address',
    example: 'contact@centralbakery.com',
    required: false,
    type: String,
  })
  readonly email?: string;

  @ApiProperty({
    description: 'Physical address of the establishment',
    example: 'Main Street 15, Madrid',
    required: false,
    type: String,
  })
  readonly address?: string;

  @ApiProperty({
    description: 'Establishment type/category',
    example: 'Bakery',
    required: false,
    type: String,
  })
  readonly establishmentType?: string;

  @ApiProperty({
    description: 'Geographic location (GeoJSON format)',
    example: { type: 'Point', coordinates: [-3.7038, 40.4168] },
    required: false,
    type: Object,
  })
  readonly location?: object;

  @ApiProperty({
    description: 'UUID of the user who owns the establishment',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    type: String,
  })
  readonly userId?: string;
}
