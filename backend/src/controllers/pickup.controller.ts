import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PickupsService } from 'src/services/pickup.service';
import {
  CreatePickupDto,
  UpdatePickupDto,
  ConfirmPickupDto,
  CompletePickupDto,
  CancelPickupDto,
  FilterPickupsDto,
} from 'src/dtos/Pickups';

@ApiTags('pickups')
@Controller('pickups')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class PickupsController {
  constructor(private readonly pickupsService: PickupsService) {}

  // ────────────────────────────────
  // CREATE
  // ────────────────────────────────
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear solicitud de recogida',
    description: 'Crea una nueva solicitud de recogida de alimentos. Solo para beneficiarios.',
  })
  @ApiBody({ type: CreatePickupDto })
  @ApiResponse({
    status: 201,
    description: 'Solicitud de recogida creada exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o cantidad excede disponibilidad',
  })
  @ApiResponse({
    status: 404,
    description: 'Alimento no encontrado',
  })
  create(@Body() dto: CreatePickupDto, @Request() req) {
    return this.pickupsService.create(req.user.userId, dto);
  }

  // ────────────────────────────────
  // READ ALL (with filters)
  // ────────────────────────────────
  @Get()
  @ApiOperation({
    summary: 'Listar recogidas',
    description: 'Obtiene lista de recogidas con filtros opcionales. Admins ven todas.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de recogidas obtenida exitosamente',
  })
  findAll(@Query() filters: FilterPickupsDto) {
    return this.pickupsService.findAll(filters);
  }

  // ────────────────────────────────
  // STATISTICS (must be before :id)
  // ────────────────────────────────
  @Get('statistics')
  @ApiOperation({
    summary: 'Obtener estadísticas de recogidas',
    description: 'Devuelve estadísticas agregadas de recogidas según el rol del usuario',
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas obtenidas exitosamente',
  })
  getStatistics(@Request() req) {
    return this.pickupsService.getStatistics(req.user.userId, req.user.role);
  }

  // ────────────────────────────────
  // MY PICKUPS (beneficiary)
  // ────────────────────────────────
  @Get('my-pickups')
  @ApiOperation({
    summary: 'Obtener mis recogidas (beneficiario)',
    description: 'Obtiene todas las recogidas del beneficiario autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de recogidas del beneficiario',
  })
  findMyPickups(@Query() filters: FilterPickupsDto, @Request() req) {
    return this.pickupsService.findByBeneficiary(req.user.userId, filters);
  }

  // ────────────────────────────────
  // ESTABLISHMENT PICKUPS
  // ────────────────────────────────
  @Get('establishment')
  @ApiOperation({
    summary: 'Obtener recogidas del establecimiento',
    description: 'Obtiene todas las recogidas del establecimiento autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de recogidas del establecimiento',
  })
  findEstablishmentPickups(@Query() filters: FilterPickupsDto, @Request() req) {
    return this.pickupsService.findByEstablishment(req.user.userId, filters);
  }

  // ────────────────────────────────
  // READ ONE
  // ────────────────────────────────
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener recogida por ID',
    description: 'Obtiene información detallada de una recogida específica',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la recogida',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Recogida encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Recogida no encontrada',
  })
  findOne(@Param('id') id: string) {
    return this.pickupsService.findOne(id);
  }

  // ────────────────────────────────
  // CONFIRM / REJECT (establishment)
  // ────────────────────────────────
  @Put(':id/confirm')
  @ApiOperation({
    summary: 'Confirmar o rechazar recogida',
    description: 'El establecimiento confirma o rechaza una solicitud de recogida pendiente',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la recogida',
  })
  @ApiBody({ type: ConfirmPickupDto })
  @ApiResponse({
    status: 200,
    description: 'Recogida confirmada/rechazada exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Estado no permite esta acción',
  })
  @ApiResponse({
    status: 403,
    description: 'Sin permisos para esta acción',
  })
  confirmPickup(@Param('id') id: string, @Body() dto: ConfirmPickupDto, @Request() req) {
    return this.pickupsService.confirmPickup(id, req.user.userId, dto);
  }

  // ────────────────────────────────
  // CONFIRM VISIT (beneficiary arrived)
  // ────────────────────────────────
  @Put(':id/visit')
  @ApiOperation({
    summary: 'Confirmar llegada al establecimiento',
    description: 'El beneficiario confirma que ha llegado al establecimiento para la recogida',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la recogida',
  })
  @ApiResponse({
    status: 200,
    description: 'Visita confirmada exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'La recogida no está en estado CONFIRMED',
  })
  @ApiResponse({
    status: 403,
    description: 'Sin permisos para esta acción',
  })
  confirmVisit(@Param('id') id: string, @Request() req) {
    return this.pickupsService.confirmVisit(id, req.user.userId);
  }

  // ────────────────────────────────
  // COMPLETE (establishment delivers)
  // ────────────────────────────────
  @Put(':id/complete')
  @ApiOperation({
    summary: 'Completar entrega',
    description:
      'El establecimiento marca la entrega como completada e indica la cantidad entregada',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la recogida',
  })
  @ApiBody({ type: CompletePickupDto })
  @ApiResponse({
    status: 200,
    description: 'Entrega completada exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'La recogida no está en estado IN_PROGRESS',
  })
  @ApiResponse({
    status: 403,
    description: 'Sin permisos para esta acción',
  })
  completePickup(@Param('id') id: string, @Body() dto: CompletePickupDto, @Request() req) {
    return this.pickupsService.completePickup(id, req.user.userId, dto);
  }

  // ────────────────────────────────
  // CANCEL (beneficiary cancels)
  // ────────────────────────────────
  @Put(':id/cancel')
  @ApiOperation({
    summary: 'Cancelar recogida',
    description: 'El beneficiario cancela una solicitud de recogida pendiente o confirmada',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la recogida',
  })
  @ApiBody({ type: CancelPickupDto })
  @ApiResponse({
    status: 200,
    description: 'Recogida cancelada exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'El estado no permite cancelación',
  })
  @ApiResponse({
    status: 403,
    description: 'Sin permisos para esta acción',
  })
  cancelPickup(@Param('id') id: string, @Body() dto: CancelPickupDto, @Request() req) {
    return this.pickupsService.cancelPickup(id, req.user.userId, dto);
  }

  // ────────────────────────────────
  // UPDATE
  // ────────────────────────────────
  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar recogida',
    description:
      'Actualiza información de una recogida (fecha, notas). Disponible para ambas partes.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la recogida',
  })
  @ApiBody({ type: UpdatePickupDto })
  @ApiResponse({
    status: 200,
    description: 'Recogida actualizada exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'El estado no permite actualización',
  })
  @ApiResponse({
    status: 403,
    description: 'Sin permisos para esta acción',
  })
  update(@Param('id') id: string, @Body() dto: UpdatePickupDto, @Request() req) {
    return this.pickupsService.update(id, req.user.userId, dto);
  }
}
