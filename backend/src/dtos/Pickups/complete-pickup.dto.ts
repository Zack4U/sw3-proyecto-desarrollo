import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CompletePickupDto {
  @ApiProperty({
    description: 'Cantidad realmente entregada',
    example: 5,
    minimum: 0,
  })
  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0, { message: 'La cantidad entregada no puede ser negativa' })
  deliveredQuantity: number;

  @ApiProperty({
    description: 'Notas finales del establecimiento sobre la entrega',
    example: 'Entrega completa sin inconvenientes',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
