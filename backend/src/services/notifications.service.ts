import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterPushTokenDto } from 'src/dtos/Notifications/register-push-token.dto';
import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';
import { NotificationType } from '@prisma/client';
import { FilterNotificationsDto } from 'src/dtos/Notifications/filter-notifications.dto';

// Tipos para las notificaciones de recogidas
export enum PickupNotificationType {
  NEW_REQUEST = 'NEW_REQUEST',
  REQUEST_CONFIRMED = 'REQUEST_CONFIRMED',
  REQUEST_REJECTED = 'REQUEST_REJECTED',
  VISIT_CONFIRMED = 'VISIT_CONFIRMED',
  PICKUP_COMPLETED = 'PICKUP_COMPLETED',
  PICKUP_CANCELLED = 'PICKUP_CANCELLED',
}

export interface PickupNotificationData {
  type: PickupNotificationType;
  pickupId: string;
  foodName?: string;
  establishmentName?: string;
  beneficiaryName?: string;
  scheduledDate?: string;
  quantity?: number;
  reason?: string;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private expo: Expo;

  constructor(private prisma: PrismaService) {
    this.expo = new Expo();
  }

  /**
   * Registra o actualiza un token de notificaciones push para un usuario
   * Si el token ya existe, lo marca como activo
   * Si es un nuevo dispositivo, invalida tokens antiguos del mismo usuario/plataforma
   */
  async registerPushToken(userId: string, dto: RegisterPushTokenDto) {
    // Buscar si el token ya existe para este usuario
    const existingToken = await this.prisma.pushToken.findFirst({
      where: {
        userId,
        token: dto.token,
      },
    });

    // Si ya existe, solo actualizarlo a activo
    if (existingToken) {
      return this.prisma.pushToken.update({
        where: { id: existingToken.id },
        data: {
          isActive: true,
          platform: dto.platform,
          updatedAt: new Date(),
        },
      });
    }

    // Si es un nuevo token, crearlo
    // Nota: No invalidamos tokens antiguos automáticamente para permitir múltiples dispositivos
    return this.prisma.pushToken.create({
      data: {
        userId,
        token: dto.token,
        platform: dto.platform,
        isActive: true,
      },
    });
  }

  /**
   * Obtiene todos los tokens activos de un usuario
   */
  async getUserTokens(userId: string) {
    return this.prisma.pushToken.findMany({
      where: {
        userId,
        isActive: true,
      },
    });
  }

  /**
   * Invalida un token específico (por ejemplo cuando el usuario cierra sesión)
   */
  async invalidateToken(tokenId: string) {
    return this.prisma.pushToken.update({
      where: { id: tokenId },
      data: { isActive: false },
    });
  }

  /**
   * Invalida todos los tokens de un usuario
   */
  async invalidateUserTokens(userId: string) {
    return this.prisma.pushToken.updateMany({
      where: { userId },
      data: { isActive: false },
    });
  }

  /**
   * Envía una notificación push a un usuario específico
   */
  async sendPushNotification(
    userId: string,
    title: string,
    body: string,
    data?: Record<string, any>,
    channelId: string = 'default',
  ): Promise<void> {
    try {
      // Obtener todos los tokens activos del usuario
      const tokens = await this.getUserTokens(userId);

      if (tokens.length === 0) {
        this.logger.warn(`No active push tokens found for user ${userId}`);
        return;
      }

      // Filtrar tokens válidos de Expo y excluir tokens de testing
      const validTokens = tokens
        .map((t) => t.token)
        .filter((token) => {
          if (token === 'LOCAL_TESTING_TOKEN') {
            this.logger.debug('Skipping local testing token');
            return false;
          }
          return Expo.isExpoPushToken(token);
        });

      if (validTokens.length === 0) {
        this.logger.warn(`No valid Expo push tokens for user ${userId}`);
        return;
      }

      // Crear los mensajes para cada token
      const messages: ExpoPushMessage[] = validTokens.map((token) => ({
        to: token,
        sound: 'default',
        title,
        body,
        data,
        channelId,
      }));

      // Enviar las notificaciones en chunks (Expo tiene límite de 100 por request)
      const chunks = this.expo.chunkPushNotifications(messages);
      const tickets: ExpoPushTicket[] = [];

      for (const chunk of chunks) {
        try {
          const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          this.logger.error(`Error sending push notification chunk: ${error.message}`);
        }
      }

      // Procesar tickets para manejar errores
      for (let i = 0; i < tickets.length; i++) {
        const ticket = tickets[i];
        if (ticket.status === 'error') {
          this.logger.error(
            `Push notification error: ${ticket.message} (${ticket.details?.error})`,
          );

          // Si el token es inválido, desactivarlo
          if (
            ticket.details?.error === 'DeviceNotRegistered' ||
            ticket.details?.error === 'InvalidCredentials'
          ) {
            const tokenToInvalidate = tokens.find((t) => t.token === validTokens[i]);
            if (tokenToInvalidate) {
              await this.invalidateToken(tokenToInvalidate.id);
              this.logger.log(
                `Invalidated token ${tokenToInvalidate.id} due to ${ticket.details?.error}`,
              );
            }
          }
        }
      }

      this.logger.log(`Push notifications sent to user ${userId}: ${tickets.length} tickets`);
    } catch (error) {
      this.logger.error(`Failed to send push notification to user ${userId}: ${error.message}`);
    }
  }

  /**
   * Envía notificación de nueva solicitud de recogida al establecimiento
   */
  async sendNewPickupRequestNotification(
    establishmentUserId: string,
    data: PickupNotificationData,
  ): Promise<void> {
    const title = '🆕 Nueva solicitud de recogida';
    const body = `${data.beneficiaryName || 'Un beneficiario'} ha solicitado recoger ${data.quantity || ''} ${data.foodName || 'alimentos'}`;
    const notificationData = { ...data, screen: 'PickupManagement' };

    // Guardar en BD y enviar push
    await this.createAndSendNotification(
      establishmentUserId,
      NotificationType.PICKUP_NEW_REQUEST,
      title,
      body,
      notificationData,
      data.pickupId,
      'orders',
    );
  }

  /**
   * Envía notificación de confirmación/rechazo de solicitud al beneficiario
   */
  async sendPickupConfirmationNotification(
    beneficiaryUserId: string,
    data: PickupNotificationData,
    confirmed: boolean,
  ): Promise<void> {
    const title = confirmed ? '✅ Solicitud confirmada' : '❌ Solicitud rechazada';
    const body = confirmed
      ? `Tu solicitud de recogida en ${data.establishmentName || 'el establecimiento'} ha sido confirmada`
      : `Tu solicitud de recogida en ${data.establishmentName || 'el establecimiento'} ha sido rechazada`;
    const notificationData = { ...data, screen: 'MyPickups' };

    // Guardar en BD y enviar push
    await this.createAndSendNotification(
      beneficiaryUserId,
      confirmed ? NotificationType.PICKUP_CONFIRMED : NotificationType.PICKUP_REJECTED,
      title,
      body,
      notificationData,
      data.pickupId,
      'orders',
    );
  }

  /**
   * Envía notificación cuando el beneficiario confirma su visita
   */
  async sendVisitConfirmedNotification(
    establishmentUserId: string,
    data: PickupNotificationData,
  ): Promise<void> {
    const title = '📍 Beneficiario en camino';
    const body = `${data.beneficiaryName || 'El beneficiario'} ha confirmado que está llegando a recoger ${data.foodName || 'los alimentos'}`;
    const notificationData = { ...data, screen: 'PickupManagement' };

    // Guardar en BD y enviar push
    await this.createAndSendNotification(
      establishmentUserId,
      NotificationType.PICKUP_VISIT_CONFIRMED,
      title,
      body,
      notificationData,
      data.pickupId,
      'orders',
    );
  }

  /**
   * Envía notificación cuando se completa una recogida
   */
  async sendPickupCompletedNotification(
    beneficiaryUserId: string,
    establishmentUserId: string,
    data: PickupNotificationData,
  ): Promise<void> {
    // Notificar al beneficiario
    await this.createAndSendNotification(
      beneficiaryUserId,
      NotificationType.PICKUP_COMPLETED,
      '🎉 Recogida completada',
      `Has recogido exitosamente ${data.quantity || ''} ${data.foodName || 'alimentos'} de ${data.establishmentName || 'el establecimiento'}`,
      { ...data, screen: 'MyPickups' },
      data.pickupId,
      'orders',
    );

    // Notificar al establecimiento
    await this.createAndSendNotification(
      establishmentUserId,
      NotificationType.PICKUP_COMPLETED,
      '✅ Entrega completada',
      `Has entregado exitosamente ${data.quantity || ''} ${data.foodName || 'alimentos'} a ${data.beneficiaryName || 'el beneficiario'}`,
      { ...data, screen: 'PickupManagement' },
      data.pickupId,
      'orders',
    );
  }

  /**
   * Envía notificación cuando se cancela una recogida
   */
  async sendPickupCancelledNotification(
    establishmentUserId: string,
    data: PickupNotificationData,
  ): Promise<void> {
    const title = '🚫 Recogida cancelada';
    const body = `${data.beneficiaryName || 'El beneficiario'} ha cancelado la recogida de ${data.foodName || 'alimentos'}${data.reason ? `: ${data.reason}` : ''}`;

    // Guardar en BD y enviar push
    await this.createAndSendNotification(
      establishmentUserId,
      NotificationType.PICKUP_CANCELLED,
      title,
      body,
      { ...data, screen: 'PickupManagement' },
      data.pickupId,
      'orders',
    );
  }

  // ==================== MÉTODOS CRUD PARA NOTIFICACIONES EN BD ====================

  /**
   * Crea una notificación en la base de datos
   */
  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    body: string,
    data?: Record<string, any>,
    pickupId?: string,
  ) {
    return this.prisma.notification.create({
      data: {
        userId,
        type,
        title,
        body,
        data: data || {},
        pickupId,
      },
    });
  }

  /**
   * Crea una notificación en BD y envía push notification
   */
  async createAndSendNotification(
    userId: string,
    type: NotificationType,
    title: string,
    body: string,
    data?: Record<string, any>,
    pickupId?: string,
    channelId: string = 'default',
  ) {
    // Guardar en BD
    const notification = await this.createNotification(userId, type, title, body, data, pickupId);

    // Enviar push notification
    await this.sendPushNotification(
      userId,
      title,
      body,
      { ...data, notificationId: notification.id },
      channelId,
    );

    return notification;
  }

  /**
   * Obtiene las notificaciones de un usuario con paginación
   */
  async getUserNotifications(userId: string, filters: FilterNotificationsDto) {
    const { unreadOnly, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where = {
      userId,
      isDeleted: false,
      ...(unreadOnly ? { isRead: false } : {}),
    };

    const [notifications, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({ where }),
      this.prisma.notification.count({
        where: { userId, isRead: false, isDeleted: false },
      }),
    ]);

    return {
      notifications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      unreadCount,
    };
  }

  /**
   * Obtiene el contador de notificaciones no leídas
   */
  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
        isDeleted: false,
      },
    });
  }

  /**
   * Marca notificaciones como leídas
   */
  async markAsRead(userId: string, notificationIds: string[]) {
    const result = await this.prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        userId, // Asegurar que pertenecen al usuario
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return { updated: result.count };
  }

  /**
   * Marca todas las notificaciones como leídas
   */
  async markAllAsRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
        isDeleted: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return { updated: result.count };
  }

  /**
   * Elimina una notificación (soft delete)
   */
  async deleteNotification(userId: string, notificationId: string) {
    return this.prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId, // Asegurar que pertenece al usuario
      },
      data: {
        isDeleted: true,
      },
    });
  }

  /**
   * Elimina múltiples notificaciones (soft delete)
   */
  async deleteNotifications(userId: string, notificationIds: string[]) {
    const result = await this.prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        userId,
      },
      data: {
        isDeleted: true,
      },
    });

    return { deleted: result.count };
  }

  /**
   * Elimina todas las notificaciones de un usuario (soft delete)
   */
  async deleteAllNotifications(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: {
        userId,
        isDeleted: false,
      },
      data: {
        isDeleted: true,
      },
    });

    return { deleted: result.count };
  }
}
