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
import { CreateDepartmentDto } from '../dtos/Departments/create-department.dto';
import { UpdateDepartmentDto } from '../dtos/Departments/update-department.dto';
import { DepartmentsService } from '../services/department.service';

@ApiTags('departments')
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new department',
    description: 'Creates a new department with the provided information',
  })
  @ApiBody({ type: CreateDepartmentDto })
  @ApiResponse({
    status: 201,
    description: 'Department created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data',
  })
  create(@Body() dto: CreateDepartmentDto) {
    return this.departmentsService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all departments',
    description: 'Returns a list of all departments with their cities',
  })
  @ApiResponse({
    status: 200,
    description: 'List of departments retrieved successfully',
  })
  findAll() {
    return this.departmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a department by ID',
    description: 'Returns the information of a specific department with its cities',
  })
  @ApiParam({
    name: 'id',
    description: 'Department UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Department found',
  })
  @ApiResponse({
    status: 404,
    description: 'Department not found',
  })
  async findOne(@Param('id') id: string) {
    const department = await this.departmentsService.findOne(id);
    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }
    return department;
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a department',
    description: 'Updates the information of an existing department',
  })
  @ApiParam({
    name: 'id',
    description: 'Department UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateDepartmentDto })
  @ApiResponse({
    status: 200,
    description: 'Department updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Department not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data',
  })
  async update(@Param('id') id: string, @Body() dto: UpdateDepartmentDto) {
    const department = await this.departmentsService.findOne(id);
    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }
    return this.departmentsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a department',
    description: 'Deletes a department and all its associated cities',
  })
  @ApiParam({
    name: 'id',
    description: 'Department UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Department deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Department not found',
  })
  async remove(@Param('id') id: string) {
    const department = await this.departmentsService.findOne(id);
    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }
    return this.departmentsService.remove(id);
  }
}
