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
    foodId: string;
    name: string;
    description?: string;
    category: string;
    quantity: number;
    unitOfMeasure: string;
    status: string;
    imageUrl?: string;
    expiresAt: string;
    establishmentId: string;
    createdAt: string;
    updatedAt: string;
}

// Categorías de alimentos (deben coincidir con el enum FoodCategory del backend)
export const FOOD_CATEGORIES = [
    { value: 'FRUITS', label: 'Frutas' },
    { value: 'VEGETABLES', label: 'Verduras' },
    { value: 'GREENS', label: 'Verduras de Hoja' },
    { value: 'LEGUMES', label: 'Legumbres' },
    { value: 'TUBERS', label: 'Tubérculos' },
    { value: 'RED_MEAT', label: 'Carnes Rojas' },
    { value: 'POULTRY', label: 'Aves' },
    { value: 'FISH', label: 'Pescado' },
    { value: 'SEAFOOD', label: 'Mariscos' },
    { value: 'COLD_CUTS', label: 'Embutidos' },
    { value: 'DAIRY', label: 'Lácteos' },
    { value: 'CHEESE', label: 'Quesos' },
    { value: 'YOGURT', label: 'Yogurt' },
    { value: 'EGGS', label: 'Huevos' },
    { value: 'CEREALS', label: 'Cereales' },
    { value: 'GRAINS', label: 'Granos' },
    { value: 'PASTA', label: 'Pasta' },
    { value: 'BAKERY', label: 'Panadería' },
    { value: 'FLOUR', label: 'Harinas' },
    { value: 'CANNED', label: 'Enlatados' },
    { value: 'PRESERVES', label: 'Conservas' },
    { value: 'SAUCES_AND_CONDIMENTS', label: 'Salsas y Condimentos' },
    { value: 'OILS_AND_VINEGARS', label: 'Aceites y Vinagres' },
    { value: 'SPICES_AND_HERBS', label: 'Especias y Hierbas' },
    { value: 'SOUPS_AND_CREAMS', label: 'Sopas y Cremas' },
    { value: 'SALTY_SNACKS', label: 'Snacks Salados' },
    { value: 'SWEETS_AND_CHOCOLATES', label: 'Dulces y Chocolates' },
    { value: 'COOKIES_AND_DESSERTS', label: 'Galletas y Postres' },
    { value: 'NUTS', label: 'Frutos Secos' },
    { value: 'NON_ALCOHOLIC_BEVERAGES', label: 'Bebidas No Alcohólicas' },
    { value: 'JUICES', label: 'Jugos' },
    { value: 'COFFEE_AND_TEA', label: 'Café y Té' },
    { value: 'ALCOHOLIC_BEVERAGES', label: 'Bebidas Alcohólicas' },
    { value: 'FROZEN', label: 'Congelados' },
    { value: 'PREPARED_FOOD', label: 'Comida Preparada' },
    { value: 'OTHERS', label: 'Otros' },
];

// Unidades de medida (deben coincidir con el enum UnitOfMeasure del backend)
export const UNIT_OF_MEASURE = [
    { value: 'UNIT', label: 'Unidad' },
    { value: 'DOZEN', label: 'Docena' },
    { value: 'PACKAGE', label: 'Paquete' },
    { value: 'BOX', label: 'Caja' },
    { value: 'CAN', label: 'Lata' },
    { value: 'BOTTLE', label: 'Botella' },
    { value: 'BAG', label: 'Bolsa' },
    { value: 'ROLL', label: 'Rollo' },
    { value: 'JAR', label: 'Frasco' },
    { value: 'TUBE', label: 'Tubo' },
    { value: 'GRAM', label: 'Gramos (g)' },
    { value: 'KILOGRAM', label: 'Kilogramos (kg)' },
    { value: 'MILLIGRAM', label: 'Miligramos (mg)' },
    { value: 'LITER', label: 'Litros (L)' },
    { value: 'MILLILITER', label: 'Mililitros (mL)' },
    { value: 'CUBIC_CENTIMETER', label: 'Centímetros Cúbicos (cc)' },
    { value: 'OUNCE', label: 'Onzas (oz)' },
    { value: 'POUND', label: 'Libras (lb)' },
    { value: 'FLUID_OUNCE', label: 'Onzas Líquidas (fl oz)' },
    { value: 'PINT', label: 'Pinta' },
    { value: 'QUART', label: 'Cuarto de Galón' },
    { value: 'GALLON', label: 'Galón' },
    { value: 'TEASPOON', label: 'Cucharadita' },
    { value: 'TABLESPOON', label: 'Cucharada' },
    { value: 'CUP', label: 'Taza' },
    { value: 'PINCH', label: 'Pizca' },
    { value: 'CLOVE', label: 'Diente' },
    { value: 'BRANCH', label: 'Rama' },
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
            // Formatear el payload según lo que espera el backend
            const payload = {
                name: data.name,
                description: data.description,
                category: data.category, // Ya viene en formato correcto (FRUITS, VEGETABLES, etc.)
                quantity: data.quantity,
                unitOfMeasure: data.unitOfMeasure, // Ya viene en formato correcto (KILOGRAM, LITER, etc.)
                expiresAt: data.expiresAt, // ISO date string
                status: data.status || 'AVAILABLE',
                imageUrl: data.imageUrl || undefined,
                establishmentId: data.establishmentId,
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
