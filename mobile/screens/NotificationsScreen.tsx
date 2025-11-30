import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import notificationService, {
  StoredNotification,
  NotificationType,
} from "../services/notificationService";
import { Colors as colors } from "../styles/global";

const POLL_INTERVAL = 10000; // 10 segundos

const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [notifications, setNotifications] = useState<StoredNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadNotifications = useCallback(
    async (pageNum: number = 1, refresh: boolean = false) => {
      try {
        if (pageNum === 1) {
          refresh ? setRefreshing(true) : setLoading(true);
        } else {
          setLoadingMore(true);
        }

        const response = await notificationService.getNotifications({
          page: pageNum,
          limit: 20,
        });

        if (pageNum === 1) {
          setNotifications(response.notifications);
        } else {
          setNotifications((prev) => [...prev, ...response.notifications]);
        }

        setUnreadCount(response.unreadCount);
        setHasMore(pageNum < response.pagination.totalPages);
        setPage(pageNum);
      } catch (error) {
        console.error("Error loading notifications:", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    []
  );

  // Cargar notificaciones inicial y polling cada 10 segundos
  useEffect(() => {
    loadNotifications();

    const interval = setInterval(async () => {
      try {
        const newUnreadCount = await notificationService.getUnreadCount();
        if (newUnreadCount > unreadCount) {
          // Hay nuevas notificaciones - recargar lista
          loadNotifications(1);
          // Mostrar notificación local si hay nuevas
          if (newUnreadCount > unreadCount) {
            await notificationService.schedulePushNotification(
              "🔔 Nuevas notificaciones",
              `Tienes ${newUnreadCount} notificaciones sin leer`,
              { screen: "Notifications" },
              "default"
            );
          }
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [unreadCount]);

  const handleRefresh = () => {
    loadNotifications(1, true);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadNotifications(page + 1);
    }
  };

  const handleNotificationPress = async (notification: StoredNotification) => {
    // Marcar como leída si no lo está
    if (!notification.isRead) {
      try {
        await notificationService.markAsRead([notification.id]);
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Error marking as read:", error);
      }
    }

    // Navegar según el tipo de notificación
    const data = notification.data as Record<string, any> | undefined;
    if (data?.pickupId && data?.screen) {
      if (
        data.screen === "PickupDetails" ||
        data.screen === "PickupManagement" ||
        data.screen === "MyPickups"
      ) {
        navigation.navigate("PickupDetails", { pickupId: data.pickupId });
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
      Alert.alert("Error", "No se pudo marcar todas como leídas");
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    Alert.alert(
      "Eliminar notificación",
      "¿Estás seguro de que quieres eliminar esta notificación?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await notificationService.deleteNotification(notificationId);
              setNotifications((prev) =>
                prev.filter((n) => n.id !== notificationId)
              );
            } catch (error) {
              console.error("Error deleting notification:", error);
              Alert.alert("Error", "No se pudo eliminar la notificación");
            }
          },
        },
      ]
    );
  };

  const handleDeleteAll = async () => {
    Alert.alert(
      "Eliminar todas",
      "¿Estás seguro de que quieres eliminar todas las notificaciones?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar todas",
          style: "destructive",
          onPress: async () => {
            try {
              await notificationService.deleteAllNotifications();
              setNotifications([]);
              setUnreadCount(0);
            } catch (error) {
              console.error("Error deleting all notifications:", error);
              Alert.alert("Error", "No se pudo eliminar las notificaciones");
            }
          },
        },
      ]
    );
  };

  const getNotificationIcon = (type: NotificationType): string => {
    switch (type) {
      case "PICKUP_NEW_REQUEST":
        return "add-circle";
      case "PICKUP_CONFIRMED":
        return "checkmark-circle";
      case "PICKUP_REJECTED":
        return "close-circle";
      case "PICKUP_VISIT_CONFIRMED":
        return "location";
      case "PICKUP_COMPLETED":
        return "trophy";
      case "PICKUP_CANCELLED":
        return "ban";
      case "SYSTEM":
      default:
        return "notifications";
    }
  };

  const getNotificationColor = (type: NotificationType): string => {
    switch (type) {
      case "PICKUP_NEW_REQUEST":
        return colors.primary;
      case "PICKUP_CONFIRMED":
        return colors.success;
      case "PICKUP_REJECTED":
        return colors.error;
      case "PICKUP_VISIT_CONFIRMED":
        return colors.info;
      case "PICKUP_COMPLETED":
        return colors.success;
      case "PICKUP_CANCELLED":
        return colors.warning;
      case "SYSTEM":
      default:
        return colors.textSecondary;
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Ahora";
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString("es-ES");
  };

  const renderNotification = ({ item }: { item: StoredNotification }) => (
    <TouchableOpacity
      style={[styles.notificationCard, !item.isRead && styles.unreadCard]}
      onPress={() => handleNotificationPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.notificationContent}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: `${getNotificationColor(item.type)}20` },
          ]}
        >
          <Ionicons
            name={getNotificationIcon(item.type) as any}
            size={24}
            color={getNotificationColor(item.type)}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, !item.isRead && styles.unreadTitle]}>
            {item.title}
          </Text>
          <Text style={styles.body} numberOfLines={2}>
            {item.body}
          </Text>
          <Text style={styles.time}>{formatDate(item.createdAt)}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteNotification(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>
      {!item.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>
      <View style={styles.headerActions}>
        {unreadCount > 0 && (
          <TouchableOpacity
            onPress={handleMarkAllAsRead}
            style={styles.headerButton}
          >
            <Ionicons name="checkmark-done" size={22} color={colors.primary} />
          </TouchableOpacity>
        )}
        {notifications.length > 0 && (
          <TouchableOpacity
            onPress={handleDeleteAll}
            style={styles.headerButton}
          >
            <Ionicons name="trash" size={22} color={colors.error} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="notifications-off-outline"
        size={64}
        color={colors.textSecondary}
      />
      <Text style={styles.emptyTitle}>Sin notificaciones</Text>
      <Text style={styles.emptyText}>
        Aquí aparecerán tus notificaciones sobre recogidas y actualizaciones
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Cargando notificaciones...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          notifications.length === 0 && styles.emptyList,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 48,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  badge: {
    backgroundColor: colors.error,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: "bold",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  listContent: {
    padding: 16,
  },
  emptyList: {
    flex: 1,
  },
  notificationCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: "relative",
  },
  unreadCard: {
    backgroundColor: `${colors.primary}08`,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  notificationContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  unreadTitle: {
    fontWeight: "bold",
  },
  body: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  unreadDot: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
});

export default NotificationsScreen;
