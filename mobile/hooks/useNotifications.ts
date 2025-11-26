import { useState, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import notificationService from '../services/notificationService';
import { NotificationData } from '../types/notification.types';

export const useNotifications = () => {
	const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
	const [notification, setNotification] = useState<Notifications.Notification | null>(
		null
	);
	const notificationListener = useRef<Notifications.EventSubscription | null>(null);
	const responseListener = useRef<Notifications.EventSubscription | null>(null);

	useEffect(() => {
		// No registramos automáticamente - se debe llamar después del login
		// registerForPushNotifications();

		// Listener para notificaciones recibidas (app en foreground)
		notificationListener.current = notificationService.addNotificationReceivedListener(
			(notification) => {
				console.log('📬 Notificación recibida:', notification);
				setNotification(notification);
			}
		);

		// Listener para cuando el usuario toca la notificación
		responseListener.current =
			notificationService.addNotificationResponseReceivedListener((response) => {
				console.log('👆 Notificación tocada:', response);
				handleNotificationResponse(response);
			});

		return () => {
			if (notificationListener.current) {
				notificationListener.current.remove();
			}
			if (responseListener.current) {
				responseListener.current.remove();
			}
		};
	}, []);

	const registerForPushNotifications = async () => {
		try {
			const token = await notificationService.getExpoPushToken();
			if (token) {
				setExpoPushToken(token);
				await notificationService.registerTokenWithBackend(token);
			}
		} catch (error) {
			console.error('Error registrando notificaciones:', error);
		}
	};

	const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
		const data = response.notification.request.content.data as NotificationData;

		// Aquí puedes navegar a diferentes pantallas según el tipo de notificación
		switch (data.type) {
			case 'order_created':
			case 'order_updated':
			case 'order_completed':
				// Navegar a la pantalla de detalles del pedido
				console.log('Navegar a pedido:', data.orderId);
				// navigation.navigate('OrderDetails', { orderId: data.orderId });
				break;

			case 'food_alert':
				// Navegar a la pantalla de alimentos
				console.log('Navegar a alimento:', data.foodId);
				// navigation.navigate('FoodDetails', { foodId: data.foodId });
				break;

			case 'system':
				// Mostrar mensaje del sistema
				console.log('Mensaje del sistema:', data.message);
				break;

			default:
				console.log('Tipo de notificación desconocido:', data);
		}
	};

	const sendTestNotification = async () => {
		await notificationService.sendTestNotificationToBackend();
	};

	return {
		expoPushToken,
		notification,
		registerForPushNotifications,
		sendTestNotification,
	};
};
