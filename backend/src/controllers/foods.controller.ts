import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { FoodCategory } from '@prisma/client';
import { CreateFoodDto } from 'src/dtos/Foods/create-food.dto';
import { UpdateFoodDto } from 'src/dtos/Foods/update-food.dto';
import { FoodsService } from 'src/services/foods.service';

@ApiTags('foods')
@Controller('foods')
export class FoodsController {
  private readonly logger = new Logger(FoodsController.name);

  constructor(private readonly foodsService: FoodsService) { }

  @Post()
  @ApiOperation({
    summary: 'Create a new food',
    description: 'Registers a new food associated with an establishment',
  })
  @ApiBody({ type: CreateFoodDto })
  @ApiResponse({
    status: 201,
    description: 'Food created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data',
  })
  create(@Body() dto: CreateFoodDto) {
    this.logger.log(`Create food request received - payload: ${JSON.stringify(dto)}`);
    return this.foodsService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all foods',
    description: 'Returns a list of all registered foods',
  })
  @ApiResponse({
    status: 200,
    description: 'List of foods retrieved successfully',
  })
  findAll() {
    return this.foodsService.findAll();
  }

  /* NOTE: get-by-id endpoint intentionally placed AFTER specific routes
     like /establishment, /category and /name to avoid route conflicts where
     a dynamic ':id' would match the literal path segment 'establishment'. */

  @Get('establishment/:establishmentId')
  @ApiOperation({
    summary: 'Get foods by establishment',
    description: 'Returns all foods from a specific establishment',
  })
  @ApiParam({
    name: 'establishmentId',
    description: 'Establishment UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'List of foods from the establishment',
  })
  findByEstablishment(@Param('establishmentId') establishmentId: string) {
    return this.foodsService.findByEstablishment(establishmentId);
  }

  @Get('category/:category')
  @ApiOperation({
    summary: 'Get foods by category',
    description: 'Returns all foods from a specific category',
  })
  @ApiParam({
    name: 'category',
    description: 'Category name',
    example: 'Bakery',
  })
  @ApiResponse({
    status: 200,
    description: 'List of foods from the category',
  })
  findByCategory(@Param('category') category: FoodCategory) {
    return this.foodsService.findByCategory(category);
  }

  @Get('name/:name')
  @ApiOperation({
    summary: 'Search foods by name',
    description: 'Returns foods that match the provided name',
  })
  @ApiParam({
    name: 'name',
    description: 'Food name to search',
    example: 'Whole wheat bread',
  })
  @ApiResponse({
    status: 200,
    description: 'List of foods found',
  })
  findByName(@Param('name') name: string) {
    return this.foodsService.findByName(name);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a food by ID',
    description: 'Returns the information of a specific food',
  })
  @ApiParam({
    name: 'id',
    description: 'Food UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Food found',
  })
  @ApiResponse({
    status: 404,
    description: 'Food not found',
  })
  async findOne(@Param('id') id: string) {
    const food = await this.foodsService.findOne(id);
    if (!food) {
      throw new NotFoundException(`Food with ID ${id} not found`);
    }
    return food;
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a food',
    description: 'Updates the information of an existing food',
  })
  @ApiParam({
    name: 'id',
    description: 'Food UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateFoodDto })
  @ApiResponse({
    status: 200,
    description: 'Food updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Food not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data',
  })
  async update(@Param('id') id: string, @Body() dto: UpdateFoodDto) {
    this.logger.log(`Update food request - id: ${id} payload: ${JSON.stringify(dto)}`);
    const updatedFood = await this.foodsService.update(id, dto);
    if (!updatedFood) {
      throw new NotFoundException(`Food with ID ${id} not found`);
    }
    return updatedFood;
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a food',
    description: 'Deletes a food from the system',
  })
  @ApiParam({
    name: 'id',
    description: 'Food UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Food deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Food not found',
  })
  async remove(@Param('id') id: string) {
    const food = await this.foodsService.findOne(id);
    if (!food) {
      throw new NotFoundException(`Food with ID ${id} not found`);
    }
    return this.foodsService.remove(id);
  }
}
