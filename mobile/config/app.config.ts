// Configuración de la aplicación

// URL del backend
// Para desarrollo local (emulador Android): http://10.0.2.2:3000
// Para desarrollo local (emulador iOS o web): http://localhost:3000
// Para dispositivo físico: usa la IP de tu computadora, ej: http://192.168.1.X:3000

export const API_CONFIG = {
    // Cambia esta URL según tu entorno
    BASE_URL: 'http://localhost:3000',

    // Alternativas comunes:
    // BASE_URL: 'http://10.0.2.2:3000', // Para emulador Android
    // BASE_URL: 'http://192.168.1.X:3000', // Para dispositivo físico (reemplaza X con tu IP)

    TIMEOUT: 10000, // 10 segundos
};

// Endpoints de la API
export const API_ENDPOINTS = {
    ESTABLISHMENTS: '/establishments',
    USERS: '/users',
    FOODS: '/foods',
};

// Constantes de la aplicación
export const APP_CONFIG = {
    NAME: 'ComiYa',
    VERSION: '1.0.0',
};
