import Toast from 'react-native-toast-message';

/**
 * Hook personalizado para mostrar toasts de feedback
 * Simplifica el uso de react-native-toast-message en toda la app
 */
export const useToast = () => {
	/**
	 * Muestra toast de éxito (verde)
	 * @param message - Mensaje principal
	 * @param title - Título opcional (default: "Éxito")
	 */
	const success = (message: string, title: string = '✅ Éxito') => {
		Toast.show({
			type: 'success',
			text1: title,
			text2: message,
			position: 'top',
			visibilityTime: 3000,
			topOffset: 50,
		});
	};

	/**
	 * Muestra toast de error (rojo)
	 * @param message - Mensaje principal
	 * @param title - Título opcional (default: "Error")
	 */
	const error = (message: string, title: string = '❌ Error') => {
		Toast.show({
			type: 'error',
			text1: title,
			text2: message,
			position: 'top',
			visibilityTime: 4000,
			topOffset: 50,
		});
	};

	/**
	 * Muestra toast informativo (azul)
	 * @param message - Mensaje principal
	 * @param title - Título opcional (default: "Información")
	 */
	const info = (message: string, title: string = 'ℹ️ Información') => {
		Toast.show({
			type: 'info',
			text1: title,
			text2: message,
			position: 'top',
			visibilityTime: 3000,
			topOffset: 50,
		});
	};

	/**
	 * Muestra toast de advertencia (amarillo)
	 * @param message - Mensaje principal
	 * @param title - Título opcional (default: "Advertencia")
	 */
	const warning = (message: string, title: string = '⚠️ Advertencia') => {
		Toast.show({
			type: 'error', // Usamos 'error' y personalizamos el color en config
			text1: title,
			text2: message,
			position: 'top',
			visibilityTime: 3000,
			topOffset: 50,
		});
	};

	return {
		success,
		error,
		info,
		warning,
	};
};
