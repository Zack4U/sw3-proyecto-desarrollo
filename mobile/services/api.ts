import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import * as SecureStore from "expo-secure-store";
import { API_CONFIG } from "../config/app.config";

// Crear instancia de axios con configuración base
const api: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Variable para almacenar el callback de refresh fallido
let refreshCallback: (() => void) | null = null;
let isRefreshing = false;

/**
 * Configurar el callback para cuando el refresh falle
 * Usado por el AuthContext para redirigir al login
 */
export const setRefreshFailedCallback = (callback: () => void) => {
  refreshCallback = callback;
};

/**
 * Interceptor de REQUEST: Agregar token a todas las peticiones
 */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      console.log(`📤 Request: ${config.method?.toUpperCase()} ${config.url}`);
      console.log(`📤 Base URL: ${config.baseURL}`);
      console.log(`📤 Data:`, config.data);

      const accessToken = await SecureStore.getItemAsync("accessToken");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch (error) {
      console.warn("Error al obtener token de SecureStore:", error);
    }
    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

/**
 * Interceptor de RESPONSE: Manejar errores y refresh automático
 */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Si el error es 401 y no es una petición de refresh, intentar refrescar el token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh") &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/logout") // ← NO intentar refresh en logout
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshToken = await SecureStore.getItemAsync("refreshToken");

          if (!refreshToken) {
            // No hay refresh token, ir al login
            isRefreshing = false;
            if (refreshCallback) {
              refreshCallback();
            }
            return Promise.reject(error);
          }

          // Realizar refresh
          const response = await axios.post(
            `${API_CONFIG.BASE_URL}/auth/refresh`,
            { refreshToken },
            {
              timeout: API_CONFIG.TIMEOUT,
              headers: { "Content-Type": "application/json" },
            }
          );

          const { accessToken, refreshToken: newRefreshToken } = response.data;

          // Guardar nuevos tokens
          await SecureStore.setItemAsync("accessToken", accessToken);
          await SecureStore.setItemAsync("refreshToken", newRefreshToken);

          // Actualizar header para reintentar
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          isRefreshing = false;

          // Reintentar request original
          return api(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          // Refresh falló, ir al login
          if (refreshCallback) {
            refreshCallback();
          }
          return Promise.reject(refreshError);
        }
      }
    }

    // Manejar errores generales
    if (error.response) {
      console.error("❌ Response error:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      });
      const message =
        (error.response.data as any)?.message || "Error en el servidor";
      throw new Error(message);
    } else if (error.request) {
      console.error("❌ Network error - No response received");
      console.error("Request config:", {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        method: error.config?.method,
      });
      throw new Error(
        "No se pudo conectar con el servidor. Verifica tu conexión."
      );
    } else {
      console.error("❌ Unknown error:", error.message);
      throw error;
    }
  }
);

export default api;
