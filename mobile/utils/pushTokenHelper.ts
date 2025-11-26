import notificationService from '../services/notificationService';

/**
 * Helper: Registrar token de notificaciones push después de login exitoso
 * Se llama automáticamente después de cualquier método de autenticación
 */
export const registerPushTokenAfterAuth = async (): Promise<void> => {
	try {
		const pushToken = await notificationService.getExpoPushToken();
		if (pushToken) {
			await notificationService.registerTokenWithBackend(pushToken);
			console.log('✅ Token push registrado después de autenticación');
		}
	} catch (error) {
		// No es crítico si falla - las notificaciones son opcionales
		console.log('⚠️ No se pudo registrar token push (opcional):', error);
	}
};
