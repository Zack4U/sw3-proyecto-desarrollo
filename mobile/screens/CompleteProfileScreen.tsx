import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Modal,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Button, Input, FeedbackMessage } from "../components";
import { useAuth } from "../hooks/useAuth";
import { CompleteProfileData } from "../types/auth.types";
import { locationService } from "../services/locationService";
import type {
  City as CityType,
  Department as DepartmentType,
} from "../services/locationService";

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
};

type CompleteProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

interface FormErrors {
  name?: string;
  lastName?: string;
  address?: string;
  cityId?: string;
  documentNumber?: string;
  [key: string]: string | undefined;
}

// Constantes para tipos de documento
const DOCUMENT_TYPES = [
  { label: "Cédula de Ciudadanía", value: "CC" },
  { label: "Tarjeta de Identidad", value: "TI" },
  { label: "Cédula de Extranjería", value: "CE" },
  { label: "Registro Civil", value: "RC" },
  { label: "Pasaporte", value: "PAS" },
  { label: "Permiso de Permanencia", value: "PPT" },
  { label: "NIT", value: "NIT" },
];

// Constantes para tipos de establecimiento
const ESTABLISHMENT_TYPES = [
  { label: "Banco de Alimentos", value: "FOOD_BANK" },
  { label: "Restaurante", value: "RESTAURANT" },
  { label: "Supermercado", value: "SUPERMARKET" },
  { label: "Tienda de Abarrotes", value: "GROCERY_STORE" },
  { label: "Cafetería", value: "CAFETERIA" },
  { label: "Panadería", value: "BAKERY" },
  { label: "Hotel", value: "HOTEL" },
  { label: "Empresa Catering", value: "CATERING" },
  { label: "Otro", value: "OTHER" },
];

// Códigos de país comunes para teléfono
const COUNTRY_CODES = [
  { label: "🇨🇴 Colombia (+57)", value: "+57" },
  { label: "🇲🇽 México (+52)", value: "+52" },
  { label: "🇦🇷 Argentina (+54)", value: "+54" },
  { label: "🇧🇷 Brasil (+55)", value: "+55" },
  { label: "🇨🇱 Chile (+56)", value: "+56" },
  { label: "🇵🇪 Perú (+51)", value: "+51" },
  { label: "🇪🇨 Ecuador (+593)", value: "+593" },
  { label: "🇻🇪 Venezuela (+58)", value: "+58" },
  { label: "🇪🇸 España (+34)", value: "+34" },
];

/**
 * Pantalla de 2 pasos para completar el perfil después de Google login
 * Paso 1: Seleccionar rol (BENEFICIARIO o ESTABLECIMIENTO)
 * Paso 2: Completar formulario según el rol seleccionado
 */
export default function CompleteProfileScreen({
  navigation,
}: Readonly<CompleteProfileScreenProps>) {
  // Estados principales
  const [step, setStep] = useState<1 | 2>(1);
  const [userRole, setUserRole] = useState<
    "BENEFICIARY" | "ESTABLISHMENT" | null
  >(null);

  // Datos del formulario
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryCode, setCountryCode] = useState("+57"); // Colombia por defecto
  const [phone, setPhone] = useState("");
  const [documentType, setDocumentType] = useState("CC");
  const [documentNumber, setDocumentNumber] = useState("");
  const [address, setAddress] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [selectedCityId, setSelectedCityId] = useState("");
  const [description, setDescription] = useState("");
  const [establishmentType, setEstablishmentType] = useState("FOOD_BANK");

  // Estados de UI
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showCityModal, setShowCityModal] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [showDocumentTypeModal, setShowDocumentTypeModal] = useState(false);
  const [showEstablishmentTypeModal, setShowEstablishmentTypeModal] =
    useState(false);
  const [showCountryCodeModal, setShowCountryCodeModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<DepartmentType | null>(null);
  const [cities, setCities] = useState<CityType[]>([]);
  const [departments, setDepartments] = useState<DepartmentType[]>([]);
  const [selectedCityName, setSelectedCityName] = useState("");
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  // Context
  const { completeGoogleProfile, isLoading, error, clearError } = useAuth();

  // Cargar departamentos al montar
  useEffect(() => {
    loadDepartments();
  }, []);

  // Cargar departamentos
  const loadDepartments = async () => {
    try {
      setLoadingDepartments(true);
      const data = await locationService.getDepartments();
      setDepartments(data);
    } catch (err) {
      console.error("Error loading departments:", err);
    } finally {
      setLoadingDepartments(false);
    }
  };

  // Cargar ciudades de un departamento
  const loadCitiesByDepartment = async (department: DepartmentType) => {
    try {
      setLoadingCities(true);
      setSelectedDepartment(department);
      const data = await locationService.getCitiesByDepartment(
        department.departmentId
      );
      setCities(data);
    } catch (err) {
      console.error("Error loading cities:", err);
    } finally {
      setLoadingCities(false);
    }
  };

  // Validar formulario
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!name.trim()) {
      errors.name = "El nombre es requerido";
    }

    if (userRole === "BENEFICIARY") {
      if (!lastName.trim()) {
        errors.lastName = "El apellido es requerido";
      }
    }

    if (userRole === "ESTABLISHMENT") {
      if (!address.trim()) {
        errors.address = "La dirección es requerida";
      }
      if (!selectedCityId) {
        errors.cityId = "La ciudad es requerida";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Manejar siguiente paso
  const handleNextStep = () => {
    if (step === 1 && !userRole) {
      setFormErrors({ name: "Por favor selecciona un rol" });
      return;
    }
    setStep(2);
    setFormErrors({});
  };

  // Manejar paso anterior
  const handlePreviousStep = () => {
    setStep(1);
    setFormErrors({});
    clearError();
  };

  // Manejar completar perfil
  const handleCompleteProfile = async () => {
    if (!validateForm()) {
      return;
    }

    if (!userRole) {
      return;
    }

    try {
      const fullPhone = phone ? `${countryCode} ${phone}` : undefined;

      const profileData: CompleteProfileData =
        userRole === "BENEFICIARY"
          ? {
              role: "BENEFICIARY",
              username: username || name.split(" ")[0],
              name,
              lastName,
              phone: fullPhone,
              documentType: documentType || undefined,
              documentNumber: documentNumber || undefined,
            }
          : {
              role: "ESTABLISHMENT",
              username: username || name,
              name,
              phone: fullPhone,
              documentNumber: documentNumber || undefined,
              address,
              neighborhood: neighborhood || undefined,
              cityId: selectedCityId,
              description: description || undefined,
              establishmentType: establishmentType || undefined,
            };

      await completeGoogleProfile(profileData);
      navigation.replace("Home");
    } catch (err) {
      console.error("Error completing profile:", err);
    }
  };

  // Seleccionar ciudad
  const handleSelectCity = (city: CityType) => {
    setSelectedCityId(city.cityId);
    setSelectedCityName(city.name);
    setShowCityModal(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingVertical: 30,
        }}
      >
        {/* Indicador de paso */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 30,
            gap: 8,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: step >= 1 ? "#4CAF50" : "#ddd",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
              1
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              height: 2,
              backgroundColor: step >= 2 ? "#4CAF50" : "#ddd",
              marginTop: 19,
            }}
          />
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: step >= 2 ? "#4CAF50" : "#ddd",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
              2
            </Text>
          </View>
        </View>

        {/* PASO 1: Seleccionar rol */}
        {step === 1 && (
          <View>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              Tipo de Usuario
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#666",
                marginBottom: 30,
                textAlign: "center",
              }}
            >
              Selecciona el tipo de usuario que eres
            </Text>

            {formErrors.name && (
              <FeedbackMessage
                type="error"
                message={formErrors.name}
                visible={true}
              />
            )}

            {/* Botón Beneficiario */}
            <TouchableOpacity
              onPress={() => setUserRole("BENEFICIARY")}
              style={{
                borderWidth: 2,
                borderColor: userRole === "BENEFICIARY" ? "#4CAF50" : "#ddd",
                borderRadius: 10,
                padding: 20,
                marginBottom: 15,
                backgroundColor:
                  userRole === "BENEFICIARY" ? "#E8F5E9" : "#f9f9f9",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: userRole === "BENEFICIARY" ? "#4CAF50" : "#333",
                  marginBottom: 8,
                }}
              >
                👤 Beneficiario
              </Text>
              <Text style={{ fontSize: 14, color: "#666" }}>
                Soy una persona que busca recibir alimentos donados
              </Text>
            </TouchableOpacity>

            {/* Botón Establecimiento */}
            <TouchableOpacity
              onPress={() => setUserRole("ESTABLISHMENT")}
              style={{
                borderWidth: 2,
                borderColor: userRole === "ESTABLISHMENT" ? "#4CAF50" : "#ddd",
                borderRadius: 10,
                padding: 20,
                marginBottom: 30,
                backgroundColor:
                  userRole === "ESTABLISHMENT" ? "#E8F5E9" : "#f9f9f9",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: userRole === "ESTABLISHMENT" ? "#4CAF50" : "#333",
                  marginBottom: 8,
                }}
              >
                🏪 Establecimiento
              </Text>
              <Text style={{ fontSize: 14, color: "#666" }}>
                Represento un establecimiento que puede donar alimentos
              </Text>
            </TouchableOpacity>

            {/* Botón Siguiente */}
            <Button
              title="Siguiente"
              onPress={handleNextStep}
              disabled={!userRole || isLoading}
              variant="primary"
            />
          </View>
        )}

        {/* PASO 2: Completar formulario */}
        {step === 2 && (
          <View>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              Completa tu Perfil
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#666",
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              {userRole === "BENEFICIARY"
                ? "Información del Beneficiario"
                : "Información del Establecimiento"}
            </Text>

            {error && (
              <FeedbackMessage type="error" message={error} visible={true} />
            )}

            {/* Username (opcional) */}
            <Input
              label="Usuario (opcional)"
              placeholder="Usuario (opcional)"
              value={username}
              onChangeText={setUsername}
              editable={!isLoading}
              style={{ marginBottom: 15 }}
            />

            {/* Nombre */}
            <Input
              label={
                userRole === "BENEFICIARY"
                  ? "Nombre *"
                  : "Nombre del Establecimiento *"
              }
              placeholder={
                userRole === "BENEFICIARY"
                  ? "Nombre *"
                  : "Nombre del Establecimiento *"
              }
              value={name}
              onChangeText={setName}
              editable={!isLoading}
              error={formErrors.name}
              style={{ marginBottom: formErrors.name ? 0 : 15 }}
            />
            {formErrors.name && (
              <Text style={{ color: "#f44336", marginBottom: 15 }}>
                {formErrors.name}
              </Text>
            )}

            {/* Apellido (solo beneficiario) */}
            {userRole === "BENEFICIARY" && (
              <>
                <Input
                  label="Apellido *"
                  placeholder="Apellido *"
                  value={lastName}
                  onChangeText={setLastName}
                  editable={!isLoading}
                  error={formErrors.lastName}
                  style={{ marginBottom: formErrors.lastName ? 0 : 15 }}
                />
                {formErrors.lastName && (
                  <Text style={{ color: "#f44336", marginBottom: 15 }}>
                    {formErrors.lastName}
                  </Text>
                )}
              </>
            )}

            {/* Teléfono con código de país */}
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 15 }}>
              <View style={{ flex: 0.7 }}>
                <TouchableOpacity
                  onPress={() => setShowCountryCodeModal(true)}
                  disabled={isLoading}
                  style={{
                    borderWidth: 1,
                    borderColor: "#ddd",
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    paddingVertical: 12,
                    backgroundColor: "#f9f9f9",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 14, color: "#333" }}>
                    {countryCode}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1.3 }}>
                <Input
                  label="Teléfono"
                  placeholder="Número"
                  value={phone}
                  onChangeText={setPhone}
                  editable={!isLoading}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Documento (solo beneficiario) */}
            {userRole === "BENEFICIARY" && (
              <>
                <View
                  style={{ flexDirection: "row", gap: 10, marginBottom: 15 }}
                >
                  <View style={{ flex: 1 }}>
                    <TouchableOpacity
                      style={{
                        borderWidth: 1,
                        borderColor: "#ddd",
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 12,
                        backgroundColor: "#f9f9f9",
                        justifyContent: "center",
                      }}
                      onPress={() => setShowDocumentTypeModal(true)}
                      disabled={isLoading}
                    >
                      <Text style={{ color: "#333", fontSize: 13 }}>
                        {DOCUMENT_TYPES.find((d) => d.value === documentType)
                          ?.label || documentType}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ flex: 1.5 }}>
                    <Input
                      label="Documento"
                      placeholder="Número documento"
                      value={documentNumber}
                      onChangeText={setDocumentNumber}
                      editable={!isLoading}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </>
            )}

            {/* Dirección (solo establecimiento) */}
            {userRole === "ESTABLISHMENT" && (
              <>
                <Input
                  label="Dirección *"
                  placeholder="Dirección *"
                  value={address}
                  onChangeText={setAddress}
                  editable={!isLoading}
                  error={formErrors.address}
                  style={{ marginBottom: formErrors.address ? 0 : 15 }}
                />
                {formErrors.address && (
                  <Text style={{ color: "#f44336", marginBottom: 15 }}>
                    {formErrors.address}
                  </Text>
                )}

                <Input
                  label="Barrio (opcional)"
                  placeholder="Barrio (opcional)"
                  value={neighborhood}
                  onChangeText={setNeighborhood}
                  editable={!isLoading}
                  style={{ marginBottom: 15 }}
                />

                {/* Ciudad (solo establecimiento) */}
                <TouchableOpacity
                  onPress={() => setShowDepartmentModal(true)}
                  disabled={isLoading}
                  style={{
                    borderWidth: 1,
                    borderColor: formErrors.cityId ? "#f44336" : "#ddd",
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    backgroundColor: "#f9f9f9",
                    marginBottom: formErrors.cityId ? 0 : 15,
                  }}
                >
                  <Text style={{ color: selectedCityId ? "#333" : "#999" }}>
                    {selectedCityName || "Selecciona una ciudad *"}
                  </Text>
                </TouchableOpacity>
                {formErrors.cityId && (
                  <Text style={{ color: "#f44336", marginBottom: 15 }}>
                    {formErrors.cityId}
                  </Text>
                )}

                {/* Tipo de Establecimiento */}
                <TouchableOpacity
                  onPress={() => setShowEstablishmentTypeModal(true)}
                  disabled={isLoading}
                  style={{
                    borderWidth: 1,
                    borderColor: "#ddd",
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    backgroundColor: "#f9f9f9",
                    marginBottom: 15,
                  }}
                >
                  <Text style={{ color: "#666", fontSize: 12 }}>
                    Tipo de Establecimiento (opcional)
                  </Text>
                  <Text style={{ color: "#333", fontSize: 14, marginTop: 4 }}>
                    {ESTABLISHMENT_TYPES.find(
                      (e) => e.value === establishmentType
                    )?.label || establishmentType}
                  </Text>
                </TouchableOpacity>

                <Input
                  label="Descripción (opcional)"
                  placeholder="Descripción (opcional)"
                  value={description}
                  onChangeText={setDescription}
                  editable={!isLoading}
                  multiline
                  numberOfLines={3}
                  style={{ marginBottom: 15, textAlignVertical: "top" }}
                />

                <Input
                  label="Número de documento (opcional)"
                  placeholder="Número de documento (opcional)"
                  value={documentNumber}
                  onChangeText={setDocumentNumber}
                  editable={!isLoading}
                  keyboardType="numeric"
                  style={{ marginBottom: 15 }}
                />
              </>
            )}

            {/* Botones de acción */}
            <View style={{ gap: 10, marginTop: 20 }}>
              <Button
                title={isLoading ? "Guardando..." : "Completar Perfil"}
                onPress={handleCompleteProfile}
                disabled={isLoading}
                variant="primary"
              />
              <Button
                title="Atrás"
                onPress={handlePreviousStep}
                disabled={isLoading}
                variant="secondary"
              />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Modal: Seleccionar Departamento */}
      <Modal visible={showDepartmentModal} transparent animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View
            style={{
              flex: 1,
              backgroundColor: "#fff",
              marginTop: 100,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: "#eee",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Selecciona un Departamento
              </Text>
            </View>

            {loadingDepartments ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator size="large" color="#4CAF50" />
              </View>
            ) : (
              <FlatList
                data={departments}
                keyExtractor={(item) => item.departmentId}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      loadCitiesByDepartment(item);
                      setShowDepartmentModal(false);
                      setShowCityModal(true);
                    }}
                    style={{
                      paddingHorizontal: 20,
                      paddingVertical: 15,
                      borderBottomWidth: 1,
                      borderBottomColor: "#eee",
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            )}

            <View style={{ padding: 20 }}>
              <Button
                title="Cancelar"
                onPress={() => setShowDepartmentModal(false)}
                variant="secondary"
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Modal: Seleccionar Ciudad */}
      <Modal visible={showCityModal} transparent animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View
            style={{
              flex: 1,
              backgroundColor: "#fff",
              marginTop: 100,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: "#eee",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                {selectedDepartment?.name
                  ? `Ciudades de ${selectedDepartment.name}`
                  : "Selecciona una Ciudad"}
              </Text>
            </View>

            {loadingCities ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator size="large" color="#4CAF50" />
              </View>
            ) : (
              <FlatList
                data={cities}
                keyExtractor={(item) => item.cityId}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSelectCity(item)}
                    style={{
                      paddingHorizontal: 20,
                      paddingVertical: 15,
                      borderBottomWidth: 1,
                      borderBottomColor: "#eee",
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            )}

            <View style={{ padding: 20, gap: 10 }}>
              <Button
                title="Cancelar"
                onPress={() => {
                  setShowCityModal(false);
                  setShowDepartmentModal(true);
                }}
                variant="secondary"
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Modal: Seleccionar Tipo de Documento */}
      <Modal visible={showDocumentTypeModal} transparent animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View
            style={{
              flex: 1,
              backgroundColor: "#fff",
              marginTop: 100,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: "#eee",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Tipo de Documento
              </Text>
            </View>

            <FlatList
              data={DOCUMENT_TYPES}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setDocumentType(item.value);
                    setShowDocumentTypeModal(false);
                  }}
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 15,
                    borderBottomWidth: 1,
                    borderBottomColor: "#eee",
                    backgroundColor:
                      documentType === item.value ? "#E8F5E9" : "#fff",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: documentType === item.value ? "#4CAF50" : "#333",
                      fontWeight: documentType === item.value ? "600" : "400",
                    }}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <View style={{ padding: 20 }}>
              <Button
                title="Cancelar"
                onPress={() => setShowDocumentTypeModal(false)}
                variant="secondary"
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Modal: Seleccionar Código de País */}
      <Modal visible={showCountryCodeModal} transparent animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View
            style={{
              flex: 1,
              backgroundColor: "#fff",
              marginTop: 100,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: "#eee",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Código de País
              </Text>
            </View>

            <FlatList
              data={COUNTRY_CODES}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setCountryCode(item.value);
                    setShowCountryCodeModal(false);
                  }}
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 15,
                    borderBottomWidth: 1,
                    borderBottomColor: "#eee",
                    backgroundColor:
                      countryCode === item.value ? "#E8F5E9" : "#fff",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: countryCode === item.value ? "#4CAF50" : "#333",
                      fontWeight: countryCode === item.value ? "600" : "400",
                    }}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <View style={{ padding: 20 }}>
              <Button
                title="Cancelar"
                onPress={() => setShowCountryCodeModal(false)}
                variant="secondary"
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Modal: Seleccionar Tipo de Establecimiento */}
      <Modal
        visible={showEstablishmentTypeModal}
        transparent
        animationType="slide"
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View
            style={{
              flex: 1,
              backgroundColor: "#fff",
              marginTop: 100,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: "#eee",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Tipo de Establecimiento
              </Text>
            </View>

            <FlatList
              data={ESTABLISHMENT_TYPES}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setEstablishmentType(item.value);
                    setShowEstablishmentTypeModal(false);
                  }}
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 15,
                    borderBottomWidth: 1,
                    borderBottomColor: "#eee",
                    backgroundColor:
                      establishmentType === item.value ? "#E8F5E9" : "#fff",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color:
                        establishmentType === item.value ? "#4CAF50" : "#333",
                      fontWeight:
                        establishmentType === item.value ? "600" : "400",
                    }}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <View style={{ padding: 20 }}>
              <Button
                title="Cancelar"
                onPress={() => setShowEstablishmentTypeModal(false)}
                variant="secondary"
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
