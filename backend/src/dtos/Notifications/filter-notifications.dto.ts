import { IsOptional, IsBoolean, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class FilterNotificationsDto {
  @ApiProperty({
    description: 'Filtrar solo no leídas',
    required: false,
    example: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  unreadOnly?: boolean;

  @ApiProperty({
    description: 'Número de página',
    required: false,
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Cantidad por página',
    required: false,
    example: 20,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 20;
}
