import * as Notifications from 'expo-notifications';

export interface NotificationData {
    type: 'order_created' | 'order_updated' | 'order_completed' | 'food_alert' | 'system';
    orderId?: string;
    foodId?: string;
    establishmentId?: string;
    message?: string;
    [key: string]: any;
}

export interface PushToken {
    token: string;
    platform: 'ios' | 'android';
}

// ← USAR EL TIPO DE EXPO DIRECTAMENTE
export type NotificationResponse = Notifications.NotificationResponse;
export type Notification = Notifications.Notification;

export interface NotificationContextType {
    expoPushToken: string | null;
    notification: Notification | null;  // ← CAMBIAR AQUÍ
    registerForPushNotifications: () => Promise<void>;
    sendTestNotification: () => Promise<void>;
}