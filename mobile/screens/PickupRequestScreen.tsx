import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
  FlatList,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { styles } from "../styles/PickupRequestScreenStyle";
import { Button, FeedbackMessage } from "../components";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import {
  foodService,
  FoodResponse,
  getFoodCategoryLabel,
  getUnitOfMeasureLabel,
} from "../services/foodService";
import pickupService from "../services/pickupService";

type RootStackParamList = {
  PickupRequest: { foodId: string };
  PickupDetails: { pickupId: string };
  MyPickups: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "PickupRequest">;
  route: RouteProp<RootStackParamList, "PickupRequest">;
};

export default function PickupRequestScreen({
  navigation,
  route,
}: Readonly<Props>) {
  const { foodId } = route.params;
  const { user } = useAuth();
  const toast = useToast();

  // States
  const [food, setFood] = useState<FoodResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [quantity, setQuantity] = useState("");
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<{
    quantity?: string;
    scheduledDate?: string;
  }>({});

  // Load food data
  useEffect(() => {
    loadFood();
  }, [foodId]);

  const loadFood = async () => {
    try {
      setLoading(true);
      setError(null);
      const foodData = await foodService.getById(foodId);
      setFood(foodData);
      // Set default quantity to available
      setQuantity(foodData.quantity.toString());
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar el alimento";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { quantity?: string; scheduledDate?: string } = {};

    // Validate quantity
    const quantityNum = parseFloat(quantity);
    if (!quantity || isNaN(quantityNum)) {
      newErrors.quantity = "La cantidad es requerida";
    } else if (quantityNum <= 0) {
      newErrors.quantity = "La cantidad debe ser mayor a 0";
    } else if (food && quantityNum > food.quantity) {
      newErrors.quantity = `La cantidad no puede exceder ${food.quantity}`;
    }

    // Validate date
    if (!scheduledDate) {
      newErrors.scheduledDate = "La fecha y hora son requeridas";
    } else if (scheduledDate <= new Date()) {
      newErrors.scheduledDate = "La fecha debe ser futura";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !food) return;

    try {
      setSubmitting(true);
      setError(null);

      const pickup = await pickupService.create({
        foodId: food.foodId,
        requestedQuantity: parseFloat(quantity),
        scheduledDate: scheduledDate!.toISOString(),
        beneficiaryNotes: notes.trim() || undefined,
      });

      toast.success("Solicitud de recogida creada exitosamente");

      // Navigate to pickup details
      navigation.replace("PickupDetails", { pickupId: pickup.pickupId });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al crear la solicitud";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Generate available dates (next 7 days)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // Generate available hours (8am - 8pm)
  const getAvailableHours = () => {
    const hours = [];
    for (let h = 8; h <= 20; h++) {
      hours.push({ hour: h, display: `${h.toString().padStart(2, "0")}:00` });
      if (h < 20) {
        hours.push({
          hour: h + 0.5,
          display: `${h.toString().padStart(2, "0")}:30`,
        });
      }
    }
    return hours;
  };

  const handleDateSelect = (date: Date) => {
    const newDate = new Date(date);
    if (scheduledDate) {
      newDate.setHours(scheduledDate.getHours(), scheduledDate.getMinutes());
    } else {
      newDate.setHours(12, 0, 0, 0);
    }
    setScheduledDate(newDate);
    setShowDatePicker(false);
    // Show time picker after date selection
    setTimeout(() => setShowTimePicker(true), 300);
  };

  const handleTimeSelect = (hourValue: number) => {
    if (scheduledDate) {
      const newDate = new Date(scheduledDate);
      const hour = Math.floor(hourValue);
      const minutes = hourValue % 1 === 0.5 ? 30 : 0;
      newDate.setHours(hour, minutes, 0, 0);
      setScheduledDate(newDate);
    }
    setShowTimePicker(false);
  };

  const formatDateTime = (date: Date): string => {
    return date.toLocaleString("es-CO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateShort = (date: Date): string => {
    return date.toLocaleDateString("es-CO", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3CA55C" />
        <Text style={styles.loadingText}>Cargando información...</Text>
      </View>
    );
  }

  // Error state
  if (error && !food) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>❌</Text>
        <Text style={styles.loadingText}>{error}</Text>
        <Button
          title="Reintentar"
          onPress={loadFood}
          style={{ marginTop: 16 }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Solicitar Recogida</Text>
        <Text style={styles.headerSubtitle}>
          Completa los datos para reservar tu recogida
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Error message */}
        <FeedbackMessage type="error" message={error || ""} visible={!!error} />

        {/* Food Info Card */}
        {food && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alimento seleccionado</Text>
            <View style={styles.foodCard}>
              {food.imageUrl ? (
                <Image
                  source={{ uri: food.imageUrl }}
                  style={styles.foodImage}
                />
              ) : (
                <View style={styles.foodImagePlaceholder}>
                  <Text style={styles.foodImagePlaceholderText}>🍎</Text>
                </View>
              )}
              <Text style={styles.foodName}>{food.name}</Text>
              {food.description && (
                <Text style={styles.foodDescription}>{food.description}</Text>
              )}
              <View style={styles.foodMeta}>
                <View style={styles.foodMetaItem}>
                  <Text style={styles.foodMetaIcon}>📦</Text>
                  <Text style={styles.foodMetaText}>
                    {food.quantity} {getUnitOfMeasureLabel(food.unitOfMeasure)}
                  </Text>
                </View>
                {food.category && (
                  <View style={styles.foodMetaItem}>
                    <Text style={styles.foodMetaIcon}>🏷️</Text>
                    <Text style={styles.foodMetaText}>
                      {getFoodCategoryLabel(food.category)}
                    </Text>
                  </View>
                )}
                <View style={styles.foodMetaItem}>
                  <Text style={styles.foodMetaIcon}>📅</Text>
                  <Text style={styles.foodMetaText}>
                    Vence:{" "}
                    {new Date(food.expiresAt).toLocaleDateString("es-CO")}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos de la recogida</Text>
          <View style={styles.formCard}>
            {/* Quantity */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Cantidad a recoger <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.quantityContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.quantityInput,
                    errors.quantity && styles.inputError,
                  ]}
                  value={quantity}
                  onChangeText={(text) => {
                    setQuantity(text);
                    if (errors.quantity) {
                      setErrors((prev) => ({ ...prev, quantity: undefined }));
                    }
                  }}
                  keyboardType="numeric"
                  placeholder="Cantidad"
                  editable={!submitting}
                />
                <Text style={styles.label}>
                  {food ? getUnitOfMeasureLabel(food.unitOfMeasure) : ""}
                </Text>
              </View>
              {food && (
                <Text style={styles.quantityInfo}>
                  Disponible: {food.quantity}{" "}
                  {getUnitOfMeasureLabel(food.unitOfMeasure)}
                </Text>
              )}
              {errors.quantity && (
                <Text style={styles.errorText}>{errors.quantity}</Text>
              )}
            </View>

            {/* Date & Time */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Fecha y hora de recogida <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={[
                  styles.datePickerButton,
                  errors.scheduledDate && styles.inputError,
                ]}
                onPress={() => setShowDatePicker(true)}
                disabled={submitting}
              >
                {scheduledDate ? (
                  <Text style={styles.datePickerText}>
                    {formatDateTime(scheduledDate)}
                  </Text>
                ) : (
                  <Text style={styles.datePickerPlaceholder}>
                    Selecciona fecha y hora
                  </Text>
                )}
                <Text style={styles.datePickerIcon}>📅</Text>
              </TouchableOpacity>
              {errors.scheduledDate && (
                <Text style={styles.errorText}>{errors.scheduledDate}</Text>
              )}
            </View>

            {/* Notes */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notas adicionales</Text>
              <TextInput
                style={styles.textArea}
                value={notes}
                onChangeText={setNotes}
                placeholder="Ej: Llegaré a las 10am puntual"
                multiline
                numberOfLines={4}
                editable={!submitting}
              />
            </View>

            {/* Submit Button */}
            <Button
              title={submitting ? "Enviando..." : "Solicitar Recogida"}
              onPress={handleSubmit}
              disabled={submitting}
              loading={submitting}
              style={styles.submitButton}
            />
          </View>
        </View>
      </ScrollView>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona una fecha</Text>
            <FlatList
              data={getAvailableDates()}
              keyExtractor={(item) => item.toISOString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.dateOption,
                    scheduledDate?.toDateString() === item.toDateString() &&
                      styles.dateOptionSelected,
                  ]}
                  onPress={() => handleDateSelect(item)}
                >
                  <Text
                    style={[
                      styles.dateOptionText,
                      scheduledDate?.toDateString() === item.toDateString() &&
                        styles.dateOptionTextSelected,
                    ]}
                  >
                    {formatDateShort(item)}
                  </Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Time Picker Modal */}
      <Modal
        visible={showTimePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTimePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona una hora</Text>
            <FlatList
              data={getAvailableHours()}
              keyExtractor={(item) => item.display}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.dateOption,
                    scheduledDate &&
                      scheduledDate.getHours() === Math.floor(item.hour) &&
                      scheduledDate.getMinutes() ===
                        (item.hour % 1 === 0.5 ? 30 : 0) &&
                      styles.dateOptionSelected,
                  ]}
                  onPress={() => handleTimeSelect(item.hour)}
                >
                  <Text
                    style={[
                      styles.dateOptionText,
                      scheduledDate &&
                        scheduledDate.getHours() === Math.floor(item.hour) &&
                        scheduledDate.getMinutes() ===
                          (item.hour % 1 === 0.5 ? 30 : 0) &&
                        styles.dateOptionTextSelected,
                    ]}
                  >
                    {item.display}
                  </Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: 300 }}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowTimePicker(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
