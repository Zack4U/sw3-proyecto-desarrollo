import { ApiProperty } from '@nestjs/swagger';

export class CreateCityDto {
  @ApiProperty({
    description: 'City name',
    example: 'Medellín',
    type: String,
  })
  readonly name: string;

  @ApiProperty({
    description: 'Department ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  readonly departmentId: string;
}
