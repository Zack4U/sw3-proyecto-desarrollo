import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserProfileDto } from '../dtos/Users/update-user-profile.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(userId: string) {
    return this.prisma.user.findUnique({
      where: { userId },
      select: {
        userId: true,
        email: true,
        username: true,
        phone: true,
        picture: true,
        documentNumber: true,
        documentType: true,
        role: true,
        isVerified: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: { userId: true, email: true },
    });
  }

  async update(userId: string, updateDto: UpdateUserProfileDto) {
    // Verificar que el email no esté en uso por otro usuario
    if (updateDto.email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email: updateDto.email },
      });

      if (existingEmail && existingEmail.userId !== userId) {
        throw new Error('Email already in use');
      }
    }

    // Verificar que el documento no esté en uso por otro usuario
    if (updateDto.documentNumber) {
      const existingDocument = await this.prisma.user.findFirst({
        where: {
          documentNumber: updateDto.documentNumber,
          userId: { not: userId },
        },
      });

      if (existingDocument) {
        throw new Error('Document number already in use');
      }
    }

    const updateData: Prisma.UserUpdateInput = {};
    if (updateDto.email) updateData.email = updateDto.email;
    if (updateDto.phone) updateData.phone = updateDto.phone;
    if (updateDto.username) updateData.username = updateDto.username;
    if (updateDto.documentNumber) updateData.documentNumber = updateDto.documentNumber;
    if (updateDto.documentType) {
      updateData.documentType = updateDto.documentType as any;
    }

    // Si hay datos de beneficiario (nombre o apellido), actualizarlos
    if (updateDto.name || updateDto.lastName) {
      const beneficiaryUpdateData: any = {};
      if (updateDto.name) beneficiaryUpdateData.name = updateDto.name;
      if (updateDto.lastName) beneficiaryUpdateData.lastName = updateDto.lastName;

      // Intentar actualizar el beneficiario asociado
      // Usamos updateMany porque la relación es uno a muchos en el esquema (aunque lógica de negocio sea 1 a 1)
      // o findFirst para obtener el ID.
      // Dado que el esquema dice Beneficiary tiene userUserId, podemos hacer updateMany con userUserId
      await this.prisma.beneficiary.updateMany({
        where: { userUserId: userId },
        data: beneficiaryUpdateData,
      });
    }

    return this.prisma.user.update({
      where: { userId },
      data: updateData,
      select: {
        userId: true,
        email: true,
        username: true,
        phone: true,
        picture: true,
        documentNumber: true,
        documentType: true,
        role: true,
        isVerified: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        beneficiary: {
          select: {
            name: true,
            lastName: true,
          },
        },
      },
    });
  }

  async changePassword(userId: string, newPasswordHash: string) {
    return this.prisma.user.update({
      where: { userId },
      data: { password: newPasswordHash },
    });
  }

  async deactivate(userId: string) {
    return this.prisma.user.update({
      where: { userId },
      data: { isActive: false },
    });
  }
}
