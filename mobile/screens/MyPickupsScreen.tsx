import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Pressable,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { styles } from "../styles/MyPickupsScreenStyle";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import pickupService from "../services/pickupService";
import {
  PickupResponse,
  PickupStatus,
  PickupStatistics,
  getPickupStatusLabel,
  getPickupStatusColor,
  getPickupStatusIcon,
  isPickupActive,
} from "../types/pickup.types";

type RootStackParamList = {
  MyPickups: undefined;
  PickupDetails: { pickupId: string };
  EstablishmentList: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "MyPickups">;
};

type TabType = "active" | "completed" | "cancelled";

export default function MyPickupsScreen({ navigation }: Readonly<Props>) {
  const { user } = useAuth();
  const toast = useToast();

  // States
  const [pickups, setPickups] = useState<PickupResponse[]>([]);
  const [statistics, setStatistics] = useState<PickupStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("active");

  // Load data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      setLoading(true);
      const [pickupsResponse, statsResponse] = await Promise.all([
        pickupService.getMyPickups({ limit: 100 }),
        pickupService.getStatistics(),
      ]);
      setPickups(pickupsResponse.data);
      setStatistics(statsResponse);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al cargar datos";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Filter pickups by tab
  const filteredPickups = pickups.filter((pickup) => {
    switch (activeTab) {
      case "active":
        return isPickupActive(pickup.status);
      case "completed":
        return pickup.status === PickupStatus.COMPLETED;
      case "cancelled":
        return [PickupStatus.CANCELLED, PickupStatus.REJECTED].includes(
          pickup.status as PickupStatus
        );
      default:
        return true;
    }
  });

  // Sort by date (most recent first for completed/cancelled, soonest first for active)
  const sortedPickups = [...filteredPickups].sort((a, b) => {
    if (activeTab === "active") {
      return (
        new Date(a.scheduledDate).getTime() -
        new Date(b.scheduledDate).getTime()
      );
    }
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const renderPickupCard = ({ item }: { item: PickupResponse }) => {
    const statusColor = getPickupStatusColor(item.status);
    const statusLabel = getPickupStatusLabel(item.status);
    const statusIcon = getPickupStatusIcon(item.status);

    return (
      <Pressable
        style={({ pressed }) => [
          styles.pickupCard,
          pressed && styles.pickupCardPressed,
        ]}
        onPress={() =>
          navigation.navigate("PickupDetails", { pickupId: item.pickupId })
        }
      >
        {/* Header */}
        <View style={styles.pickupCardHeader}>
          <View style={styles.pickupCardTitleContainer}>
            <Text style={styles.pickupCardTitle} numberOfLines={1}>
              {item.food?.name || "Alimento"}
            </Text>
            <Text style={styles.pickupCardSubtitle} numberOfLines={1}>
              {item.establishment?.name || "Establecimiento"}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusIcon}>{statusIcon}</Text>
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>
        </View>

        {/* Body */}
        <View style={styles.pickupCardBody}>
          <View style={styles.pickupInfoRow}>
            <Text style={styles.pickupInfoIcon}>📦</Text>
            <Text style={styles.pickupInfoText}>
              <Text style={styles.pickupInfoHighlight}>
                {item.requestedQuantity}
              </Text>
              {item.deliveredQuantity !== null &&
                item.deliveredQuantity !== undefined && (
                  <Text> → Entregado: {item.deliveredQuantity}</Text>
                )}
            </Text>
          </View>
          <View style={styles.pickupInfoRow}>
            <Text style={styles.pickupInfoIcon}>📅</Text>
            <Text style={styles.pickupInfoText}>
              {new Date(item.scheduledDate).toLocaleString("es-CO", {
                weekday: "short",
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
          {item.establishment?.address && (
            <View style={styles.pickupInfoRow}>
              <Text style={styles.pickupInfoIcon}>📍</Text>
              <Text style={styles.pickupInfoText} numberOfLines={1}>
                {item.establishment.address}
              </Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.pickupCardFooter}>
          <Text style={styles.pickupDate}>
            Creada: {new Date(item.createdAt).toLocaleDateString("es-CO")}
          </Text>
          <Text style={styles.viewDetailsText}>Ver detalles →</Text>
        </View>
      </Pressable>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>
        {activeTab === "active"
          ? "📭"
          : activeTab === "completed"
          ? "✨"
          : "🗑️"}
      </Text>
      <Text style={styles.emptyTitle}>
        {activeTab === "active"
          ? "No tienes recogidas activas"
          : activeTab === "completed"
          ? "Aún no has completado recogidas"
          : "No hay recogidas canceladas"}
      </Text>
      <Text style={styles.emptyText}>
        {activeTab === "active"
          ? "Explora los alimentos disponibles y solicita una recogida"
          : activeTab === "completed"
          ? "Aquí aparecerán tus recogidas completadas"
          : "Aquí aparecerán las recogidas canceladas o rechazadas"}
      </Text>
      {activeTab === "active" && (
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={() => navigation.navigate("EstablishmentList")}
        >
          <Text style={styles.emptyButtonText}>Ver Establecimientos</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Loading state
  if (loading && pickups.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3CA55C" />
        <Text style={styles.loadingText}>Cargando tus recogidas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Recogidas</Text>
        <Text style={styles.headerSubtitle}>
          Historial de tus solicitudes de alimentos
        </Text>
      </View>

      {/* Statistics */}
      {statistics && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{statistics.totalPickups}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{statistics.totalCompleted}</Text>
            <Text style={styles.statLabel}>Completadas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#4CAF50" }]}>
              {statistics.fulfillmentRate.toFixed(0)}%
            </Text>
            <Text style={styles.statLabel}>Cumplimiento</Text>
          </View>
        </View>
      )}

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "active" && styles.tabActive]}
          onPress={() => setActiveTab("active")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "active" && styles.tabTextActive,
            ]}
          >
            Activas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "completed" && styles.tabActive]}
          onPress={() => setActiveTab("completed")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "completed" && styles.tabTextActive,
            ]}
          >
            Completadas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "cancelled" && styles.tabActive]}
          onPress={() => setActiveTab("cancelled")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "cancelled" && styles.tabTextActive,
            ]}
          >
            Canceladas
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <View style={styles.listContainer}>
        <FlatList
          data={sortedPickups}
          renderItem={renderPickupCard}
          keyExtractor={(item) => item.pickupId}
          contentContainerStyle={[
            styles.listContent,
            sortedPickups.length === 0 && { flex: 1 },
          ]}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#3CA55C"]}
              tintColor="#3CA55C"
            />
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}
