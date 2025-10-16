import api from './api';

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

// Servicio para manejar operaciones de beneficiarios
export const beneficiaryService = {
    // Crear un nuevo beneficiario (usuario)
    // Nota: Ajusta el endpoint según tu backend
    create: async (data: CreateBeneficiaryData): Promise<BeneficiaryResponse> => {
        try {
            const payload = {
                nombre: data.nombre,
                email: data.email,
                telefono: data.telefono,
            };


            // Por ahora uso /users, pero puede ser diferente
            const response = await api.post<BeneficiaryResponse>('/users', payload);
            return response.data;
        } catch (error) {
            console.error('Error al crear beneficiario:', error);
            throw error;
        }
    },

    // Obtener todos los beneficiarios
    getAll: async (): Promise<BeneficiaryResponse[]> => {
        try {
            const response = await api.get<BeneficiaryResponse[]>('/users');
            return response.data;
        } catch (error) {
            console.error('Error al obtener beneficiarios:', error);
            throw error;
        }
    },

    // Obtener un beneficiario por ID
    getById: async (id: string): Promise<BeneficiaryResponse> => {
        try {
            const response = await api.get<BeneficiaryResponse>(`/users/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener beneficiario:', error);
            throw error;
        }
    },
};
