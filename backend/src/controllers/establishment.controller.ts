import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
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
    summary: 'Get all establishments',
    description: 'Returns a list of all registered establishments',
  })
  @ApiResponse({
    status: 200,
    description: 'List of establishments retrieved successfully',
  })
  findAll() {
    return this.establishmentsService.findAll();
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
}
