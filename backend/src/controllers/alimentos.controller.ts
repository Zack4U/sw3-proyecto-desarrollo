import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from "@nestjs/common";
import { CreateAlimentoDto } from "src/dtos/alimentos/create-alimentos.dto";
import { UpdateAlimentoDto } from "src/dtos/alimentos/update-alimentos.dto";
import { AlimentosService } from "src/services/alimentos.services";

@Controller('alimentos')
export class AlimentosController {
    constructor(private readonly alimentosService: AlimentosService) { }

    @Post()
    create(@Body() dto: CreateAlimentoDto) {
        return this.alimentosService.create(dto);
    }

    @Get()
    findAll() {
        return this.alimentosService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const alimento = await this.alimentosService.findOne(id);
        if (!alimento) {
            throw new NotFoundException(`Alimento with ID ${id} not found`);
        }
        return alimento;
    }

    @Get('establecimiento/:establecimientoId')
    findByEstablecimiento(@Param('establecimientoId') establecimientoId: string) {
        return this.alimentosService.findByEstablecimiento(establecimientoId);
    }

    @Get('categoria/:categoria')
    findByCategoria(@Param('categoria') categoria: string) {
        return this.alimentosService.findByCategoria(categoria);
    }

    @Get('nombre/:nombre')
    findByNombre(@Param('nombre') nombre: string) {
        return this.alimentosService.findByNombre(nombre);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateAlimentoDto) {
        const updatedAlimento = await this.alimentosService.update(id, dto);
        if (!updatedAlimento) {
            throw new NotFoundException(`Alimento with ID ${id} not found`);
        }
        return updatedAlimento;
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        const alimento = await this.alimentosService.findOne(id);
        if (!alimento) {
            throw new NotFoundException(`Alimento with ID ${id} not found`);
        }
        return this.alimentosService.remove(id);
    }

}
