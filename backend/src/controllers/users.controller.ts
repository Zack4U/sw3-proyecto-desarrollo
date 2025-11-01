import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from '../services/users.service';
import { EstablishmentsService } from '../services/establishment.service';
import { UpdateUserProfileDto } from '../dtos/Users/update-user-profile.dto';
import { UpdateEstablishmentProfileDto } from '../dtos/Establishments/update-establishment-profile.dto';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private establishmentsService: EstablishmentsService,
    private prisma: PrismaService,
  ) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  async getProfile(@Request() req: any) {
    try {
      const user = await this.usersService.findOne(req.user.userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      let establishment: any = null;
      if (user.role === 'ESTABLISHMENT') {
        establishment = await this.establishmentsService.findByUserId(req.user.userId);
      }

      return { user, establishment };
    } catch (error) {
      throw error;
    }
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  async updateProfile(@Request() req: any, @Body() updateDto: UpdateUserProfileDto) {
    try {
      if (updateDto.email) {
        const existing = await this.usersService.findByEmail(updateDto.email);
        if (existing && existing.userId !== req.user.userId) {
          throw new ConflictException('Email already in use');
        }
      }

      const user = await this.usersService.update(req.user.userId, updateDto);
      return { user };
    } catch (error: any) {
      if (error.message === 'Email already in use') {
        throw new ConflictException('Email already in use');
      }
      if (error.message === 'Document number already in use') {
        throw new ConflictException('Document number already in use');
      }
      throw error;
    }
  }

  @Put('establishment/profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  async updateEstablishmentProfile(
    @Request() req: any,
    @Body() updateDto: UpdateEstablishmentProfileDto,
  ) {
    try {
      if (req.user.role !== 'ESTABLISHMENT') {
        throw new BadRequestException('Only ESTABLISHMENT users can update establishment profile');
      }

      // Validar email
      if (updateDto.email) {
        const existing = await this.usersService.findByEmail(updateDto.email);
        if (existing && existing.userId !== req.user.userId) {
          throw new ConflictException('Email already in use');
        }
      }

      // Usar transacción para actualizar usuario y establecimiento
      const result = await this.prisma.$transaction(async (tx) => {
        // Preparar datos del usuario
        const userUpdateData: any = {};
        if (updateDto.email) userUpdateData.email = updateDto.email;
        if (updateDto.phone) userUpdateData.phone = updateDto.phone;
        if (updateDto.documentNumber) userUpdateData.documentNumber = updateDto.documentNumber;

        // Actualizar usuario
        const user = await tx.user.update({
          where: { userId: req.user.userId },
          data: userUpdateData,
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

        // Preparar datos del establecimiento
        const establishmentUpdateData: any = {};
        if (updateDto.name) establishmentUpdateData.name = updateDto.name;
        if (updateDto.description) establishmentUpdateData.description = updateDto.description;
        if (updateDto.address) establishmentUpdateData.address = updateDto.address;
        if (updateDto.neighborhood) establishmentUpdateData.neighborhood = updateDto.neighborhood;
        if (updateDto.establishmentType)
          establishmentUpdateData.establishmentType = updateDto.establishmentType;
        if (updateDto.location) establishmentUpdateData.location = updateDto.location;

        // Actualizar establecimiento
        await tx.establishment.updateMany({
          where: { userId: req.user.userId },
          data: establishmentUpdateData,
        });

        // Obtener el establecimiento actualizado
        const establishment = await tx.establishment.findFirst({
          where: { userId: req.user.userId },
        });

        return { user, establishment };
      });

      return result;
    } catch (error: any) {
      if (error.message === 'Email already in use') {
        throw new ConflictException('Email already in use');
      }
      if (error.message === 'Document number already in use') {
        throw new ConflictException('Document number already in use');
      }
      throw error;
    }
  }
}
