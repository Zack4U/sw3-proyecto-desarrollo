import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  TextInput,
  Modal,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { styles } from "../styles/PickupDetailsScreenStyle";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import pickupService from "../services/pickupService";
import {
  getFoodCategoryLabel,
  getUnitOfMeasureLabel,
} from "../services/foodService";
import {
  PickupResponse,
  PickupStatus,
  getPickupStatusLabel,
  getPickupStatusColor,
  getPickupStatusIcon,
  isPickupActive,
  canCancelPickup,
} from "../types/pickup.types";

type RootStackParamList = {
  PickupDetails: { pickupId: string };
  MyPickups: undefined;
  PickupManagement: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "PickupDetails">;
  route: RouteProp<RootStackParamList, "PickupDetails">;
};

export default function PickupDetailsScreen({
  navigation,
  route,
}: Readonly<Props>) {
  const { pickupId } = route.params;
  const { user } = useAuth();
  const toast = useToast();

  // States
  const [pickup, setPickup] = useState<PickupResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const isEstablishment = user?.role === "ESTABLISHMENT";
  const isBeneficiary = user?.role === "BENEFICIARY";

  useEffect(() => {
    loadPickup();
  }, [pickupId]);

  const loadPickup = async () => {
    try {
      setLoading(true);
      const response = await pickupService.getPickupById(pickupId);
      setPickup(response);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al cargar la recogida";
      toast.error(message);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel pickup
  const handleCancelPickup = () => {
    setCancelReason("");
    setCancelModalVisible(true);
  };

  const submitCancelPickup = async () => {
    if (!cancelReason.trim()) {
      toast.error("Por favor ingresa un motivo");
      return;
    }

    try {
      setProcessing(true);
      await pickupService.cancelPickup(pickupId, {
        reason: cancelReason,
      });
      toast.success(
        "Recogida cancelada. El establecimiento ha sido notificado"
      );
      setCancelModalVisible(false);
      await loadPickup();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al cancelar";
      toast.error(message);
    } finally {
      setProcessing(false);
    }
  };

  // Modal states for confirm/complete
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [completeModalVisible, setCompleteModalVisible] = useState(false);
  const [inputQuantity, setInputQuantity] = useState("");

  // Handle confirm pickup (establishment only)
  const handleConfirmPickup = () => {
    if (!pickup) return;
    setInputQuantity(pickup.requestedQuantity.toString());
    setConfirmModalVisible(true);
  };

  const submitConfirmPickup = async () => {
    try {
      setProcessing(true);
      await pickupService.confirmPickup(pickupId, {});
      toast.success("Recogida confirmada. El beneficiario ha sido notificado");
      setConfirmModalVisible(false);
      await loadPickup();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al confirmar";
      toast.error(message);
    } finally {
      setProcessing(false);
    }
  };

  // Handle confirm visit (beneficiary confirms arrival at establishment)
  const handleConfirmVisit = async () => {
    Alert.alert(
      "Confirmar Llegada",
      "¿Has llegado al establecimiento para recoger los alimentos?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Sí, he llegado",
          onPress: async () => {
            try {
              setProcessing(true);
              await pickupService.confirmVisit(pickupId);
              toast.success(
                "Llegada confirmada. El establecimiento ha sido notificado"
              );
              await loadPickup();
            } catch (error) {
              const message =
                error instanceof Error
                  ? error.message
                  : "Error al confirmar llegada";
              toast.error(message);
            } finally {
              setProcessing(false);
            }
          },
        },
      ]
    );
  };

  // Handle complete pickup (establishment only)
  const handleCompletePickup = () => {
    if (!pickup) return;
    setInputQuantity(pickup.requestedQuantity.toString());
    setCompleteModalVisible(true);
  };

  const submitCompletePickup = async () => {
    const qty = parseInt(inputQuantity || "0");
    if (isNaN(qty) || qty <= 0) {
      toast.error("Cantidad inválida");
      return;
    }
    try {
      setProcessing(true);
      await pickupService.completePickup(pickupId, { deliveredQuantity: qty });
      toast.success("¡Entrega completada! Ambos han sido notificados");
      setCompleteModalVisible(false);
      await loadPickup();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al completar";
      toast.error(message);
    } finally {
      setProcessing(false);
    }
  };

  // Open maps
  const openMaps = () => {
    if (!pickup?.establishment?.address) return;

    const address = encodeURIComponent(pickup.establishment.address);
    const url = `https://www.google.com/maps/search/?api=1&query=${address}`;
    Linking.openURL(url);
  };

  // Call establishment
  const callEstablishment = () => {
    if (!pickup?.establishment) return;
    // Assuming establishment has phone field - adjust as needed
    const phone = (pickup.establishment as any).phone;
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3CA55C" />
        <Text style={styles.loadingText}>Cargando detalles...</Text>
      </View>
    );
  }

  if (!pickup) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>❌</Text>
        <Text style={styles.errorTitle}>No se encontró la recogida</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusColor = getPickupStatusColor(pickup.status);
  const statusLabel = getPickupStatusLabel(pickup.status);
  const statusIcon = getPickupStatusIcon(pickup.status);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Status Header */}
      <View style={[styles.statusHeader, { backgroundColor: statusColor }]}>
        <Text style={styles.statusHeaderIcon}>{statusIcon}</Text>
        <Text style={styles.statusHeaderText}>{statusLabel}</Text>
      </View>

      {/* Food Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alimento</Text>
        <View style={styles.card}>
          <Text style={styles.foodName}>{pickup.food?.name || "Alimento"}</Text>
          {pickup.food?.description && (
            <Text style={styles.foodDescription}>
              {pickup.food.description}
            </Text>
          )}
          {pickup.food?.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {getFoodCategoryLabel(pickup.food.category)}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Quantities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cantidades</Text>
        <View style={styles.quantitiesContainer}>
          <View style={styles.quantityItem}>
            <Text style={styles.quantityValue}>{pickup.requestedQuantity}</Text>
            <Text style={styles.quantityLabel}>Solicitado</Text>
            {pickup.food?.unitOfMeasure && (
              <Text style={styles.quantityUnit}>
                {getUnitOfMeasureLabel(pickup.food.unitOfMeasure)}
              </Text>
            )}
          </View>
          {pickup.deliveredQuantity !== null &&
            pickup.deliveredQuantity !== undefined && (
              <View style={styles.quantityItem}>
                <Text style={[styles.quantityValue, { color: "#4CAF50" }]}>
                  {pickup.deliveredQuantity}
                </Text>
                <Text style={styles.quantityLabel}>Entregado</Text>
                {pickup.food?.unitOfMeasure && (
                  <Text style={styles.quantityUnit}>
                    {getUnitOfMeasureLabel(pickup.food.unitOfMeasure)}
                  </Text>
                )}
              </View>
            )}
        </View>
      </View>

      {/* Schedule */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fecha y Hora</Text>
        <View style={styles.card}>
          <View style={styles.scheduleRow}>
            <Text style={styles.scheduleIcon}>📅</Text>
            <Text style={styles.scheduleText}>
              {new Date(pickup.scheduledDate).toLocaleDateString("es-CO", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
          <View style={styles.scheduleRow}>
            <Text style={styles.scheduleIcon}>🕐</Text>
            <Text style={styles.scheduleText}>
              {new Date(pickup.scheduledDate).toLocaleTimeString("es-CO", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
          {pickup.visitConfirmedAt && (
            <View style={styles.scheduleRow}>
              <Text style={styles.scheduleIcon}>✅</Text>
              <Text style={styles.scheduleText}>
                Visita confirmada:{" "}
                {new Date(pickup.visitConfirmedAt).toLocaleTimeString("es-CO")}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Establishment Info (for beneficiary) */}
      {isBeneficiary && pickup.establishment && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Establecimiento</Text>
          <View style={styles.card}>
            <Text style={styles.establishmentName}>
              {pickup.establishment.name}
            </Text>
            {pickup.establishment.address && (
              <TouchableOpacity style={styles.addressRow} onPress={openMaps}>
                <Text style={styles.addressIcon}>📍</Text>
                <Text style={styles.addressText}>
                  {pickup.establishment.address}
                </Text>
                <Text style={styles.addressAction}>Ver mapa →</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Beneficiary Info (for establishment) */}
      {isEstablishment && pickup.beneficiary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Beneficiario</Text>
          <View style={styles.card}>
            <Text style={styles.beneficiaryName}>
              {pickup.beneficiary.firstName} {pickup.beneficiary.lastName}
            </Text>
          </View>
        </View>
      )}

      {/* Notes del Beneficiario */}
      {pickup.beneficiaryNotes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notas del Beneficiario</Text>
          <View style={styles.card}>
            <Text style={styles.notesText}>{pickup.beneficiaryNotes}</Text>
          </View>
        </View>
      )}

      {/* Notes del Establecimiento */}
      {pickup.establishmentNotes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notas del Establecimiento</Text>
          <View style={styles.card}>
            <Text style={styles.notesText}>{pickup.establishmentNotes}</Text>
          </View>
        </View>
      )}

      {/* Cancellation Info */}
      {pickup.cancellationReason && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Motivo de Cancelación</Text>
          <View style={[styles.card, styles.cancellationCard]}>
            <Text style={styles.cancellationText}>
              {pickup.cancellationReason}
            </Text>
          </View>
        </View>
      )}

      {/* Timeline */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Historial</Text>
        <View style={styles.timeline}>
          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Solicitud creada</Text>
              <Text style={styles.timelineDate}>
                {new Date(pickup.createdAt).toLocaleString("es-CO")}
              </Text>
            </View>
          </View>
          {pickup.confirmedAt && (
            <View style={styles.timelineItem}>
              <View
                style={[styles.timelineDot, { backgroundColor: "#2196F3" }]}
              />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Recogida confirmada</Text>
                <Text style={styles.timelineDate}>
                  {new Date(pickup.confirmedAt).toLocaleString("es-CO")}
                </Text>
              </View>
            </View>
          )}
          {pickup.visitConfirmedAt && (
            <View style={styles.timelineItem}>
              <View
                style={[styles.timelineDot, { backgroundColor: "#9C27B0" }]}
              />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Visita confirmada</Text>
                <Text style={styles.timelineDate}>
                  {new Date(pickup.visitConfirmedAt).toLocaleString("es-CO")}
                </Text>
              </View>
            </View>
          )}
          {pickup.completedAt && (
            <View style={styles.timelineItem}>
              <View
                style={[styles.timelineDot, { backgroundColor: "#4CAF50" }]}
              />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Entrega completada</Text>
                <Text style={styles.timelineDate}>
                  {new Date(pickup.completedAt).toLocaleString("es-CO")}
                </Text>
              </View>
            </View>
          )}
          {pickup.cancelledAt && (
            <View style={styles.timelineItem}>
              <View
                style={[styles.timelineDot, { backgroundColor: "#F44336" }]}
              />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Cancelada</Text>
                <Text style={styles.timelineDate}>
                  {new Date(pickup.cancelledAt).toLocaleString("es-CO")}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        {/* Beneficiary Actions */}
        {isBeneficiary && canCancelPickup(pickup.status) && (
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={handleCancelPickup}
            disabled={processing}
          >
            {processing ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.cancelButtonText}>Cancelar Recogida</Text>
            )}
          </TouchableOpacity>
        )}

        {isBeneficiary && pickup.status === PickupStatus.CONFIRMED && (
          <TouchableOpacity
            style={[styles.actionButton, styles.visitButton]}
            onPress={handleConfirmVisit}
            disabled={processing}
          >
            {processing ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.visitButtonText}>He Llegado</Text>
            )}
          </TouchableOpacity>
        )}

        {/* Establishment Actions */}
        {isEstablishment && pickup.status === PickupStatus.PENDING && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={handleCancelPickup}
              disabled={processing}
            >
              <Text style={styles.rejectButtonText}>Rechazar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.confirmButton]}
              onPress={handleConfirmPickup}
              disabled={processing}
            >
              {processing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {isEstablishment && pickup.status === PickupStatus.CONFIRMED && (
          <View style={styles.waitingContainer}>
            <Text style={styles.waitingText}>
              ⏳ Esperando que el beneficiario confirme su llegada
            </Text>
          </View>
        )}

        {isEstablishment && pickup.status === PickupStatus.IN_PROGRESS && (
          <TouchableOpacity
            style={[styles.actionButton, styles.completeButton]}
            onPress={handleCompletePickup}
            disabled={processing}
          >
            {processing ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.completeButtonText}>Completar Entrega</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Cancel Modal */}
      <Modal
        visible={cancelModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCancelModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isEstablishment ? "Rechazar Solicitud" : "Cancelar Recogida"}
            </Text>
            <Text style={styles.modalDescription}>
              Por favor indica el motivo.
            </Text>
            <TextInput
              style={styles.modalInput}
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
                <Text style={styles.modalCancelButtonText}>Volver</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirmButton]}
                onPress={submitCancelPickup}
                disabled={processing}
              >
                {processing ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalConfirmButtonText}>Confirmar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Confirm Pickup Modal */}
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
              Ingresa la cantidad que confirmas para la recogida.
            </Text>
            <TextInput
              style={styles.modalInput}
              value={inputQuantity}
              onChangeText={setInputQuantity}
              placeholder="Cantidad"
              keyboardType="numeric"
            />
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
                disabled={processing}
              >
                {processing ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalConfirmButtonText}>Confirmar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Complete Pickup Modal */}
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
              Ingresa la cantidad de alimentos entregados.
            </Text>
            <TextInput
              style={styles.modalInput}
              value={inputQuantity}
              onChangeText={setInputQuantity}
              placeholder="Cantidad"
              keyboardType="numeric"
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
                disabled={processing}
              >
                {processing ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalConfirmButtonText}>Completar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
