import { ApiProperty } from '@nestjs/swagger';

export class UpdateDepartmentDto {
  @ApiProperty({
    description: 'Department name',
    example: 'Antioquia',
    required: false,
    type: String,
  })
  readonly name?: string;
}
