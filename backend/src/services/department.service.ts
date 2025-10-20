import { Injectable } from '@nestjs/common';
import { CreateDepartmentDto } from '../dtos/Departments/create-department.dto';
import { UpdateDepartmentDto } from '../dtos/Departments/update-department.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDepartmentDto) {
    return this.prisma.department.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.department.findMany({
      include: {
        cities: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.department.findUnique({
      where: { departmentId: id },
      include: {
        cities: true,
      },
    });
  }

  async update(id: string, dto: UpdateDepartmentDto) {
    return this.prisma.department.update({
      where: { departmentId: id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.department.delete({
      where: { departmentId: id },
    });
  }
}
