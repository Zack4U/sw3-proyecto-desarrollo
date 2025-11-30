import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Pressable,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { styles } from "../styles/PickupManagementScreenStyle";
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
  PickupManagement: undefined;
  PickupDetails: { pickupId: string };
  Home: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "PickupManagement">;
};

type TabType = "pending" | "confirmed" | "completed" | "all";

export default function PickupManagementScreen({
  navigation,
}: Readonly<Props>) {
  const { user } = useAuth();
  const toast = useToast();

  // States
  const [pickups, setPickups] = useState<PickupResponse[]>([]);
  const [statistics, setStatistics] = useState<PickupStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Modal states
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [completeModalVisible, setCompleteModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState<PickupResponse | null>(
    null
  );
  const [deliveredQuantity, setDeliveredQuantity] = useState("");
  const [cancelReason, setCancelReason] = useState("");

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
        pickupService.getEstablishmentPickups({ limit: 100 }),
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

  // Handle confirm pickup
  const handleConfirmPickup = (pickup: PickupResponse) => {
    setSelectedPickup(pickup);
    setConfirmModalVisible(true);
  };

  const submitConfirmPickup = async () => {
    if (!selectedPickup) return;

    try {
      setProcessingId(selectedPickup.pickupId);
      await pickupService.confirmPickup(selectedPickup.pickupId, {});
      toast.success("Recogida confirmada. El beneficiario ha sido notificado");
      setConfirmModalVisible(false);
      await loadData();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al confirmar";
      toast.error(message);
    } finally {
      setProcessingId(null);
    }
  };

  // Handle complete pickup
  const handleCompletePickup = (pickup: PickupResponse) => {
    setSelectedPickup(pickup);
    setDeliveredQuantity(pickup.requestedQuantity.toString());
    setCompleteModalVisible(true);
  };

  const submitCompletePickup = async () => {
    if (!selectedPickup) return;

    const quantity = parseInt(deliveredQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      toast.error("Por favor ingresa una cantidad válida");
      return;
    }

    try {
      setProcessingId(selectedPickup.pickupId);
      await pickupService.completePickup(selectedPickup.pickupId, {
        deliveredQuantity: quantity,
        notes: "Entrega completada exitosamente",
      });
      toast.success("¡Entrega completada! Ambos han sido notificados");
      setCompleteModalVisible(false);
      await loadData();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al completar";
      toast.error(message);
    } finally {
      setProcessingId(null);
    }
  };

  // Handle reject/cancel pickup
  const handleRejectPickup = (pickup: PickupResponse) => {
    setSelectedPickup(pickup);
    setCancelReason("");
    setCancelModalVisible(true);
  };

  const submitRejectPickup = async () => {
    if (!selectedPickup) return;

    if (!cancelReason.trim()) {
      toast.error("Por favor ingresa un motivo");
      return;
    }

    try {
      setProcessingId(selectedPickup.pickupId);
      // Usar confirm con confirmed: false para rechazar
      await pickupService.confirm(selectedPickup.pickupId, {
        confirmed: false,
        notes: cancelReason,
      });
      toast.success("Recogida rechazada. El beneficiario ha sido notificado");
      setCancelModalVisible(false);
      await loadData();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al rechazar";
      toast.error(message);
    } finally {
      setProcessingId(null);
    }
  };

  // Filter pickups by tab
  const filteredPickups = pickups.filter((pickup) => {
    switch (activeTab) {
      case "pending":
        return pickup.status === PickupStatus.PENDING;
      case "confirmed":
        return [PickupStatus.CONFIRMED, PickupStatus.IN_PROGRESS].includes(
          pickup.status as PickupStatus
        );
      case "completed":
        return pickup.status === PickupStatus.COMPLETED;
      case "all":
        return true;
      default:
        return true;
    }
  });

  // Sort by date
  const sortedPickups = [...filteredPickups].sort((a, b) => {
    if (activeTab === "pending" || activeTab === "confirmed") {
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
    const isProcessing = processingId === item.pickupId;

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
              {item.beneficiary?.firstName} {item.beneficiary?.lastName}
            </Text>
            <Text style={styles.pickupCardSubtitle} numberOfLines={1}>
              {item.food?.name || "Alimento"}
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
              Cantidad solicitada:{" "}
              <Text style={styles.pickupInfoHighlight}>
                {item.requestedQuantity}
              </Text>
              {item.deliveredQuantity !== null &&
                item.deliveredQuantity !== undefined && (
                  <Text> | Entregado: {item.deliveredQuantity}</Text>
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
          {item.beneficiaryNotes && (
            <View style={styles.pickupInfoRow}>
              <Text style={styles.pickupInfoIcon}>📝</Text>
              <Text style={styles.pickupInfoText} numberOfLines={2}>
                {item.beneficiaryNotes}
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        {item.status === PickupStatus.PENDING && (
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => handleRejectPickup(item)}
              disabled={isProcessing}
            >
              <Text style={styles.rejectButtonText}>Rechazar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.confirmButton]}
              onPress={() => handleConfirmPickup(item)}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {item.status === PickupStatus.CONFIRMED && (
          <View style={styles.actionButtonsContainer}>
            <View style={styles.waitingContainer}>
              <Text style={styles.waitingIcon}>⏳</Text>
              <Text style={styles.waitingText}>
                Esperando que el beneficiario confirme su llegada
              </Text>
            </View>
          </View>
        )}

        {item.status === PickupStatus.IN_PROGRESS && (
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.completeButton]}
              onPress={() => handleCompletePickup(item)}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.completeButtonText}>Completar Entrega</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Footer */}
        <View style={styles.pickupCardFooter}>
          <Text style={styles.pickupDate}>
            {new Date(item.createdAt).toLocaleDateString("es-CO")}
          </Text>
        </View>
      </Pressable>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>
        {activeTab === "pending"
          ? "📭"
          : activeTab === "confirmed"
          ? "📋"
          : "✨"}
      </Text>
      <Text style={styles.emptyTitle}>
        {activeTab === "pending"
          ? "No hay solicitudes pendientes"
          : activeTab === "confirmed"
          ? "No hay recogidas confirmadas"
          : "No hay recogidas completadas"}
      </Text>
      <Text style={styles.emptyText}>
        {activeTab === "pending"
          ? "Las nuevas solicitudes de recogida aparecerán aquí"
          : activeTab === "confirmed"
          ? "Las recogidas confirmadas aparecerán aquí"
          : "El historial de entregas aparecerá aquí"}
      </Text>
    </View>
  );

  // Loading state
  if (loading && pickups.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3CA55C" />
        <Text style={styles.loadingText}>Cargando solicitudes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gestión de Recogidas</Text>
        <Text style={styles.headerSubtitle}>
          Administra las solicitudes de alimentos
        </Text>
      </View>

      {/* Statistics */}
      {statistics && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{statistics.pendingPickups}</Text>
            <Text style={styles.statLabel}>Pendientes</Text>
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
          style={[styles.tab, activeTab === "pending" && styles.tabActive]}
          onPress={() => setActiveTab("pending")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "pending" && styles.tabTextActive,
            ]}
          >
            Pendientes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "confirmed" && styles.tabActive]}
          onPress={() => setActiveTab("confirmed")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "confirmed" && styles.tabTextActive,
            ]}
          >
            Confirmadas
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
          style={[styles.tab, activeTab === "all" && styles.tabActive]}
          onPress={() => setActiveTab("all")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "all" && styles.tabTextActive,
            ]}
          >
            Todas
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

      {/* Confirm Modal */}
      <Modal
        visible={confirmModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar Recogida</Text>
            <Text style={styles.modalDescription}>
              ¿Deseas confirmar esta solicitud de recogida? El beneficiario será
              notificado.
            </Text>
            {selectedPickup && (
              <View style={styles.pickupInfoRow}>
                <Text style={styles.modalDescription}>
                  📦 {selectedPickup.food?.name} - Cantidad:{" "}
                  {selectedPickup.requestedQuantity}
                </Text>
              </View>
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setConfirmModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirmButton]}
                onPress={submitConfirmPickup}
                disabled={processingId !== null}
              >
                {processingId !== null ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalConfirmButtonText}>Confirmar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Complete Modal */}
      <Modal
        visible={completeModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCompleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Completar Entrega</Text>
            <Text style={styles.modalDescription}>
              Ingresa la cantidad de alimentos que fueron entregados al
              beneficiario.
            </Text>
            <Text style={styles.inputLabel}>Cantidad entregada:</Text>
            <TextInput
              style={styles.modalInput}
              value={deliveredQuantity}
              onChangeText={setDeliveredQuantity}
              keyboardType="numeric"
              placeholder="Cantidad"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setCompleteModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirmButton]}
                onPress={submitCompletePickup}
                disabled={processingId !== null}
              >
                {processingId !== null ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalConfirmButtonText}>Completar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Cancel/Reject Modal */}
      <Modal
        visible={cancelModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCancelModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rechazar Solicitud</Text>
            <Text style={styles.modalDescription}>
              Por favor indica el motivo del rechazo.
            </Text>
            <Text style={styles.inputLabel}>Motivo:</Text>
            <TextInput
              style={[styles.modalInput, styles.modalInputMultiline]}
              value={cancelReason}
              onChangeText={setCancelReason}
              placeholder="Escribe el motivo..."
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setCancelModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalRejectButton]}
                onPress={submitRejectPickup}
                disabled={processingId !== null}
              >
                {processingId !== null ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalRejectButtonText}>Rechazar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
