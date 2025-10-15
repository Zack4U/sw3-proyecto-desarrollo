import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from "@nestjs/common";
import { CreateFoodDto } from "src/dtos/Foods/create-food.dto";
import { UpdateFoodDto } from "src/dtos/Foods/update-food.dto";
import { FoodsService } from "src/services/foods.services";

@Controller('foods')
export class FoodsController {
    constructor(private readonly foodsService: FoodsService) { }

    @Post()
    create(@Body() dto: CreateFoodDto) {
        return this.foodsService.create(dto);
    }

    @Get()
    findAll() {
        return this.foodsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const food = await this.foodsService.findOne(id);
        if (!food) {
            throw new NotFoundException(`Food with ID ${id} not found`);
        }
        return food;
    }

    @Get('establishment/:establishmentId')
    findByEstablishment(@Param('establishmentId') establishmentId: string) {
        return this.foodsService.findByEstablishment(establishmentId);
    }

    @Get('category/:category')
    findByCategory(@Param('category') category: string) {
        return this.foodsService.findByCategory(category);
    }

    @Get('name/:name')
    findByName(@Param('name') name: string) {
        return this.foodsService.findByName(name);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateFoodDto) {
        const updatedFood = await this.foodsService.update(id, dto);
        if (!updatedFood) {
            throw new NotFoundException(`Food with ID ${id} not found`);
        }
        return updatedFood;
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        const food = await this.foodsService.findOne(id);
        if (!food) {
            throw new NotFoundException(`Food with ID ${id} not found`);
        }
        return this.foodsService.remove(id);
    }

}
