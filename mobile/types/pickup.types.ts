/**
 * Tipos e interfaces para el módulo de Recogidas/Citas
 */

// Estados de una recogida
export enum PickupStatus {
  PENDING = "PENDING", // Solicitud creada, esperando confirmación
  CONFIRMED = "CONFIRMED", // Establecimiento confirmó la cita
  IN_PROGRESS = "IN_PROGRESS", // Beneficiario llegó al establecimiento
  COMPLETED = "COMPLETED", // Entrega completada
  CANCELLED = "CANCELLED", // Cancelada por beneficiario
  REJECTED = "REJECTED", // Rechazada por establecimiento
}

// Labels para los estados (español)
export const PICKUP_STATUS_LABELS: Record<PickupStatus, string> = {
  [PickupStatus.PENDING]: "Pendiente",
  [PickupStatus.CONFIRMED]: "Confirmada",
  [PickupStatus.IN_PROGRESS]: "En Progreso",
  [PickupStatus.COMPLETED]: "Completada",
  [PickupStatus.CANCELLED]: "Cancelada",
  [PickupStatus.REJECTED]: "Rechazada",
};

// Colores para los estados
export const PICKUP_STATUS_COLORS: Record<PickupStatus, string> = {
  [PickupStatus.PENDING]: "#F9A825", // Amarillo/Naranja
  [PickupStatus.CONFIRMED]: "#2196F3", // Azul
  [PickupStatus.IN_PROGRESS]: "#9C27B0", // Púrpura
  [PickupStatus.COMPLETED]: "#4CAF50", // Verde
  [PickupStatus.CANCELLED]: "#9E9E9E", // Gris
  [PickupStatus.REJECTED]: "#F44336", // Rojo
};

// Íconos para los estados
export const PICKUP_STATUS_ICONS: Record<PickupStatus, string> = {
  [PickupStatus.PENDING]: "⏳",
  [PickupStatus.CONFIRMED]: "✅",
  [PickupStatus.IN_PROGRESS]: "🚶",
  [PickupStatus.COMPLETED]: "🎉",
  [PickupStatus.CANCELLED]: "❌",
  [PickupStatus.REJECTED]: "🚫",
};

// Información del beneficiario en una recogida
export interface PickupBeneficiary {
  beneficiaryId: string;
  name: string;
  firstName?: string;
  lastName: string;
  User: {
    userId: string;
    email: string;
    username?: string;
    phone?: string;
    picture?: string;
  };
}

// Información del establecimiento en una recogida
export interface PickupEstablishment {
  establishmentId: string;
  name: string;
  description?: string;
  address: string;
  neighborhood?: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  establishmentType?: string;
  userId: string;
  cityId: string;
  city?: {
    cityId: string;
    name: string;
    department?: {
      departmentId: string;
      name: string;
    };
  };
  user?: {
    userId: string;
    email: string;
    phone?: string;
  };
}

// Información del alimento en una recogida
export interface PickupFood {
  foodId: string;
  name: string;
  description?: string;
  category?: string;
  quantity: number;
  unitOfMeasure: string;
  status: string;
  imageUrl?: string;
  expiresAt: string;
  establishmentId: string;
}

// Respuesta de una recogida del API
export interface PickupResponse {
  pickupId: string;
  beneficiaryId: string;
  establishmentId: string;
  foodId: string;
  status: PickupStatus;
  scheduledDate: string;
  requestedQuantity: number;
  deliveredQuantity?: number;
  confirmedAt?: string;
  visitConfirmedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  beneficiaryNotes?: string;
  establishmentNotes?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  // Relaciones pobladas
  beneficiary?: PickupBeneficiary;
  establishment?: PickupEstablishment;
  food?: PickupFood;
}

// Respuesta paginada de recogidas
export interface PaginatedPickupsResponse {
  data: PickupResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Datos para crear una recogida
export interface CreatePickupData {
  foodId: string;
  requestedQuantity: number;
  scheduledDate: string;
  beneficiaryNotes?: string;
}

// Datos para actualizar una recogida
export interface UpdatePickupData {
  scheduledDate?: string;
  beneficiaryNotes?: string;
  establishmentNotes?: string;
}

// Datos para confirmar/rechazar una recogida
export interface ConfirmPickupData {
  confirmed: boolean;
  alternativeDate?: string;
  notes?: string;
}

// Datos para completar una recogida
export interface CompletePickupData {
  deliveredQuantity: number;
  notes?: string;
}

// Datos para cancelar una recogida
export interface CancelPickupData {
  reason: string;
}

// Filtros para buscar recogidas
export interface PickupFilters {
  status?: PickupStatus;
  beneficiaryId?: string;
  establishmentId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// Estadísticas de recogidas
export interface PickupStatistics {
  byStatus: Record<string, number>;
  totalPickups: number;
  totalCompleted: number;
  totalDelivered: number;
  averageDelivery: number;
  fulfillmentRate: number;
  cancellationRate: number;
  pendingPickups: number;
}

// Helper para obtener el label de un estado
export const getPickupStatusLabel = (status: PickupStatus | string): string => {
  return PICKUP_STATUS_LABELS[status as PickupStatus] || status;
};

// Helper para obtener el color de un estado
export const getPickupStatusColor = (status: PickupStatus | string): string => {
  return PICKUP_STATUS_COLORS[status as PickupStatus] || "#9E9E9E";
};

// Helper para obtener el ícono de un estado
export const getPickupStatusIcon = (status: PickupStatus | string): string => {
  return PICKUP_STATUS_ICONS[status as PickupStatus] || "❓";
};

// Helper para verificar si una recogida está activa
export const isPickupActive = (status: PickupStatus | string): boolean => {
  return [
    PickupStatus.PENDING,
    PickupStatus.CONFIRMED,
    PickupStatus.IN_PROGRESS,
  ].includes(status as PickupStatus);
};

// Helper para verificar si una recogida está finalizada
export const isPickupFinished = (status: PickupStatus | string): boolean => {
  return [
    PickupStatus.COMPLETED,
    PickupStatus.CANCELLED,
    PickupStatus.REJECTED,
  ].includes(status as PickupStatus);
};

// Helper para verificar si una recogida se puede cancelar
export const canCancelPickup = (status: PickupStatus | string): boolean => {
  return [PickupStatus.PENDING, PickupStatus.CONFIRMED].includes(
    status as PickupStatus
  );
};
