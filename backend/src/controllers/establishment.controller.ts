import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { CreateEstablishmentDto } from 'src/dtos/Establishments/create-establishment.dto';
import { UpdateEstablishmentDto } from 'src/dtos/Establishments/update-establishment.dto';
import { EstablishmentsService } from 'src/services/establishment.service';

@ApiTags('establishments')
@Controller('establishments')
export class EstablishmentsController {
  constructor(
    private readonly establishmentsService: EstablishmentsService,
  ) {}

  // ────────────────────────────────
  // CREATE
  // ────────────────────────────────
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

  // ────────────────────────────────
  // SEARCH (must be before :id!)
  // ────────────────────────────────
  @Get('search')
  @ApiOperation({
    summary: 'Search establishments by city, department, or neighborhood',
    description:
      'Returns a list of establishments matching the search query parameters.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of establishments matching the search query',
  })
  async searchEstablishments(
    @Query('city') city?: string,
    @Query('department') department?: string,
    @Query('neighborhood') neighborhood?: string,
  ) {
    return this.establishmentsService.searchEstablishments({
      city,
      department,
      neighborhood,
    });
  }

  // ────────────────────────────────
  // GET ALL (optional pagination)
  // ────────────────────────────────
  @Get()
  @ApiOperation({
    summary: 'Get all establishments (paginated)',
    description:
      'Returns a paginated list of establishments. Use ?page=1&limit=10 for pagination.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of establishments retrieved successfully',
  })
  async findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    // page y limit opcionales, convertir a número si existen
    const pageNum = page ? parseInt(page, 10) : undefined;
    const limitNum = limit ? parseInt(limit, 10) : undefined;

    const result = await this.establishmentsService.findAll(pageNum, limitNum);

    if (Array.isArray(result)) {
      return { data: result, total: result.length };
    }

    return result;
  }

  @Get('available/food')
  @ApiOperation({
    summary: 'Get all establishments with available food count',
    description:
      'Returns establishments with their count of available food. Supports optional filters for pagination, city, department, and establishment type.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of establishments with available food count retrieved successfully',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiQuery({ name: 'cityId', required: false, type: String, description: 'Filter by city ID' })
  @ApiQuery({
    name: 'departmentId',
    required: false,
    type: String,
    description: 'Filter by department ID',
  })
  @ApiQuery({
    name: 'establishmentType',
    required: false,
    type: String,
    description: 'Filter by establishment type',
  })
  async findAllWithAvailableFood(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('cityId') cityId?: string,
    @Query('departmentId') departmentId?: string,
    @Query('establishmentType') establishmentType?: string,
  ) {
    const filters = {
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      cityId,
      departmentId,
      establishmentType,
    };

    return this.establishmentsService.findAllWithAvailableFood(filters);
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

  // ────────────────────────────────
  // UPDATE
  // ────────────────────────────────
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
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateEstablishmentDto,
  ) {
    const establishment = await this.establishmentsService.findOne(id);
    if (!establishment) {
      throw new NotFoundException(`Establishment with ID ${id} not found`);
    }
    return this.establishmentsService.update(id, dto);
  }

  // ────────────────────────────────
  // DELETE
  // ────────────────────────────────
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

  // ────────────────────────────────
  // BY CITY
  // ────────────────────────────────
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

  // ────────────────────────────────
  // BY DEPARTMENT
  // ────────────────────────────────
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

  // ────────────────────────────────
  // BY NEIGHBORHOOD
  // ────────────────────────────────
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
