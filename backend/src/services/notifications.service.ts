import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterPushTokenDto } from 'src/dtos/Notifications/register-push-token.dto';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

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
}
