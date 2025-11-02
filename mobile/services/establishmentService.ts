import api from "./api";
import axios from "axios";

// Tipos para los datos del establecimiento
export interface CreateEstablishmentData {
  establishmentId: string; // UUID generado en el frontend
  name: string;
  description?: string;
  cityId: string;
  neighborhood?: string;
  address: string;
  location: {
    type: string;
    coordinates: number[];
  };
  establishmentType: string;
  userId: string;
}

export interface EstablishmentResponse {
  establishmentId: string;
  name: string;
  description?: string;
  address: string;
  neighborhood?: string;
  location: any;
  establishmentType: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  cityId: string;
  foodAvailable?: number;
}

// Tipos de establecimiento (deben coincidir con el enum EstablishmentType del backend)
export const ESTABLISHMENT_TYPES = [
  // Comida y Bebidas
  { value: "RESTAURANT", label: "Restaurante" },
  { value: "COFFEE_SHOP", label: "Cafetería" },
  { value: "BAR", label: "Bar" },
  { value: "NIGHTCLUB", label: "Discoteca" },
  { value: "BAKERY", label: "Panadería" },
  { value: "SUPERMARKET", label: "Supermercado" },
  { value: "GROCERY_STORE", label: "Tienda de Abarrotes" },
  { value: "FRUIT_SHOP", label: "Frutería" },
  { value: "BUTCHER_SHOP", label: "Carnicería" },
  { value: "FOOD_TRUCK", label: "Food Truck" },

  // Alojamiento
  { value: "HOTEL", label: "Hotel" },
  { value: "HOSTEL", label: "Hostal" },
  { value: "MOTEL", label: "Motel" },
  { value: "APART_HOTEL", label: "Apart Hotel" },

  // Comercio Minorista
  { value: "CLOTHING_STORE", label: "Tienda de Ropa" },
  { value: "SHOE_STORE", label: "Zapatería" },
  { value: "JEWELRY_STORE", label: "Joyería" },
  { value: "BOOKSTORE", label: "Librería" },
  { value: "STATIONERY_STORE", label: "Papelería" },
  { value: "TOY_STORE", label: "Juguetería" },
  { value: "ELECTRONICS_STORE", label: "Tienda de Electrónicos" },
  { value: "SPORTS_STORE", label: "Tienda de Deportes" },
  { value: "PHARMACY", label: "Farmacia" },
  { value: "HARDWARE_STORE", label: "Ferretería" },
  { value: "PET_STORE", label: "Tienda de Mascotas" },
  { value: "NURSERY", label: "Vivero" },

  // Servicios
  { value: "HAIR_SALON", label: "Peluquería" },
  { value: "BARBER_SHOP", label: "Barbería" },
  { value: "BEAUTY_CENTER", label: "Centro de Belleza" },
  { value: "SPA", label: "Spa" },
  { value: "GYM", label: "Gimnasio" },
  { value: "LAUNDRY", label: "Lavandería" },
  { value: "AUTO_REPAIR_SHOP", label: "Taller Mecánico" },
  { value: "MEDICAL_OFFICE", label: "Consultorio Médico" },
  { value: "DENTAL_OFFICE", label: "Consultorio Dental" },
  { value: "VETERINARY", label: "Veterinaria" },
  { value: "CORPORATE_OFFICE", label: "Oficina Corporativa" },
  { value: "EDUCATIONAL_CENTER", label: "Centro Educativo" },

  // Entretenimiento y Cultura
  { value: "CINEMA", label: "Cine" },
  { value: "THEATER", label: "Teatro" },
  { value: "MUSEUM", label: "Museo" },
  { value: "ART_GALLERY", label: "Galería de Arte" },
  { value: "EVENT_CENTER", label: "Centro de Eventos" },
  { value: "AMUSEMENT_PARK", label: "Parque de Diversiones" },
  { value: "BOWLING_ALLEY", label: "Bolera" },

  // Otros
  { value: "SHOPPING_MALL", label: "Centro Comercial" },
  { value: "PARKING", label: "Estacionamiento" },
  { value: "OTHER", label: "Otro" },
];

/**
 * Traduce el tipo de establecimiento de inglés a español
 * @param establishmentType - El tipo de establecimiento en inglés (ej: 'RESTAURANT')
 * @returns El nombre en español (ej: 'Restaurante') o el valor original si no se encuentra
 */
export const getEstablishmentTypeLabel = (
  establishmentType: string
): string => {
  const type = ESTABLISHMENT_TYPES.find((t) => t.value === establishmentType);
  return type ? type.label : establishmentType;
};

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
            "Datos inválidos. Por favor verifica la información ingresada."
          );
        case 401:
          return "No autorizado. Por favor inicia sesión nuevamente.";
        case 403:
          return "No tienes permisos para realizar esta acción.";
        case 404:
          return "Recurso no encontrado.";
        case 409:
          return "Ya existe un establecimiento con estos datos.";
        case 500:
          return "Error del servidor. Por favor intenta nuevamente más tarde.";
        default:
          return data?.message || `Error del servidor (${status})`;
      }
    }

    // Error de red
    if (error.request) {
      return "No se pudo conectar con el servidor. Verifica tu conexión a internet.";
    }
  }

  // Error genérico
  if (error instanceof Error) {
    return error.message;
  }

  return "Ocurrió un error inesperado. Por favor intenta nuevamente.";
};

// Tipo para la respuesta paginada
export interface PaginatedEstablishments {
  data: EstablishmentResponse[];
  total: number;
}

// Tipo para la respuesta de establecimientos con comida disponible
export interface EstablishmentsWithAvailableFood {
  totalAvailable: number;
  total: number;
  establishments: EstablishmentResponse[];
}

// Servicio para manejar operaciones de establecimientos
export const establishmentService = {
  // Crear un nuevo establecimiento
  create: async (
    data: CreateEstablishmentData
  ): Promise<EstablishmentResponse> => {
    try {
      // Formatear el payload según lo que espera el backend
      const payload = {
        establishmentId: data.establishmentId,
        name: data.name,
        description: data.description,
        address: data.address,
        neighborhood: data.neighborhood,
        location: data.location, // Debe ser un objeto GeoJSON
        establishmentType: data.establishmentType,
        userId: data.userId,
        cityId: data.cityId,
      };

      const response = await api.post<EstablishmentResponse>(
        "/establishments",
        payload
      );
      return response.data;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error("Error al crear establecimiento:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Obtener establecimientos paginados
  getPaginated: async (
    page = 1,
    limit = 10
  ): Promise<PaginatedEstablishments> => {
    try {
      const response = await api.get<PaginatedEstablishments>(
        `/establishments?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error("Error al obtener establecimientos:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Obtener un establecimiento por ID
  getById: async (id: string): Promise<EstablishmentResponse> => {
    try {
      const response = await api.get<EstablishmentResponse>(
        `/establishments/${id}`
      );
      return response.data;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error("Error al obtener establecimiento:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Actualizar un establecimiento
  update: async (
    id: string,
    data: Partial<CreateEstablishmentData>
  ): Promise<EstablishmentResponse> => {
    try {
      const response = await api.put<EstablishmentResponse>(
        `/establishments/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error("Error al actualizar establecimiento:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Eliminar un establecimiento
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/establishments/${id}`);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error("Error al eliminar establecimiento:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Obtener establecimientos con comida disponible
  getWithAvailableFood: async (filters?: {
    page?: number;
    limit?: number;
    cityId?: string;
    departmentId?: string;
    establishmentType?: string;
  }): Promise<EstablishmentsWithAvailableFood> => {
    try {
      const params = new URLSearchParams();

      if (filters?.page) params.append("page", filters.page.toString());
      if (filters?.limit) params.append("limit", filters.limit.toString());
      if (filters?.cityId) params.append("cityId", filters.cityId);
      if (filters?.departmentId)
        params.append("departmentId", filters.departmentId);
      if (filters?.establishmentType)
        params.append("establishmentType", filters.establishmentType);

      const queryString = params.toString();
      const url = `/establishments/available/food${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await api.get<EstablishmentsWithAvailableFood>(url);
      return response.data;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error(
        "Error al obtener establecimientos con comida disponible:",
        errorMessage
      );
      throw new Error(errorMessage);
    }
  },
};
