import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateEstablishmentDto } from 'src/dtos/Establishments/create-establishment.dto';
import { UpdateEstablishmentDto } from 'src/dtos/Establishments/update-establishment.dto';
import { EstablishmentsService } from 'src/services/establishment.service';

@ApiTags('establishments')
@Controller('establishments')
export class EstablishmentsController {
  constructor(private readonly establishmentsService: EstablishmentsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new establishment',
    description: 'Creates a new establishment with the provided information',
  })
  @ApiBody({ type: CreateEstablishmentDto })
  @ApiResponse({
    status: 201,
    description: 'Establishment created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data',
  })
  create(@Body() dto: CreateEstablishmentDto) {
    return this.establishmentsService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all establishments (paginated)',
    description: 'Returns a paginated list of establishments. Use ?page=1&limit=10 for pagination.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of establishments retrieved successfully',
  })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    // page y limit opcionales, convertir a número si existen
    const pageNum = page ? parseInt(page, 10) : undefined;
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    const result = await this.establishmentsService.findAll(pageNum, limitNum);
    // Si la respuesta es un array plano (caso legacy), adaptarla
    if (Array.isArray(result)) {
      console.log('Paginated establishments result:', result);
      return { data: result, total: result.length };
    }

    return result;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get an establishment by ID',
    description: 'Returns the information of a specific establishment',
  })
  @ApiParam({
    name: 'id',
    description: 'Establishment UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Establishment found',
  })
  @ApiResponse({
    status: 404,
    description: 'Establishment not found',
  })
  async findOne(@Param('id') id: string) {
    const establishment = await this.establishmentsService.findOne(id);
    if (!establishment) {
      throw new NotFoundException(`Establishment with ID ${id} not found`);
    }
    return establishment;
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update an establishment',
    description: 'Updates the information of an existing establishment',
  })
  @ApiParam({
    name: 'id',
    description: 'Establishment UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateEstablishmentDto })
  @ApiResponse({
    status: 200,
    description: 'Establishment updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Establishment not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data',
  })
  async update(@Param('id') id: string, @Body() dto: UpdateEstablishmentDto) {
    const establishment = await this.establishmentsService.findOne(id);
    if (!establishment) {
      throw new NotFoundException(`Establishment with ID ${id} not found`);
    }
    return this.establishmentsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an establishment',
    description: 'Deletes an establishment and all its associated foods',
  })
  @ApiParam({
    name: 'id',
    description: 'Establishment UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Establishment deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Establishment not found',
  })
  async remove(@Param('id') id: string) {
    const establishment = await this.establishmentsService.findOne(id);
    if (!establishment) {
      throw new NotFoundException(`Establishment with ID ${id} not found`);
    }
    return this.establishmentsService.remove(id);
  }

  @Get('city/:cityId')
  @ApiOperation({
    summary: 'Get establishments by city',
    description: 'Returns all establishments in a specific city',
  })
  @ApiParam({
    name: 'cityId',
    description: 'City UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Establishments found',
  })
  findByCity(@Param('cityId') cityId: string) {
    return this.establishmentsService.findByCity(cityId);
  }

  @Get('department/:departmentId')
  @ApiOperation({
    summary: 'Get establishments by department',
    description: 'Returns all establishments in a specific department',
  })
  @ApiParam({
    name: 'departmentId',
    description: 'Department UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Establishments found',
  })
  findByDepartment(@Param('departmentId') departmentId: string) {
    return this.establishmentsService.findByDepartment(departmentId);
  }

  @Get('neighborhood/:neighborhood')
  @ApiOperation({
    summary: 'Get establishments by neighborhood',
    description: 'Returns all establishments in a specific neighborhood',
  })
  @ApiParam({
    name: 'neighborhood',
    description: 'Neighborhood name',
    example: 'Chapinero',
  })
  @ApiResponse({
    status: 200,
    description: 'Establishments found',
  })
  findByNeighborhood(@Param('neighborhood') neighborhood: string) {
    return this.establishmentsService.findByNeighborhood(neighborhood);
  }
}
