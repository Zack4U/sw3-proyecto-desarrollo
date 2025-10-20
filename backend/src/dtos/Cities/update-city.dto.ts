import { ApiProperty } from '@nestjs/swagger';

export class UpdateCityDto {
  @ApiProperty({
    description: 'City name',
    example: 'Medellín',
    required: false,
    type: String,
  })
  readonly name?: string;

  @ApiProperty({
    description: 'Department ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    type: String,
  })
  readonly departmentId?: string;
}
