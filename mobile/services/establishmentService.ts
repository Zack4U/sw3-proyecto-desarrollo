import api from './api';

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

// Servicio para manejar operaciones de establecimientos
export const establishmentService = {
    // Crear un nuevo establecimiento
    create: async (data: CreateEstablishmentData): Promise<EstablishmentResponse> => {
        try {
            const payload = {
                name: data.name,
                description: data.description,
                cityId: data.cityId,
                neighborhood: data.neighborhood,
                address: data.address,
                location: data.location,
                establishmentType: data.establishmentType,
                userId: data.userId || 'temp-user-id',
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
