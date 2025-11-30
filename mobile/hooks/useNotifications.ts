import { useState, useEffect, useRef, useCallback } from "react";
import * as Notifications from "expo-notifications";
import notificationService from "../services/notificationService";
import { NotificationData } from "../types/notification.types";

// Tipos de notificación para recogidas
export enum PickupNotificationType {
  NEW_REQUEST = "NEW_REQUEST",
  REQUEST_CONFIRMED = "REQUEST_CONFIRMED",
  REQUEST_REJECTED = "REQUEST_REJECTED",
  VISIT_CONFIRMED = "VISIT_CONFIRMED",
  PICKUP_COMPLETED = "PICKUP_COMPLETED",
  PICKUP_CANCELLED = "PICKUP_CANCELLED",
}

// Callback de navegación que se puede configurar desde el App
type NavigationCallback = (
  screen: string,
  params?: Record<string, any>
) => void;
let navigationCallback: NavigationCallback | null = null;

export const setNavigationCallback = (callback: NavigationCallback) => {
  navigationCallback = callback;
};

export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const [lastPickupNotification, setLastPickupNotification] = useState<{
    type: PickupNotificationType;
    pickupId: string;
  } | null>(null);
  const notificationListener = useRef<Notifications.EventSubscription | null>(
    null
  );
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    // No registramos automáticamente - se debe llamar después del login
    // registerForPushNotifications();

    // Listener para notificaciones recibidas (app en foreground)
    notificationListener.current =
      notificationService.addNotificationReceivedListener((notification) => {
        console.log("📬 Notificación recibida:", notification);
        setNotification(notification);
      });

    // Listener para cuando el usuario toca la notificación
    responseListener.current =
      notificationService.addNotificationResponseReceivedListener(
        (response) => {
          console.log("👆 Notificación tocada:", response);
          handleNotificationResponse(response);
        }
      );

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
      console.error("Error registrando notificaciones:", error);
    }
  };

  const handleNotificationResponse = useCallback(
    (response: Notifications.NotificationResponse) => {
      const data = response.notification.request.content
        .data as NotificationData & {
        type?: string;
        pickupId?: string;
        screen?: string;
      };

      console.log("📱 Procesando notificación:", data);

      // Manejar notificaciones de recogidas (Pickup)
      if (data.screen && data.pickupId) {
        setLastPickupNotification({
          type: data.type as PickupNotificationType,
          pickupId: data.pickupId,
        });

        // Usar el callback de navegación si está configurado
        if (navigationCallback) {
          if (
            data.screen === "PickupManagement" ||
            data.screen === "MyPickups"
          ) {
            // Primero navegar a la lista, luego a los detalles
            navigationCallback(data.screen);
            setTimeout(() => {
              navigationCallback?.("PickupDetails", {
                pickupId: data.pickupId,
              });
            }, 100);
          } else {
            navigationCallback(data.screen, { pickupId: data.pickupId });
          }
        }
        return;
      }

      // Aquí puedes navegar a diferentes pantallas según el tipo de notificación legacy
      switch (data.type) {
        case "order_created":
        case "order_updated":
        case "order_completed":
          // Navegar a la pantalla de detalles del pedido
          console.log("Navegar a pedido:", data.orderId);
          break;

        case "food_alert":
          // Navegar a la pantalla de alimentos
          console.log("Navegar a alimento:", data.foodId);
          break;

        case "system":
          // Mostrar mensaje del sistema
          console.log("Mensaje del sistema:", data.message);
          break;

        default:
          console.log("Tipo de notificación desconocido:", data);
      }
    },
    []
  );

  const sendTestNotification = async () => {
    await notificationService.sendTestNotificationToBackend();
  };

  const clearLastPickupNotification = useCallback(() => {
    setLastPickupNotification(null);
  }, []);

  return {
    expoPushToken,
    notification,
    lastPickupNotification,
    registerForPushNotifications,
    sendTestNotification,
    clearLastPickupNotification,
  };
};
