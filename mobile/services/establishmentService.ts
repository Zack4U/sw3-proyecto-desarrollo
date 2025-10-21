import api from './api';
import axios from 'axios';

// Tipos para los datos del establecimiento (según el diagrama)
export interface CreateEstablishmentData {
    name: string;
    description?: string;
    cityId: string;
    neighborhood?: string;
    address: string;
    location: string;
    establishmentType: string;
    userId?: string;
}

export interface EstablishmentResponse {
    establecimiento_id: string;
    nombre?: string;
    direccion: string;
    tipo: string;
    ubicacion: string;
    fecha_registro: string;
    user_id: string;
}

// Función helper para formatear mensajes de error
const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        // Error de respuesta del servidor
        if (error.response) {
            const status = error.response.status;
            const data = error.response.data;

            // Mensajes específicos según el código de estado
            switch (status) {
                case 400:
                    return data?.message || 'Datos inválidos. Por favor verifica la información ingresada.';
                case 401:
                    return 'No autorizado. Por favor inicia sesión nuevamente.';
                case 403:
                    return 'No tienes permisos para realizar esta acción.';
                case 404:
                    return 'Recurso no encontrado.';
                case 409:
                    return 'Ya existe un establecimiento con estos datos.';
                case 500:
                    return 'Error del servidor. Por favor intenta nuevamente más tarde.';
                default:
                    return data?.message || `Error del servidor (${status})`;
            }
        }

        // Error de red
        if (error.request) {
            return 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
        }
    }

    // Error genérico
    if (error instanceof Error) {
        return error.message;
    }

    return 'Ocurrió un error inesperado. Por favor intenta nuevamente.';
};

// Servicio para manejar operaciones de establecimientos
export const establishmentService = {
    // Crear un nuevo establecimiento
    create: async (data: CreateEstablishmentData): Promise<EstablishmentResponse> => {
        try {
            const payload = {
                address: data.address,
                type: data.establishmentType,
                location: data.location,
                user_id: data.userId || 'temp-user-id',
            };

            const response = await api.post<EstablishmentResponse>('/establishments', payload);
            return response.data;
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.error('Error al crear establecimiento:', errorMessage);
            throw new Error(errorMessage);
        }
    },

    // Obtener todos los establecimientos
    getAll: async (): Promise<EstablishmentResponse[]> => {
        try {
            const response = await api.get<EstablishmentResponse[]>('/establishments');
            return response.data;
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.error('Error al obtener establecimientos:', errorMessage);
            throw new Error(errorMessage);
        }
    },

    // Obtener un establecimiento por ID
    getById: async (id: string): Promise<EstablishmentResponse> => {
        try {
            const response = await api.get<EstablishmentResponse>(`/establishments/${id}`);
            return response.data;
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.error('Error al obtener establecimiento:', errorMessage);
            throw new Error(errorMessage);
        }
    },

    // Actualizar un establecimiento
    update: async (id: string, data: Partial<CreateEstablishmentData>): Promise<EstablishmentResponse> => {
        try {
            const response = await api.put<EstablishmentResponse>(`/establishments/${id}`, data);
            return response.data;
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.error('Error al actualizar establecimiento:', errorMessage);
            throw new Error(errorMessage);
        }
    },

    // Eliminar un establecimiento
    delete: async (id: string): Promise<void> => {
        try {
            await api.delete(`/establishments/${id}`);
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.error('Error al eliminar establecimiento:', errorMessage);
            throw new Error(errorMessage);
        }
    },
};
