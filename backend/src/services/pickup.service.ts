import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationsService, PickupNotificationType } from './notifications.service';
import { PickupStatus, FoodStatus } from '@prisma/client';
import {
  CreatePickupDto,
  UpdatePickupDto,
  ConfirmPickupDto,
  CompletePickupDto,
  CancelPickupDto,
  FilterPickupsDto,
} from 'src/dtos/Pickups';

@Injectable()
export class PickupsService {
  private readonly logger = new Logger(PickupsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * Crear una nueva solicitud de recogida
   */
  async create(userId: string, dto: CreatePickupDto) {
    this.logger.log(`Creating pickup for user ${userId} and food ${dto.foodId}`);

    // Obtener el food con su establecimiento
    const food = await this.prisma.food.findUnique({
      where: { foodId: dto.foodId },
      include: {
        establishment: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!food) {
      throw new NotFoundException(`Alimento con ID ${dto.foodId} no encontrado`);
    }

    // Validar que el alimento esté disponible
    if (food.status !== FoodStatus.AVAILABLE) {
      throw new BadRequestException('Este alimento ya no está disponible');
    }

    // Validar que la cantidad solicitada no exceda la disponible
    if (dto.requestedQuantity > food.quantity) {
      throw new BadRequestException(
        `La cantidad solicitada (${dto.requestedQuantity}) excede la disponible (${food.quantity})`,
      );
    }

    // Validar que la fecha sea futura
    const scheduledDate = new Date(dto.scheduledDate);
    if (scheduledDate <= new Date()) {
      throw new BadRequestException('La fecha programada debe ser futura');
    }

    // Obtener el beneficiario del usuario
    const beneficiary = await this.prisma.beneficiary.findFirst({
      where: { userUserId: userId },
    });

    if (!beneficiary) {
      throw new BadRequestException(
        'Debe completar su perfil de beneficiario antes de solicitar recogidas',
      );
    }

    // Crear la recogida
    const pickup = await this.prisma.pickup.create({
      data: {
        beneficiaryId: beneficiary.beneficiaryId,
        establishmentId: food.establishmentId,
        foodId: dto.foodId,
        requestedQuantity: dto.requestedQuantity,
        scheduledDate,
        beneficiaryNotes: dto.beneficiaryNotes,
        status: PickupStatus.PENDING,
      },
      include: {
        beneficiary: {
          include: {
            User: true,
          },
        },
        establishment: {
          include: {
            user: true,
          },
        },
        food: true,
      },
    });

    this.logger.log(`Pickup created with ID ${pickup.pickupId}`);

    // Enviar notificación al establecimiento
    await this.notificationsService.sendNewPickupRequestNotification(
      pickup.establishment.user.userId,
      {
        type: PickupNotificationType.NEW_REQUEST,
        pickupId: pickup.pickupId,
        foodName: pickup.food.name,
        beneficiaryName:
          pickup.beneficiary.name || pickup.beneficiary.User?.username || 'Beneficiario',
        scheduledDate: pickup.scheduledDate.toISOString(),
        quantity: pickup.requestedQuantity,
      },
    );

    return pickup;
  }

  /**
   * Obtener todas las recogidas con filtros opcionales
   */
  async findAll(filters: FilterPickupsDto) {
    const {
      status,
      beneficiaryId,
      establishmentId,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = filters;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (beneficiaryId) {
      where.beneficiaryId = beneficiaryId;
    }

    if (establishmentId) {
      where.establishmentId = establishmentId;
    }

    if (startDate || endDate) {
      where.scheduledDate = {};
      if (startDate) {
        where.scheduledDate.gte = new Date(startDate);
      }
      if (endDate) {
        where.scheduledDate.lte = new Date(endDate);
      }
    }

    const [pickups, total] = await Promise.all([
      this.prisma.pickup.findMany({
        where,
        include: {
          beneficiary: {
            include: {
              User: {
                select: {
                  userId: true,
                  email: true,
                  username: true,
                  phone: true,
                  picture: true,
                },
              },
            },
          },
          establishment: true,
          food: true,
        },
        orderBy: { scheduledDate: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.pickup.count({ where }),
    ]);

    return {
      data: pickups,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Obtener una recogida por ID
   */
  async findOne(id: string) {
    const pickup = await this.prisma.pickup.findUnique({
      where: { pickupId: id },
      include: {
        beneficiary: {
          include: {
            User: {
              select: {
                userId: true,
                email: true,
                username: true,
                phone: true,
                picture: true,
              },
            },
          },
        },
        establishment: {
          include: {
            city: {
              include: {
                department: true,
              },
            },
            user: {
              select: {
                userId: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        food: true,
      },
    });

    if (!pickup) {
      throw new NotFoundException(`Recogida con ID ${id} no encontrada`);
    }

    return pickup;
  }

  /**
   * Obtener recogidas de un beneficiario (por userId)
   */
  async findByBeneficiary(userId: string, filters?: FilterPickupsDto) {
    const beneficiary = await this.prisma.beneficiary.findFirst({
      where: { userUserId: userId },
    });

    if (!beneficiary) {
      throw new NotFoundException('Beneficiario no encontrado');
    }

    return this.findAll({
      ...filters,
      beneficiaryId: beneficiary.beneficiaryId,
    });
  }

  /**
   * Obtener recogidas de un establecimiento (por userId)
   */
  async findByEstablishment(userId: string, filters?: FilterPickupsDto) {
    const establishment = await this.prisma.establishment.findFirst({
      where: { userId },
    });

    if (!establishment) {
      throw new NotFoundException('Establecimiento no encontrado');
    }

    return this.findAll({
      ...filters,
      establishmentId: establishment.establishmentId,
    });
  }

  /**
   * Confirmar o rechazar una recogida (solo establecimiento)
   */
  async confirmPickup(id: string, userId: string, dto: ConfirmPickupDto) {
    const pickup = await this.findOne(id);

    // Verificar que el usuario sea el dueño del establecimiento
    if (pickup.establishment.userId !== userId) {
      throw new ForbiddenException('No tiene permisos para gestionar esta recogida');
    }

    // Verificar que el estado sea PENDING
    if (pickup.status !== PickupStatus.PENDING) {
      throw new BadRequestException(
        `No se puede ${dto.confirmed ? 'confirmar' : 'rechazar'} una recogida en estado ${pickup.status}`,
      );
    }

    const newStatus = dto.confirmed ? PickupStatus.CONFIRMED : PickupStatus.REJECTED;

    const updated = await this.prisma.pickup.update({
      where: { pickupId: id },
      data: {
        status: newStatus,
        confirmedAt: dto.confirmed ? new Date() : null,
        establishmentNotes: dto.notes,
        scheduledDate: dto.alternativeDate ? new Date(dto.alternativeDate) : undefined,
      },
      include: {
        beneficiary: {
          include: {
            User: true,
          },
        },
        establishment: true,
        food: true,
      },
    });

    this.logger.log(`Pickup ${id} ${dto.confirmed ? 'confirmed' : 'rejected'}`);

    // Enviar notificación al beneficiario
    await this.notificationsService.sendPickupConfirmationNotification(
      updated.beneficiary.userUserId,
      {
        type: dto.confirmed
          ? PickupNotificationType.REQUEST_CONFIRMED
          : PickupNotificationType.REQUEST_REJECTED,
        pickupId: updated.pickupId,
        foodName: updated.food.name,
        establishmentName: updated.establishment.name,
        scheduledDate: updated.scheduledDate.toISOString(),
        quantity: updated.requestedQuantity,
      },
      dto.confirmed,
    );

    return updated;
  }

  /**
   * Confirmar visita (beneficiario llegó al establecimiento)
   */
  async confirmVisit(id: string, userId: string) {
    const pickup = await this.findOne(id);

    // Verificar que el usuario sea el beneficiario
    if (pickup.beneficiary.userUserId !== userId) {
      throw new ForbiddenException('No tiene permisos para confirmar esta visita');
    }

    // Verificar que el estado sea CONFIRMED
    if (pickup.status !== PickupStatus.CONFIRMED) {
      throw new BadRequestException(
        `No se puede confirmar visita de una recogida en estado ${pickup.status}`,
      );
    }

    const updated = await this.prisma.pickup.update({
      where: { pickupId: id },
      data: {
        status: PickupStatus.IN_PROGRESS,
        visitConfirmedAt: new Date(),
      },
      include: {
        beneficiary: {
          include: {
            User: true,
          },
        },
        establishment: true,
        food: true,
      },
    });

    this.logger.log(`Visit confirmed for pickup ${id}`);

    // Enviar notificación al establecimiento
    await this.notificationsService.sendVisitConfirmedNotification(updated.establishment.userId, {
      type: PickupNotificationType.VISIT_CONFIRMED,
      pickupId: updated.pickupId,
      foodName: updated.food.name,
      beneficiaryName:
        updated.beneficiary.name || updated.beneficiary.User?.username || 'Beneficiario',
      scheduledDate: updated.scheduledDate.toISOString(),
      quantity: updated.requestedQuantity,
    });

    return updated;
  }

  /**
   * Completar entrega (solo establecimiento)
   */
  async completePickup(id: string, userId: string, dto: CompletePickupDto) {
    const pickup = await this.findOne(id);

    // Verificar que el usuario sea el dueño del establecimiento
    if (pickup.establishment.userId !== userId) {
      throw new ForbiddenException('No tiene permisos para completar esta recogida');
    }

    // Verificar que el estado sea IN_PROGRESS
    if (pickup.status !== PickupStatus.IN_PROGRESS) {
      throw new BadRequestException(
        `No se puede completar una recogida en estado ${pickup.status}`,
      );
    }

    // Validar cantidad entregada
    if (dto.deliveredQuantity > pickup.requestedQuantity) {
      throw new BadRequestException(
        `La cantidad entregada (${dto.deliveredQuantity}) no puede exceder la solicitada (${pickup.requestedQuantity})`,
      );
    }

    // Actualizar la recogida y el inventario del alimento en una transacción
    const result = await this.prisma.$transaction(async (tx) => {
      // Actualizar la recogida
      const updatedPickup = await tx.pickup.update({
        where: { pickupId: id },
        data: {
          status: PickupStatus.COMPLETED,
          deliveredQuantity: dto.deliveredQuantity,
          completedAt: new Date(),
          establishmentNotes: dto.notes
            ? pickup.establishmentNotes
              ? `${pickup.establishmentNotes}\n${dto.notes}`
              : dto.notes
            : pickup.establishmentNotes,
        },
        include: {
          beneficiary: {
            include: {
              User: true,
            },
          },
          establishment: true,
          food: true,
        },
      });

      // Actualizar cantidad del alimento
      const newQuantity = pickup.food.quantity - dto.deliveredQuantity;
      const newFoodStatus = newQuantity <= 0 ? FoodStatus.DELIVERED : FoodStatus.AVAILABLE;

      await tx.food.update({
        where: { foodId: pickup.foodId },
        data: {
          quantity: Math.max(0, newQuantity),
          status: newFoodStatus,
        },
      });

      return updatedPickup;
    });

    this.logger.log(`Pickup ${id} completed with ${dto.deliveredQuantity} units delivered`);

    // Enviar notificación a ambos (beneficiario y establecimiento)
    await this.notificationsService.sendPickupCompletedNotification(
      result.beneficiary.userUserId,
      result.establishment.userId,
      {
        type: PickupNotificationType.PICKUP_COMPLETED,
        pickupId: result.pickupId,
        foodName: result.food.name,
        establishmentName: result.establishment.name,
        beneficiaryName:
          result.beneficiary.name || result.beneficiary.User?.username || 'Beneficiario',
        quantity: dto.deliveredQuantity,
      },
    );

    return result;
  }

  /**
   * Cancelar recogida (solo beneficiario, solo si está PENDING o CONFIRMED)
   */
  async cancelPickup(id: string, userId: string, dto: CancelPickupDto) {
    const pickup = await this.findOne(id);

    // Verificar que el usuario sea el beneficiario
    if (pickup.beneficiary.userUserId !== userId) {
      throw new ForbiddenException('No tiene permisos para cancelar esta recogida');
    }

    // Verificar que el estado permita cancelación
    if (pickup.status !== PickupStatus.PENDING && pickup.status !== PickupStatus.CONFIRMED) {
      throw new BadRequestException(`No se puede cancelar una recogida en estado ${pickup.status}`);
    }

    const updated = await this.prisma.pickup.update({
      where: { pickupId: id },
      data: {
        status: PickupStatus.CANCELLED,
        cancelledAt: new Date(),
        cancellationReason: dto.reason,
      },
      include: {
        beneficiary: {
          include: {
            User: true,
          },
        },
        establishment: true,
        food: true,
      },
    });

    this.logger.log(`Pickup ${id} cancelled by beneficiary`);

    // Enviar notificación al establecimiento
    await this.notificationsService.sendPickupCancelledNotification(updated.establishment.userId, {
      type: PickupNotificationType.PICKUP_CANCELLED,
      pickupId: updated.pickupId,
      foodName: updated.food.name,
      beneficiaryName:
        updated.beneficiary.name || updated.beneficiary.User?.username || 'Beneficiario',
      reason: dto.reason,
    });

    return updated;
  }

  /**
   * Actualizar información de una recogida
   */
  async update(id: string, userId: string, dto: UpdatePickupDto) {
    const pickup = await this.findOne(id);

    // Verificar permisos (solo el beneficiario o el establecimiento pueden actualizar)
    const isBeneficiary = pickup.beneficiary.userUserId === userId;
    const isEstablishment = pickup.establishment.userId === userId;

    if (!isBeneficiary && !isEstablishment) {
      throw new ForbiddenException('No tiene permisos para actualizar esta recogida');
    }

    // Solo permitir actualización en ciertos estados
    if (pickup.status !== PickupStatus.PENDING && pickup.status !== PickupStatus.CONFIRMED) {
      throw new BadRequestException(
        `No se puede actualizar una recogida en estado ${pickup.status}`,
      );
    }

    // Validar fecha si se proporciona
    if (dto.scheduledDate) {
      const scheduledDate = new Date(dto.scheduledDate);
      if (scheduledDate <= new Date()) {
        throw new BadRequestException('La fecha programada debe ser futura');
      }
    }

    const updateData: any = {};

    if (dto.scheduledDate) {
      updateData.scheduledDate = new Date(dto.scheduledDate);
    }

    if (isBeneficiary && dto.beneficiaryNotes !== undefined) {
      updateData.beneficiaryNotes = dto.beneficiaryNotes;
    }

    if (isEstablishment && dto.establishmentNotes !== undefined) {
      updateData.establishmentNotes = dto.establishmentNotes;
    }

    return this.prisma.pickup.update({
      where: { pickupId: id },
      data: updateData,
      include: {
        beneficiary: {
          include: {
            User: true,
          },
        },
        establishment: true,
        food: true,
      },
    });
  }

  /**
   * Obtener estadísticas de recogidas
   */
  async getStatistics(userId?: string, role?: string) {
    const where: any = {};

    // Filtrar según el rol si se proporciona
    if (userId && role) {
      if (role === 'BENEFICIARY') {
        const beneficiary = await this.prisma.beneficiary.findFirst({
          where: { userUserId: userId },
        });
        if (beneficiary) {
          where.beneficiaryId = beneficiary.beneficiaryId;
        }
      } else if (role === 'ESTABLISHMENT') {
        const establishment = await this.prisma.establishment.findFirst({
          where: { userId },
        });
        if (establishment) {
          where.establishmentId = establishment.establishmentId;
        }
      }
    }

    // Contar por estado
    const statusCounts = await this.prisma.pickup.groupBy({
      by: ['status'],
      where,
      _count: {
        status: true,
      },
    });

    // Total de entregas completadas
    const completedPickups = await this.prisma.pickup.findMany({
      where: {
        ...where,
        status: PickupStatus.COMPLETED,
      },
      select: {
        deliveredQuantity: true,
        requestedQuantity: true,
      },
    });

    // Calcular totales
    const totalCompleted = completedPickups.length;
    const totalDelivered = completedPickups.reduce((sum, p) => sum + (p.deliveredQuantity || 0), 0);
    const totalRequested = completedPickups.reduce((sum, p) => sum + p.requestedQuantity, 0);

    // Tasa de cumplimiento
    const fulfillmentRate = totalRequested > 0 ? (totalDelivered / totalRequested) * 100 : 0;

    // Contar cancelaciones y rechazos
    const cancelledCount =
      statusCounts.find((s) => s.status === PickupStatus.CANCELLED)?._count.status || 0;
    const rejectedCount =
      statusCounts.find((s) => s.status === PickupStatus.REJECTED)?._count.status || 0;
    const totalPickups = statusCounts.reduce((sum, s) => sum + s._count.status, 0);

    // Tasa de cancelación
    const cancellationRate =
      totalPickups > 0 ? ((cancelledCount + rejectedCount) / totalPickups) * 100 : 0;

    return {
      byStatus: statusCounts.reduce(
        (acc, curr) => {
          acc[curr.status] = curr._count.status;
          return acc;
        },
        {} as Record<string, number>,
      ),
      totalPickups,
      totalCompleted,
      totalDelivered,
      averageDelivery: totalCompleted > 0 ? totalDelivered / totalCompleted : 0,
      fulfillmentRate: Math.round(fulfillmentRate * 100) / 100,
      cancellationRate: Math.round(cancellationRate * 100) / 100,
    };
  }
}
