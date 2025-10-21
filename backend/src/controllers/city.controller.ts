import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CreateCityDto } from '../dtos/Cities/create-city.dto';
import { UpdateCityDto } from '../dtos/Cities/update-city.dto';
import { CitiesService } from '../services/city.service';

@ApiTags('cities')
@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new city',
    description: 'Creates a new city associated with a department',
  })
  @ApiBody({ type: CreateCityDto })
  @ApiResponse({
    status: 201,
    description: 'City created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data',
  })
  create(@Body() dto: CreateCityDto) {
    return this.citiesService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all cities',
    description: 'Returns a list of all cities with their departments',
  })
  @ApiResponse({
    status: 200,
    description: 'List of cities retrieved successfully',
  })
  findAll() {
    return this.citiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a city by ID',
    description: 'Returns the information of a specific city with its department and establishments',
  })
  @ApiParam({
    name: 'id',
    description: 'City UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'City found',
  })
  @ApiResponse({
    status: 404,
    description: 'City not found',
  })
  async findOne(@Param('id') id: string) {
    const city = await this.citiesService.findOne(id);
    if (!city) {
      throw new NotFoundException(`City with ID ${id} not found`);
    }
    return city;
  }

  @Get('department/:departmentId')
  @ApiOperation({
    summary: 'Get cities by department',
    description: 'Returns all cities belonging to a specific department',
  })
  @ApiParam({
    name: 'departmentId',
    description: 'Department UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Cities found',
  })
  findByDepartment(@Param('departmentId') departmentId: string) {
    return this.citiesService.findByDepartment(departmentId);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a city',
    description: 'Updates the information of an existing city',
  })
  @ApiParam({
    name: 'id',
    description: 'City UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateCityDto })
  @ApiResponse({
    status: 200,
    description: 'City updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'City not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data',
  })
  async update(@Param('id') id: string, @Body() dto: UpdateCityDto) {
    const city = await this.citiesService.findOne(id);
    if (!city) {
      throw new NotFoundException(`City with ID ${id} not found`);
    }
    return this.citiesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a city',
    description: 'Deletes a city and all its associated establishments',
  })
  @ApiParam({
    name: 'id',
    description: 'City UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'City deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'City not found',
  })
  async remove(@Param('id') id: string) {
    const city = await this.citiesService.findOne(id);
    if (!city) {
      throw new NotFoundException(`City with ID ${id} not found`);
    }
    return this.citiesService.remove(id);
  }
}
