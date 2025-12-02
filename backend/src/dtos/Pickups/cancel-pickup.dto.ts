import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CancelPickupDto {
  @ApiProperty({
    description: 'Razón de la cancelación',
    example: 'No podré asistir por un imprevisto',
  })
  @IsString()
  @IsNotEmpty({ message: 'Debe proporcionar una razón para la cancelación' })
  reason: string;
}
