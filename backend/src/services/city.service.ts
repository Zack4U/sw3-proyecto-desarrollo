import { Injectable } from '@nestjs/common';
import { CreateCityDto } from '../dtos/Cities/create-city.dto';
import { UpdateCityDto } from '../dtos/Cities/update-city.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CitiesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCityDto) {
    return this.prisma.city.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.city.findMany({
      include: {
        department: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.city.findUnique({
      where: { cityId: id },
      include: {
        department: true,
        establishments: true,
      },
    });
  }

  async findByDepartment(departmentId: string) {
    return this.prisma.city.findMany({
      where: { departmentId },
      include: {
        department: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async update(id: string, dto: UpdateCityDto) {
    return this.prisma.city.update({
      where: { cityId: id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.city.delete({
      where: { cityId: id },
    });
  }
}
