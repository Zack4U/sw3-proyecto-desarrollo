import { Injectable } from "@nestjs/common";
import { CreateAlimentoDto } from "src/dtos/alimentos/create-alimentos.dto";
import { UpdateAlimentoDto } from "src/dtos/alimentos/update-alimentos.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AlimentosService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateAlimentoDto) {
        return this.prisma.alimento.create({
            data: {
                ...dto,
            },
        });
    }

    async findAll() {
        return this.prisma.alimento.findMany();
    }

    async findOne(id: string) {
        return this.prisma.alimento.findUnique({
            where: { alimento_id: id },
        });
    }

    async update(id: string, dto: UpdateAlimentoDto) {
        return this.prisma.alimento.update({
            where: { alimento_id: id },
            data: {
                ...dto,
            },
        });
    }

    async remove(id: string) {
        return this.prisma.alimento.delete({
            where: { alimento_id: id },
        });
    }

    async findByEstablecimiento(establecimientoId: string) {
        return this.prisma.alimento.findMany({
            where: { establecimiento_id: establecimientoId },
        });
    }

    async findByCategoria(categoria: string) {
        return this.prisma.alimento.findMany({
            where: { categoria },
        });
    }

    async findByNombre(nombre: string) {
        return this.prisma.alimento.findMany({
            where: { nombre: { contains: nombre, mode: 'insensitive' } },
        });
    }
}

