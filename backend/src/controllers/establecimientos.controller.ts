import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from "@nestjs/common";
import { CreateEstablecimientoDto } from "src/dtos/establecimientos/create-establecimiento.dto";
import { UpdateEstablecimientoDto } from "src/dtos/establecimientos/update-establecimiento.dto";
import { EstablecimientosService } from "src/services/establecimientos.services";

@Controller('establecimientos')
export class EstablecimientosController {
    constructor(private readonly establecimientosService: EstablecimientosService) { }

    @Post()
    create(@Body() dto: CreateEstablecimientoDto) {
        return this.establecimientosService.create(dto);
    }

    @Get()
    findAll() {
        return this.establecimientosService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const establecimiento = await this.establecimientosService.findOne(id);
        if (!establecimiento) {
            throw new NotFoundException(`Establecimiento with ID ${id} not found`);
        }
        return establecimiento;
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateEstablecimientoDto) {
        const establecimiento = await this.establecimientosService.findOne(id);
        if (!establecimiento) {
            throw new NotFoundException(`Establecimiento with ID ${id} not found`);
        }
        return this.establecimientosService.update(id, dto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        const establecimiento = await this.establecimientosService.findOne(id);
        if (!establecimiento) {
            throw new NotFoundException(`Establecimiento with ID ${id} not found`);
        }
        return this.establecimientosService.remove(id);
    }
}