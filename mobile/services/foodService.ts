import api from './api';
import axios from 'axios';

// Tipos para los datos de alimentos
export interface CreateFoodData {
    name: string;
    description?: string;
    category: string;
    quantity: number;
    unitOfMeasure: string;
    expiresAt: string; // ISO date string
    status?: string;
    imageUrl?: string;
    establishmentId: string;
}

export interface FoodResponse {
    food_id: string;
    name: string;
    description?: string;
    category: string;
    quantity: number;
    unitOfMeasure: string;
    status: string;
    imageUrl?: string;
    expiresAt: string;
    establishment_id: string;
    createdAt: string;
    updatedAt: string;
}

// Categorías de alimentos
export const FOOD_CATEGORIES = [
    { value: 'Frutas', label: 'Frutas' },
    { value: 'Verduras', label: 'Verduras' },
    { value: 'Lácteos', label: 'Lácteos' },
    { value: 'Carnes', label: 'Carnes' },
    { value: 'Panadería', label: 'Panadería' },
    { value: 'Bebidas', label: 'Bebidas' },
    { value: 'Enlatados', label: 'Enlatados' },
    { value: 'Granos', label: 'Granos' },
    { value: 'Comida Preparada', label: 'Comida Preparada' },
    { value: 'Otros', label: 'Otros' },
];

// Unidades de medida
export const UNIT_OF_MEASURE = [
    { value: 'kg', label: 'Kilogramos (kg)' },
    { value: 'g', label: 'Gramos (g)' },
    { value: 'lb', label: 'Libras (lb)' },
    { value: 'oz', label: 'Onzas (oz)' },
    { value: 'L', label: 'Litros (L)' },
    { value: 'mL', label: 'Mililitros (mL)' },
    { value: 'unidad', label: 'Unidad' },
    { value: 'porción', label: 'Porción' },
    { value: 'paquete', label: 'Paquete' },
];

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
                    return (
                        data?.message ||
                        'Datos inválidos. Por favor verifica la información ingresada.'
                    );
                case 401:
                    return 'No autorizado. Por favor inicia sesión nuevamente.';
                case 403:
                    return 'No tienes permisos para realizar esta acción.';
                case 404:
                    return 'Establecimiento no encontrado.';
                case 409:
                    return 'Ya existe un alimento registrado con estos datos.';
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

// Servicio para manejar operaciones de alimentos
export const foodService = {
    // Crear un nuevo alimento
    create: async (data: CreateFoodData): Promise<FoodResponse> => {
        try {
            const payload = {
                name: data.name,
                description: data.description,
                category: data.category,
                quantity: data.quantity,
                weight_unit: data.unitOfMeasure,
                expiration_date: data.expiresAt,
                status: data.status || 'AVAILABLE',
                image: data.imageUrl || '',
                establishment_id: data.establishmentId,
            };

            const response = await api.post<FoodResponse>('/foods', payload);
            return response.data;
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.error('Error al crear alimento:', errorMessage);
            throw new Error(errorMessage);
        }
    },

    // Obtener todos los alimentos
    getAll: async (): Promise<FoodResponse[]> => {
        try {
            const response = await api.get<FoodResponse[]>('/foods');
            return response.data;
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.error('Error al obtener alimentos:', errorMessage);
            throw new Error(errorMessage);
        }
    },

    // Obtener alimentos por establecimiento
    getByEstablishment: async (establishmentId: string): Promise<FoodResponse[]> => {
        try {
            const response = await api.get<FoodResponse[]>(
                `/foods/establishment/${establishmentId}`
            );
            return response.data;
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.error('Error al obtener alimentos del establecimiento:', errorMessage);
            throw new Error(errorMessage);
        }
    },

    // Obtener alimentos por categoría
    getByCategory: async (category: string): Promise<FoodResponse[]> => {
        try {
            const response = await api.get<FoodResponse[]>(`/foods/category/${encodeURIComponent(category)}`);
            return response.data;
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.error('Error al obtener alimentos por categoría:', errorMessage);
            throw new Error(errorMessage);
        }
    },

    // Buscar alimentos por nombre (coincidencia parcial)
    searchByName: async (name: string): Promise<FoodResponse[]> => {
        try {
            const response = await api.get<FoodResponse[]>(`/foods/name/${encodeURIComponent(name)}`);
            return response.data;
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.error('Error al buscar alimentos por nombre:', errorMessage);
            throw new Error(errorMessage);
        }
    },

    // Obtener un alimento por ID
    getById: async (id: string): Promise<FoodResponse> => {
        try {
            const response = await api.get<FoodResponse>(`/foods/${id}`);
            return response.data;
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.error('Error al obtener alimento:', errorMessage);
            throw new Error(errorMessage);
        }
    },

    // Actualizar un alimento
    update: async (
        id: string,
        data: Partial<CreateFoodData>
    ): Promise<FoodResponse> => {
        try {
            const response = await api.put<FoodResponse>(`/foods/${id}`, data);
            return response.data;
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.error('Error al actualizar alimento:', errorMessage);
            throw new Error(errorMessage);
        }
    },

    // Eliminar un alimento
    delete: async (id: string): Promise<void> => {
        try {
            await api.delete(`/foods/${id}`);
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.error('Error al eliminar alimento:', errorMessage);
            throw new Error(errorMessage);
        }
    },
};
