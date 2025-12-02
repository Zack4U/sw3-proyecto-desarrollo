import api from "./api";
import axios from "axios";
import {
  PickupResponse,
  PaginatedPickupsResponse,
  CreatePickupData,
  UpdatePickupData,
  ConfirmPickupData,
  CompletePickupData,
  CancelPickupData,
  PickupFilters,
  PickupStatistics,
} from "../types/pickup.types";

// Función helper para formatear mensajes de error
const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      switch (status) {
        case 400:
          return (
            data?.message ||
            "Datos inválidos. Por favor verifica la información."
          );
        case 401:
          return "No autorizado. Por favor inicia sesión nuevamente.";
        case 403:
          return "No tienes permisos para realizar esta acción.";
        case 404:
          return data?.message || "Recurso no encontrado.";
        case 409:
          return "Ya existe una solicitud para este alimento.";
        case 500:
          return "Error del servidor. Por favor intenta nuevamente.";
        default:
          return data?.message || `Error del servidor (${status})`;
      }
    }
    if (error.request) {
      return "No se pudo conectar con el servidor. Verifica tu conexión.";
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Ocurrió un error inesperado.";
};

export const pickupService = {
  /**
   * Crear una nueva solicitud de recogida
   */
  create: async (data: CreatePickupData): Promise<PickupResponse> => {
    try {
      const response = await api.post<PickupResponse>("/pickups", data);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Obtener todas las recogidas con filtros opcionales
   */
  getAll: async (
    filters?: PickupFilters
  ): Promise<PaginatedPickupsResponse> => {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append("status", filters.status);
      if (filters?.beneficiaryId)
        params.append("beneficiaryId", filters.beneficiaryId);
      if (filters?.establishmentId)
        params.append("establishmentId", filters.establishmentId);
      if (filters?.startDate) params.append("startDate", filters.startDate);
      if (filters?.endDate) params.append("endDate", filters.endDate);
      if (filters?.page) params.append("page", filters.page.toString());
      if (filters?.limit) params.append("limit", filters.limit.toString());

      const queryString = params.toString();
      const url = `/pickups${queryString ? `?${queryString}` : ""}`;
      const response = await api.get<PaginatedPickupsResponse>(url);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Obtener las recogidas del beneficiario autenticado
   */
  getMyPickups: async (
    filters?: PickupFilters
  ): Promise<PaginatedPickupsResponse> => {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append("status", filters.status);
      if (filters?.startDate) params.append("startDate", filters.startDate);
      if (filters?.endDate) params.append("endDate", filters.endDate);
      if (filters?.page) params.append("page", filters.page.toString());
      if (filters?.limit) params.append("limit", filters.limit.toString());

      const queryString = params.toString();
      const url = `/pickups/my-pickups${queryString ? `?${queryString}` : ""}`;
      const response = await api.get<PaginatedPickupsResponse>(url);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Obtener las recogidas del establecimiento autenticado
   */
  getEstablishmentPickups: async (
    filters?: PickupFilters
  ): Promise<PaginatedPickupsResponse> => {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append("status", filters.status);
      if (filters?.startDate) params.append("startDate", filters.startDate);
      if (filters?.endDate) params.append("endDate", filters.endDate);
      if (filters?.page) params.append("page", filters.page.toString());
      if (filters?.limit) params.append("limit", filters.limit.toString());

      const queryString = params.toString();
      const url = `/pickups/establishment${
        queryString ? `?${queryString}` : ""
      }`;
      const response = await api.get<PaginatedPickupsResponse>(url);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Obtener una recogida por ID
   */
  getById: async (id: string): Promise<PickupResponse> => {
    try {
      const response = await api.get<PickupResponse>(`/pickups/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Confirmar o rechazar una recogida (establecimiento)
   */
  confirm: async (
    id: string,
    data: ConfirmPickupData
  ): Promise<PickupResponse> => {
    try {
      const response = await api.put<PickupResponse>(
        `/pickups/${id}/confirm`,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Confirmar llegada al establecimiento (beneficiario)
   */
  confirmVisit: async (id: string): Promise<PickupResponse> => {
    try {
      const response = await api.put<PickupResponse>(`/pickups/${id}/visit`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Completar entrega (establecimiento)
   */
  complete: async (
    id: string,
    data: CompletePickupData
  ): Promise<PickupResponse> => {
    try {
      const response = await api.put<PickupResponse>(
        `/pickups/${id}/complete`,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Cancelar recogida (beneficiario)
   */
  cancel: async (
    id: string,
    data: CancelPickupData
  ): Promise<PickupResponse> => {
    try {
      const response = await api.put<PickupResponse>(
        `/pickups/${id}/cancel`,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Actualizar recogida
   */
  update: async (
    id: string,
    data: UpdatePickupData
  ): Promise<PickupResponse> => {
    try {
      const response = await api.put<PickupResponse>(`/pickups/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Obtener estadísticas de recogidas
   */
  getStatistics: async (): Promise<PickupStatistics> => {
    try {
      const response = await api.get<PickupStatistics>("/pickups/statistics");
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Confirmar recogida (alias para confirm - usado en pantallas)
   */
  confirmPickup: async (
    id: string,
    data: { confirmedQuantity?: number; notes?: string }
  ): Promise<PickupResponse> => {
    try {
      const response = await api.put<PickupResponse>(`/pickups/${id}/confirm`, {
        confirmed: true,
        notes: data.notes,
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Completar recogida (alias para complete - usado en pantallas)
   */
  completePickup: async (
    id: string,
    data: CompletePickupData
  ): Promise<PickupResponse> => {
    try {
      const response = await api.put<PickupResponse>(
        `/pickups/${id}/complete`,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Cancelar recogida (alias para cancel - usado en pantallas)
   */
  cancelPickup: async (
    id: string,
    data: CancelPickupData & { cancelledBy?: string }
  ): Promise<PickupResponse> => {
    try {
      const response = await api.put<PickupResponse>(
        `/pickups/${id}/cancel`,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Obtener una recogida por ID (alias - usado en pantallas)
   */
  getPickupById: async (id: string): Promise<PickupResponse> => {
    try {
      const response = await api.get<PickupResponse>(`/pickups/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};

export default pickupService;
