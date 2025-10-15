import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from "@nestjs/common";
import { CreateEstablishmentDto } from "src/dtos/Establishments/create-establishment.dto";
import { UpdateEstablishmentDto } from "src/dtos/Establishments/update-establishment.dto";
import { EstablishmentsService } from "src/services/establishment.service";

@Controller('establishments')
export class EstablishmentsController {
    constructor(private readonly establishmentsService: EstablishmentsService) { }

    @Post()
    create(@Body() dto: CreateEstablishmentDto) {
        return this.establishmentsService.create(dto);
    }

    @Get()
    findAll() {
        return this.establishmentsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const establishment = await this.establishmentsService.findOne(id);
        if (!establishment) {
            throw new NotFoundException(`Establishment with ID ${id} not found`);
        }
        return establishment;
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateEstablishmentDto) {
        const establishment = await this.establishmentsService.findOne(id);
        if (!establishment) {
            throw new NotFoundException(`Establishment with ID ${id} not found`);
        }
        return this.establishmentsService.update(id, dto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        const establishment = await this.establishmentsService.findOne(id);
        if (!establishment) {
            throw new NotFoundException(`Establishment with ID ${id} not found`);
        }
        return this.establishmentsService.remove(id);
    }
}