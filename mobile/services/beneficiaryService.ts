import api from './api';
import axios from 'axios';

// Tipos para los datos del beneficiario
export interface CreateBeneficiaryData {
    nombre: string;
    email: string;
    telefono: string;
    user_id?: string; // Opcional por ahora
}

export interface BeneficiaryResponse {
    user_id: string;
    nombre: string;
    email: string;
    telefono: string;
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
                    return 'Ya existe un beneficiario registrado con este correo o teléfono.';
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

// Servicio para manejar operaciones de beneficiarios
export const beneficiaryService = {
    // Crear un nuevo beneficiario (usuario)
    // ⚠️ ADVERTENCIA: El endpoint /users NO EXISTE en el backend actual
    // Este servicio fallará hasta que se cree el controlador correspondiente en el backend
    create: async (data: CreateBeneficiaryData): Promise<BeneficiaryResponse> => {
        try {
            // TODO: Crear UserController en el backend antes de usar este servicio
            const payload = {
                nombre: data.nombre,
                email: data.email,
                telefono: data.telefono,
            };

            const response = await api.post<BeneficiaryResponse>('/users', payload);
            return response.data;
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.error('Error al crear beneficiario:', errorMessage);
            throw new Error(errorMessage);
        }
    },

    // Obtener todos los beneficiarios
    getAll: async (): Promise<BeneficiaryResponse[]> => {
        try {
            const response = await api.get<BeneficiaryResponse[]>('/users');
            return response.data;
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.error('Error al obtener beneficiarios:', errorMessage);
            throw new Error(errorMessage);
        }
    },

    // Obtener un beneficiario por ID
    getById: async (id: string): Promise<BeneficiaryResponse> => {
        try {
            const response = await api.get<BeneficiaryResponse>(`/users/${id}`);
            return response.data;
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.error('Error al obtener beneficiario:', errorMessage);
            throw new Error(errorMessage);
        }
    },
};
