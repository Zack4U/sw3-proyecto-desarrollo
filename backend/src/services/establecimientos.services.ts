import { Injectable } from "@nestjs/common";
import { CreateEstablecimientoDto } from "src/dtos/establecimientos/create-establecimiento.dto";
import { UpdateEstablecimientoDto } from "src/dtos/establecimientos/update-establecimiento.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class EstablecimientosService {
    constructor(private prisma: PrismaService) {}

    async create(dto: CreateEstablecimientoDto) {
        return this.prisma.establecimiento.create({
            data: {
                ...dto,
            },
        });
    }

    async findAll() {
        return this.prisma.establecimiento.findMany();
    }

    async findOne(id: string) {
        return this.prisma.establecimiento.findUnique({
            where: { establecimiento_id: id },
        });
    }

    async update(id: string, dto: UpdateEstablecimientoDto) {
        return this.prisma.establecimiento.update({
            where: { establecimiento_id: id },
            data: dto,
        });
    }

    async remove(id: string) {
        return this.prisma.establecimiento.delete({
            where: { establecimiento_id: id },
        });
    }
}