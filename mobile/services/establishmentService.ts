import api from './api';

// Tipos para los datos del establecimiento
export interface CreateEstablishmentData {
    nombre: string;
    address: string;
    type: string;
    location: string;
    user_id?: string; // Opcional por ahora, se puede asignar un valor por defecto
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

// Servicio para manejar operaciones de establecimientos
export const establishmentService = {
    // Crear un nuevo establecimiento
    create: async (data: CreateEstablishmentData): Promise<EstablishmentResponse> => {
        try {
            // Por ahora, usar un user_id temporal si no se proporciona
            const payload = {
                address: data.address,
                type: data.type,
                location: data.location,
                user_id: data.user_id || 'temp-user-id',
            };

            const response = await api.post<EstablishmentResponse>('/establishments', payload);
            return response.data;
        } catch (error) {
            console.error('Error al crear establecimiento:', error);
            throw error;
        }
    },

    // Obtener todos los establecimientos
    getAll: async (): Promise<EstablishmentResponse[]> => {
        try {
            const response = await api.get<EstablishmentResponse[]>('/establishments');
            return response.data;
        } catch (error) {
            console.error('Error al obtener establecimientos:', error);
            throw error;
        }
    },

    // Obtener un establecimiento por ID
    getById: async (id: string): Promise<EstablishmentResponse> => {
        try {
            const response = await api.get<EstablishmentResponse>(`/establishments/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener establecimiento:', error);
            throw error;
        }
    },

    // Actualizar un establecimiento
    update: async (id: string, data: Partial<CreateEstablishmentData>): Promise<EstablishmentResponse> => {
        try {
            const response = await api.put<EstablishmentResponse>(`/establishments/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar establecimiento:', error);
            throw error;
        }
    },

    // Eliminar un establecimiento
    delete: async (id: string): Promise<void> => {
        try {
            await api.delete(`/establishments/${id}`);
        } catch (error) {
            console.error('Error al eliminar establecimiento:', error);
            throw error;
        }
    },
};
