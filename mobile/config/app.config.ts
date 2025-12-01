// Configuración de la aplicación

// URL del backend
// Para desarrollo local (emulador Android): http://10.0.2.2:3001/api/v1
// Para desarrollo local (emulador iOS o web): http://localhost:3001/api/v1
// Para dispositivo físico: usa la IP de tu computadora, ej: http://192.168.0.110:3001/api/v1

import Constants from 'expo-constants';

// Función para obtener la URL del backend dinámicamente
const getBackendUrl = () => {
	// Si estamos en desarrollo, intentar obtener la IP de la máquina host
	if (__DEV__) {
		const debuggerHost = Constants.expoConfig?.hostUri;
		if (debuggerHost) {
			const ip = debuggerHost.split(':')[0];
			// Retornar la URL con la IP detectada
			return `http://${ip}:3001/api/v1`;
		}
	}

	// Fallback para producción o si no se detecta
	return 'http://192.168.20.48:3001/api/v1';
};

export const API_CONFIG = {
	// URL dinámica basada en el entorno
	BASE_URL: getBackendUrl(),

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
