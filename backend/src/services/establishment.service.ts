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

  async findByCity(cityId: string) {
    return this.prisma.establishment.findMany({
      where: { cityId },
      include: {
        city: {
          include: {
            department: true,
          },
        },
      },
    });
  }

  async findByDepartment(departmentId: string) {
    return this.prisma.establishment.findMany({
      where: {
        city: {
          departmentId,
        },
      },
      include: {
        city: {
          include: {
            department: true,
          },
        },
      },
    });
  }

  async findByNeighborhood(neighborhood: string) {
    return this.prisma.establishment.findMany({
      where: {
        neighborhood: {
          contains: neighborhood,
          mode: 'insensitive',
        },
      },
      include: {
        city: {
          include: {
            department: true,
          },
        },
      },
    });
  }

  async findByLocation(filters: {
    departmentId?: string;
    cityId?: string;
    neighborhood?: string;
  }) {
    const where: any = {};

    if (filters.cityId) {
      where.cityId = filters.cityId;
    } else if (filters.departmentId) {
      where.city = {
        departmentId: filters.departmentId,
      };
    }

    if (filters.neighborhood) {
      where.neighborhood = {
        contains: filters.neighborhood,
        mode: 'insensitive',
      };
    }

    return this.prisma.establishment.findMany({
      where,
      include: {
        city: {
          include: {
            department: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}
