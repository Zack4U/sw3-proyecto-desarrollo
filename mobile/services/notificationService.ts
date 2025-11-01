import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import api from './api';

// Configurar comportamiento de notificaciones
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

class NotificationService {
    private static instance: NotificationService;

    private constructor() {
        this.setupNotificationChannel();
    }

    static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    private async setupNotificationChannel() {
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'Notificaciones Generales',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
                sound: 'default',
            });

            // Canal para pedidos
            await Notifications.setNotificationChannelAsync('orders', {
                name: 'Pedidos',
                importance: Notifications.AndroidImportance.HIGH,
                vibrationPattern: [0, 250, 250, 250],
                sound: 'default',
            });

            // Canal para alertas de alimentos
            await Notifications.setNotificationChannelAsync('food-alerts', {
                name: 'Alertas de Alimentos',
                importance: Notifications.AndroidImportance.HIGH,
                vibrationPattern: [0, 500, 250, 500],
                sound: 'default',
            });
        }
    }

    async requestPermissions(): Promise<boolean> {
        if (!Device.isDevice) {
            console.warn('Las notificaciones push solo funcionan en dispositivos físicos');
            return false;
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.warn('Permisos de notificación denegados');
            return false;
        }

        return true;
    }

    async getExpoPushToken(): Promise<string | null> {
        try {
            const hasPermission = await this.requestPermissions();
            if (!hasPermission) return null;

            const projectId = Constants.expoConfig?.extra?.eas?.projectId;

            const token = await Notifications.getExpoPushTokenAsync({
                projectId,
            });

            console.log('Push Token obtenido:', token.data);
            return token.data;
        } catch (error) {
            console.error('Error obteniendo push token:', error);
            return null;
        }
    }

    async registerTokenWithBackend(token: string): Promise<void> {
        try {
            const platform = Platform.OS as 'ios' | 'android';

            await api.post('/notifications/register', {
                token,
                platform,
            });

            console.log('Token registrado en el backend');
        } catch (error) {
            console.error('Error registrando token en backend:', error);
            throw error;
        }
    }

    async schedulePushNotification(
        title: string,
        body: string,
        data?: any,
        channelId: string = 'default'
    ): Promise<void> {
        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                data,
                sound: true,
                ...(Platform.OS === 'android' && { channelId }),
            },
            trigger: null,
        });
    }

    addNotificationReceivedListener(
        listener: (notification: Notifications.Notification) => void
    ) {
        return Notifications.addNotificationReceivedListener(listener);
    }

    addNotificationResponseReceivedListener(
        listener: (response: Notifications.NotificationResponse) => void
    ) {
        return Notifications.addNotificationResponseReceivedListener(listener);
    }

    async getBadgeCount(): Promise<number> {
        return await Notifications.getBadgeCountAsync();
    }

    async setBadgeCount(count: number): Promise<void> {
        await Notifications.setBadgeCountAsync(count);
    }

    async clearBadge(): Promise<void> {
        await Notifications.setBadgeCountAsync(0);
    }

    async getAllScheduledNotifications() {
        return await Notifications.getAllScheduledNotificationsAsync();
    }

    async cancelAllScheduledNotifications() {
        await Notifications.cancelAllScheduledNotificationsAsync();
    }
}

export default NotificationService.getInstance();