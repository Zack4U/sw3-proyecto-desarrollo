import axios from 'axios';
import { API_CONFIG } from '../config/app.config';

// Crear instancia de axios con configuración base
const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});// Interceptor para manejar respuestas
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // El servidor respondió con un código de error
            console.error('Error de respuesta:', error.response.data);
            throw new Error(error.response.data.message || 'Error en el servidor');
        } else if (error.request) {
            // La petición se hizo pero no hubo respuesta
            console.error('Error de red:', error.request);
            throw new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
        } else {
            // Algo pasó al configurar la petición
            console.error('Error:', error.message);
            throw error;
        }
    }
);

export default api;
