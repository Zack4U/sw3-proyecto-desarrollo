import { Injectable } from '@nestjs/common';
import { CreateEstablishmentDto } from 'src/dtos/Establishments/create-establishment.dto';
import { UpdateEstablishmentDto } from 'src/dtos/Establishments/update-establishment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EstablishmentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEstablishmentDto) {
    return this.prisma.establishment.create({
      data: dto,
    });
  }

  async findAll(page?: number, limit?: number) {
    // Si no hay paginación, devolver todos
    if (!page || !limit) {
      const data = await this.prisma.establishment.findMany();
      return {
        data,
        total: data.length,
      };
    }
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.establishment.findMany({
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.establishment.count(),
    ]);
    return {
      data,
      total,
    };
  }

  async findOne(id: string) {
    return this.prisma.establishment.findUnique({
      where: { establishmentId: id },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.establishment.findFirst({
      where: { userId },
    });
  }

  async update(id: string, dto: UpdateEstablishmentDto) {
    return this.prisma.establishment.update({
      where: { establishmentId: id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.establishment.delete({
      where: { establishmentId: id },
    });
  }

  async findByCity(cityId: string) {
    return this.prisma.establishment.findMany({
      where: { cityId },
      include: {
        city: {
          include: {
            department: true,
          },
        },
      },
    });
  }

  async findByDepartment(departmentId: string) {
    return this.prisma.establishment.findMany({
      where: {
        city: {
          departmentId,
        },
      },
      include: {
        city: {
          include: {
            department: true,
          },
        },
      },
    });
  }

  async findByNeighborhood(neighborhood: string) {
    return this.prisma.establishment.findMany({
      where: {
        neighborhood: {
          contains: neighborhood,
          mode: 'insensitive',
        },
      },
      include: {
        city: {
          include: {
            department: true,
          },
        },
      },
    });
  }

  async findByLocation(filters: { departmentId?: string; cityId?: string; neighborhood?: string }) {
    const where: any = {};

    if (filters.cityId) {
      where.cityId = filters.cityId;
    } else if (filters.departmentId) {
      where.city = {
        departmentId: filters.departmentId,
      };
    }

    if (filters.neighborhood) {
      where.neighborhood = {
        contains: filters.neighborhood,
        mode: 'insensitive',
      };
    }

    return this.prisma.establishment.findMany({
      where,
      include: {
        city: {
          include: {
            department: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findAllWithAvailableFood(filters?: {
    page?: number;
    limit?: number;
    cityId?: string;
    departmentId?: string;
    establishmentType?: string;
  }) {
    const where: any = {};

    // Aplicar filtros opcionales
    if (filters?.cityId) {
      where.cityId = filters.cityId;
    } else if (filters?.departmentId) {
      where.city = {
        departmentId: filters.departmentId,
      };
    }

    if (filters?.establishmentType) {
      where.establishmentType = filters.establishmentType;
    }

    // Calcular paginación si se proporciona
    const skip = filters?.page && filters?.limit ? (filters.page - 1) * filters.limit : undefined;
    const take = filters?.limit;

    // Obtener establecimientos con conteo de comida disponible
    const establishments = await this.prisma.establishment.findMany({
      where,
      skip,
      take,
      orderBy: { name: 'asc' },
      include: {
        foods: {
          where: {
            status: 'AVAILABLE',
            expiresAt: {
              gt: new Date(), // Mayor que la fecha actual
            },
          },
        },
      },
    });

    // Obtener el total de establecimientos (sin paginación)
    const total = await this.prisma.establishment.count({ where });

    // Contar la comida disponible para cada establecimiento
    const establishmentsWithCount = establishments.map((establishment) => {
      const foodAvailable = establishment.foods?.length || 0;
      const { foods, ...establishmentData } = establishment;
      return {
        ...establishmentData,
        foodAvailable,
      };
    });

    // Calcular el total de comida disponible en todos los establecimientos
    const totalAvailable = establishmentsWithCount.reduce((sum, est) => sum + est.foodAvailable, 0);

    return {
      totalAvailable,
      total,
      establishments: establishmentsWithCount,
    };
  }
}
