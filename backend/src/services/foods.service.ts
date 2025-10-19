import { Injectable } from '@nestjs/common';
import { CreateFoodDto } from 'src/dtos/Foods/create-food.dto';
import { UpdateFoodDto } from 'src/dtos/Foods/update-food.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FoodCategory, FoodStatus } from '@prisma/client';

@Injectable()
export class FoodsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateFoodDto) {
    return this.prisma.food.create({
      data: {
        ...dto,
        status: dto.status as FoodStatus,
      },
    });
  }

  async findAll() {
    return this.prisma.food.findMany();
  }

  async findOne(id: string) {
    return this.prisma.food.findUnique({
      where: { foodId: id },
    });
  }

  async update(id: string, dto: UpdateFoodDto) {
    const { establishmentId, ...updateData } = dto;
    return this.prisma.food.update({
      where: { foodId: id },
      data: {
        ...updateData,
        status: dto.status ? (dto.status as FoodStatus) : undefined,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.food.delete({
      where: { foodId: id },
    });
  }

  async findByEstablishment(establishmentId: string) {
    return this.prisma.food.findMany({
      where: { establishmentId: establishmentId },
    });
  }

  async findByCategory(category: FoodCategory) {
    return this.prisma.food.findMany({
      where: { category: category },
    });
  }

  async findByName(name: string) {
    return this.prisma.food.findMany({
      where: { name: { contains: name, mode: 'insensitive' } },
    });
  }
}
