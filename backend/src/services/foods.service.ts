import { Injectable } from "@nestjs/common";
import { CreateFoodDto } from "src/dtos/Foods/create-food.dto";
import { UpdateFoodDto } from "src/dtos/Foods/update-food.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class FoodsService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateFoodDto) {
        return this.prisma.food.create({
            data: {
                ...dto,
            },
        });
    }

    async findAll() {
        return this.prisma.food.findMany();
    }

    async findOne(id: string) {
        return this.prisma.food.findUnique({
            where: { food_id: id },
        });
    }

    async update(id: string, dto: UpdateFoodDto) {
        return this.prisma.food.update({
            where: { food_id: id },
            data: {
                ...dto,
            },
        });
    }

    async remove(id: string) {
        return this.prisma.food.delete({
            where: { food_id: id },
        });
    }

    async findByEstablishment(establishment_id: string) {
        return this.prisma.food.findMany({
            where: { establishment_id: establishment_id },
        });
    }

    async findByCategory(category: string) {
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

