import * as Notifications from "expo-notifications";

export interface NotificationData {
  type:
    | "order_created"
    | "order_updated"
    | "order_completed"
    | "food_alert"
    | "system";
  orderId?: string;
  foodId?: string;
  establishmentId?: string;
  message?: string;
  [key: string]: any;
}

export interface PushToken {
  token: string;
  platform: "ios" | "android";
}

// Tipos de notificación para recogidas
export enum PickupNotificationType {
  NEW_REQUEST = "NEW_REQUEST",
  REQUEST_CONFIRMED = "REQUEST_CONFIRMED",
  REQUEST_REJECTED = "REQUEST_REJECTED",
  VISIT_CONFIRMED = "VISIT_CONFIRMED",
  PICKUP_COMPLETED = "PICKUP_COMPLETED",
  PICKUP_CANCELLED = "PICKUP_CANCELLED",
}

export interface LastPickupNotification {
  type: PickupNotificationType;
  pickupId: string;
}

// ← USAR EL TIPO DE EXPO DIRECTAMENTE
export type NotificationResponse = Notifications.NotificationResponse;
export type Notification = Notifications.Notification;

export interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notification | null;
  lastPickupNotification: LastPickupNotification | null;
  registerForPushNotifications: () => Promise<void>;
  sendTestNotification: () => Promise<void>;
  clearLastPickupNotification: () => void;
}
