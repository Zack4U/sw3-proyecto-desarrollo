import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../hooks/useAuth";
import { useRequestState } from "../hooks/useRequestState";
import {
  profileService,
  EstablishmentProfile,
  UserProfile,
} from "../services/profileService";
import { FeedbackMessage } from "../components";
import { styles } from "../styles/EditEstablishmentProfileScreenStyle";
import {
  getEstablishmentTypeOptions,
  getEstablishmentTypeLabel,
} from "../utils/establishmentTypeTranslations";

type RootStackParamList = {
  Home: undefined;
  EditEstablishmentProfile: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "EditEstablishmentProfile"
  >;
};

export default function EditEstablishmentProfileScreen({
  navigation,
}: Readonly<Props>) {
  const { user } = useAuth();
  const requestState = useRequestState();

  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [establishment, setEstablishment] =
    useState<EstablishmentProfile | null>(null);

  // Guardar datos originales para comparación
  const [originalData, setOriginalData] = useState({
    email: "",
    phone: "",
    username: "",
    documentNumber: "",
    name: "",
    description: "",
    address: "",
    neighborhood: "",
    establishmentType: "",
  });

  // Campos editables
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    username: "",
    documentNumber: "",
    name: "",
    description: "",
    address: "",
    neighborhood: "",
    establishmentType: "",
  });

  // Estado para el modal del picker
  const [showEstablishmentTypePicker, setShowEstablishmentTypePicker] =
    useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      console.log(
        "🔄 EditEstablishmentProfileScreen - loadProfile iniciando..."
      );
      setLoading(true);
      const data = await profileService.getUserProfile();
      console.log("📊 EditEstablishmentProfileScreen - Data recibida:", data);
      console.log("👤 User data:", data.user);
      console.log("🏪 Establishment data:", data.establishment);

      if (data.establishment) {
        console.log("✅ Establishment encontrado, preparando initialData...");
        const initialData = {
          email: data.user.email || "",
          phone: data.user.phone || "",
          username: data.user.username || "",
          documentNumber: data.user.documentNumber || "",
          name: data.establishment.name || "",
          description: data.establishment.description || "",
          address: data.establishment.address || "",
          neighborhood: data.establishment.neighborhood || "",
          establishmentType: data.establishment.establishmentType || "",
        };
        console.log("💾 initialData:", initialData);

        setUserProfile(data.user);
        setEstablishment(data.establishment);
        setFormData(initialData);
        setOriginalData(initialData);
        console.log("✅ Estados actualizados correctamente");
      } else {
        console.warn("⚠️ No establishment encontrado en la respuesta");
      }
      setLoading(false);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Error al cargar el perfil";
      console.error("❌ Error en loadProfile:", errorMsg);
      requestState.setError(errorMsg);
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (requestState.error || requestState.success) {
      requestState.reset();
    }
  };

  const hasChanges = (field: keyof typeof formData): boolean => {
    return formData[field] !== originalData[field];
  };

  const hasAnyChanges = (): boolean => {
    return Object.keys(formData).some((field) =>
      hasChanges(field as keyof typeof formData)
    );
  };

  const hasUserChanges = (): boolean => {
    return (
      hasChanges("email") ||
      hasChanges("phone") ||
      hasChanges("username") ||
      hasChanges("documentNumber")
    );
  };

  const hasEstablishmentChanges = (): boolean => {
    return (
      hasChanges("name") ||
      hasChanges("description") ||
      hasChanges("address") ||
      hasChanges("neighborhood") ||
      hasChanges("establishmentType")
    );
  };

  const validateForm = (): boolean => {
    if (!formData.email) {
      requestState.setError("El email es obligatorio");
      return false;
    }

    if (!formData.name) {
      requestState.setError("El nombre del establecimiento es obligatorio");
      return false;
    }

    if (!formData.address) {
      requestState.setError("La dirección es obligatoria");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      requestState.setError("Por favor ingresa un email válido");
      return false;
    }

    return true;
  };

  const handleSaveUserChanges = async () => {
    if (!formData.email) {
      requestState.setError("El email es obligatorio");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      requestState.setError("Por favor ingresa un email válido");
      return;
    }

    try {
      requestState.setLoading();

      const updateData: any = {
        email: formData.email,
      };

      // Solo agregar campos opcionales si tienen valor
      if (formData.phone) {
        updateData.phone = formData.phone;
      }
      if (formData.documentNumber) {
        updateData.documentNumber = formData.documentNumber;
      }

      console.log("📤 Enviando updateData (user):", updateData);
      await profileService.updateUserProfile(updateData);

      requestState.setSuccess();
      setTimeout(() => {
        const newOriginal = { ...originalData };
        newOriginal.email = formData.email;
        newOriginal.phone = formData.phone;
        newOriginal.documentNumber = formData.documentNumber;
        setOriginalData(newOriginal);
        requestState.reset();
      }, 1500);
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Error al actualizar el perfil";
      requestState.setError(errorMsg);
    }
  };

  const handleSaveEstablishmentChanges = async () => {
    if (!formData.name) {
      requestState.setError("El nombre del establecimiento es obligatorio");
      return;
    }

    if (!formData.address) {
      requestState.setError("La dirección es obligatoria");
      return;
    }

    try {
      requestState.setLoading();

      const updateData: any = {
        name: formData.name,
        address: formData.address,
      };

      // Solo agregar campos opcionales si tienen valor
      if (formData.description) {
        updateData.description = formData.description;
      }
      if (formData.neighborhood) {
        updateData.neighborhood = formData.neighborhood;
      }
      if (formData.establishmentType) {
        updateData.establishmentType = formData.establishmentType;
      }

      console.log("📤 Enviando updateData:", updateData);
      await profileService.updateEstablishmentProfile(updateData);

      requestState.setSuccess();
      setTimeout(() => {
        const newOriginal = { ...originalData };
        newOriginal.name = formData.name;
        newOriginal.description = formData.description;
        newOriginal.address = formData.address;
        newOriginal.neighborhood = formData.neighborhood;
        newOriginal.establishmentType = formData.establishmentType;
        setOriginalData(newOriginal);
        requestState.reset();
      }, 1500);
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Error al actualizar el perfil";
      requestState.setError(errorMsg);
    }
  };

  const handleCancel = () => {
    if (userProfile && establishment) {
      setFormData(originalData);
      requestState.reset();
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3CA55C" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Editar Perfil</Text>
          <Text style={styles.subtitle}>
            Actualiza la información de tu establecimiento
          </Text>
        </View>

        <FeedbackMessage
          type="error"
          message={requestState.error || ""}
          visible={!!requestState.error}
        />
        <FeedbackMessage
          type="success"
          message="Cambios guardados exitosamente"
          visible={requestState.success}
        />

        {/* Sección: Información del Usuario */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Información Personal</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={[
                styles.input,
                hasChanges("email") && styles.inputModified,
              ]}
              placeholder="correo@ejemplo.com"
              value={formData.email}
              onChangeText={(value) => handleInputChange("email", value)}
              keyboardType="email-address"
              editable={!requestState.loading}
            />
            {hasChanges("email") && (
              <Text style={styles.modifiedBadge}>● MODIFICADO</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              style={[
                styles.input,
                hasChanges("phone") && styles.inputModified,
              ]}
              placeholder="+34 912 345 678"
              value={formData.phone}
              onChangeText={(value) => handleInputChange("phone", value)}
              keyboardType="phone-pad"
              editable={!requestState.loading}
            />
            {hasChanges("phone") && (
              <Text style={styles.modifiedBadge}>● MODIFICADO</Text>
            )}
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Nombre de Usuario</Text>
              <TextInput
                style={[
                  styles.input,
                  hasChanges("username") && styles.inputModified,
                ]}
                placeholder="usuario"
                value={formData.username}
                onChangeText={(value) => handleInputChange("username", value)}
                editable={!requestState.loading}
              />
              {hasChanges("username") && (
                <Text style={styles.modifiedBadge}>● MOD.</Text>
              )}
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Documento</Text>
              <TextInput
                style={[
                  styles.input,
                  hasChanges("documentNumber") && styles.inputModified,
                ]}
                placeholder="123456789"
                value={formData.documentNumber}
                onChangeText={(value) =>
                  handleInputChange("documentNumber", value)
                }
                editable={!requestState.loading}
              />
              {hasChanges("documentNumber") && (
                <Text style={styles.modifiedBadge}>● MOD.</Text>
              )}
            </View>
          </View>

          {hasUserChanges() && (
            <TouchableOpacity
              style={[styles.sectionSaveButton]}
              onPress={handleSaveUserChanges}
              disabled={requestState.loading}
            >
              {requestState.loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.sectionSaveButtonText}>
                  💾 Guardar cambios
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Sección: Información del Establecimiento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            🏪 Información del Establecimiento
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre del Establecimiento *</Text>
            <TextInput
              style={[styles.input, hasChanges("name") && styles.inputModified]}
              placeholder="Ej: Panadería Central"
              value={formData.name}
              onChangeText={(value) => handleInputChange("name", value)}
              editable={!requestState.loading}
            />
            {hasChanges("name") && (
              <Text style={styles.modifiedBadge}>● MODIFICADO</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={[
                styles.input,
                styles.multilineInput,
                hasChanges("description") && styles.inputModified,
              ]}
              placeholder="Cuéntanos sobre tu establecimiento..."
              value={formData.description}
              onChangeText={(value) => handleInputChange("description", value)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!requestState.loading}
            />
            {hasChanges("description") && (
              <Text style={styles.modifiedBadge}>● MOD.</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Dirección *</Text>
            <TextInput
              style={[
                styles.input,
                hasChanges("address") && styles.inputModified,
              ]}
              placeholder="Calle Principal 123, Apartado 5"
              value={formData.address}
              onChangeText={(value) => handleInputChange("address", value)}
              editable={!requestState.loading}
            />
            {hasChanges("address") && (
              <Text style={styles.modifiedBadge}>● MODIFICADO</Text>
            )}
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Barrio/Zona</Text>
              <TextInput
                style={[
                  styles.input,
                  hasChanges("neighborhood") && styles.inputModified,
                ]}
                placeholder="Ej: Centro"
                value={formData.neighborhood}
                onChangeText={(value) =>
                  handleInputChange("neighborhood", value)
                }
                editable={!requestState.loading}
              />
              {hasChanges("neighborhood") && (
                <Text style={styles.modifiedBadge}>● MOD.</Text>
              )}
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Tipo de Establecimiento</Text>
              <TouchableOpacity
                style={[
                  styles.pickerButton,
                  hasChanges("establishmentType") &&
                    styles.pickerButtonModified,
                ]}
                onPress={() => setShowEstablishmentTypePicker(true)}
                disabled={requestState.loading}
              >
                <Text
                  style={[
                    styles.pickerButtonText,
                    !formData.establishmentType &&
                      styles.pickerButtonPlaceholder,
                  ]}
                >
                  {formData.establishmentType
                    ? getEstablishmentTypeLabel(formData.establishmentType)
                    : "Seleccionar tipo"}
                </Text>
                <Text style={styles.pickerArrow}>▼</Text>
              </TouchableOpacity>
              {hasChanges("establishmentType") && (
                <Text style={styles.modifiedBadge}>● MOD.</Text>
              )}
            </View>
          </View>

          {hasEstablishmentChanges() && (
            <TouchableOpacity
              style={[styles.sectionSaveButton]}
              onPress={handleSaveEstablishmentChanges}
              disabled={requestState.loading}
            >
              {requestState.loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.sectionSaveButtonText}>
                  💾 Guardar cambios
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Botones de Acción Eliminados - Los botones aparecer dentro de cada sección */}
        <View style={{ height: Spacing.xl }} />
      </ScrollView>

      {/* Modal para seleccionar tipo de establecimiento */}
      <Modal
        visible={showEstablishmentTypePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEstablishmentTypePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tipo de Establecimiento</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowEstablishmentTypePicker(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalOptions}>
              {getEstablishmentTypeOptions().map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.modalOption,
                    formData.establishmentType === option.value &&
                      styles.modalOptionSelected,
                  ]}
                  onPress={() => {
                    handleInputChange("establishmentType", option.value);
                    setShowEstablishmentTypePicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      formData.establishmentType === option.value &&
                        styles.modalOptionSelectedText,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

// Importar Spacing para el espaciado final
import { Spacing } from "../styles/global";
