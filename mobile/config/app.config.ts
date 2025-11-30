// Configuración de la aplicación

// URL del backend
// Para desarrollo local (emulador Android): http://10.0.2.2:3001/api/v1
// Para desarrollo local (emulador iOS o web): http://localhost:3001/api/v1
// Para dispositivo físico: usa la IP de tu computadora, ej: http://192.168.0.110:3001/api/v1

export const API_CONFIG = {
  // Cambia esta URL según tu entorno
  // BASE_URL: 'http://10.0.2.2:3001/api/v1', // Emulador Android
  // BASE_URL: 'http://localhost:3001/api/v1', // Web o iOS
  BASE_URL: "http://192.168.0.110:3001/api/v1", // Dispositivo físico

  TIMEOUT: 10000, // 10 segundos
};

// Endpoints de la API
export const API_ENDPOINTS = {
  ESTABLISHMENTS: "/establishments",
  USERS: "/users",
  FOODS: "/foods",
};

// Constantes de la aplicación
export const APP_CONFIG = {
  NAME: "ComiYa",
  VERSION: "1.0.0",
};
