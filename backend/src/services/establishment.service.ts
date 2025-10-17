import { Injectable } from '@nestjs/common';
import { CreateEstablishmentDto } from 'src/dtos/Establishments/create-establishment.dto';
import { UpdateEstablishmentDto } from 'src/dtos/Establishments/update-establishment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EstablishmentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEstablishmentDto) {
    return this.prisma.establishment.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.establishment.findMany();
  }

  async findOne(id: string) {
    return this.prisma.establishment.findUnique({
      where: { establishmentId: id },
    });
  }

  async update(id: string, dto: UpdateEstablishmentDto) {
    return this.prisma.establishment.update({
      where: { establishmentId: id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.establishment.delete({
      where: { establishmentId: id },
    });
  }
}
