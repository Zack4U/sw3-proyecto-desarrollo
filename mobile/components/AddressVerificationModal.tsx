import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Modal,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Colors, Spacing, FontSizes, BorderRadius } from "../styles/global";
import { addressVerificationService } from "../services/addressVerificationService";

interface AddressVerificationModalProps {
  visible: boolean;
  address: string;
  city: string;
  onConfirm: (data: {
    latitude: number;
    longitude: number;
    address: string;
    location: {
      type: "Point";
      coordinates: [number, number];
    };
  }) => void;
  onCancel: () => void;
}

export default function AddressVerificationModal({
  visible,
  address,
  city,
  onConfirm,
  onCancel,
}: AddressVerificationModalProps) {
  const mapRef = useRef<MapView>(null);
  const [loading, setLoading] = useState(false);
  const [markerPosition, setMarkerPosition] = useState({
    latitude: 4.711,
    longitude: -74.0721,
  });
  const [currentAddress, setCurrentAddress] = useState(address);

  // Geocodificar la dirección cuando se abre el modal
  useEffect(() => {
    if (visible && address && city) {
      setCurrentAddress(address);
      geocodeAddress();
    }
  }, [visible, address, city]);

  const geocodeAddress = async () => {
    setLoading(true);
    try {
      // Usar el servicio del backend para geocodificar
      const result = await addressVerificationService.verifyAddress(
        address,
        city
      );

      const newPosition = {
        latitude: result.latitude,
        longitude: result.longitude,
      };
      setMarkerPosition(newPosition);

      // Animar el mapa a la nueva ubicación
      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            ...newPosition,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          1000
        );
      }
    } catch (error: any) {
      console.error("Error geocoding address:", error);
      Alert.alert(
        "Dirección no encontrada",
        error.message ||
          "No se pudo encontrar la ubicación exacta. Por favor, ajusta el marcador manualmente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerDragStart = () => {
    // Opcional: puedes agregar feedback visual aquí
    console.log("Marker drag started");
  };

  const handleMarkerDrag = (e: any) => {
    // Actualizar la posición mientras se arrastra
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarkerPosition({ latitude, longitude });
  };

  const handleMarkerDragEnd = async (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarkerPosition({ latitude, longitude });

    // Obtener la dirección de las nuevas coordenadas
    try {
      setLoading(true);
      const result = await addressVerificationService.verifyCoordinates(
        latitude,
        longitude,
        address
      );
      setCurrentAddress(result.formattedAddress);
    } catch (error: any) {
      console.error("Error reverse geocoding:", error);
      // No mostrar alert aquí para no interrumpir la experiencia
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    onConfirm({
      latitude: markerPosition.latitude,
      longitude: markerPosition.longitude,
      address: currentAddress,
      location: {
        type: "Point",
        coordinates: [markerPosition.longitude, markerPosition.latitude],
      },
    });
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onCancel}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Verificar Ubicación</Text>
          <Text style={styles.subtitle}>
            Arrastra el marcador para ajustar la ubicación exacta
          </Text>
          {currentAddress && (
            <View style={styles.addressContainer}>
              <Text style={styles.addressLabel}>Dirección:</Text>
              <Text style={styles.addressText}>{currentAddress}</Text>
            </View>
          )}
        </View>

        {/* Map */}
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: markerPosition.latitude,
              longitude: markerPosition.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            scrollEnabled={!loading}
            zoomEnabled={!loading}
            rotateEnabled={false}
            pitchEnabled={false}
          >
            <Marker
              coordinate={markerPosition}
              draggable={!loading}
              onDragStart={handleMarkerDragStart}
              onDrag={handleMarkerDrag}
              onDragEnd={handleMarkerDragEnd}
              title="Tu ubicación"
              description="Arrastra para ajustar"
            />
          </MapView>
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Actualizando dirección...</Text>
            </View>
          )}
        </View>

        {/* Coordinates Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.coordinatesLabel}>Coordenadas:</Text>
          <Text style={styles.coordinatesText}>
            Lat: {markerPosition.latitude.toFixed(6)}, Lng:{" "}
            {markerPosition.longitude.toFixed(6)}
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.confirmButton]}
            onPress={handleConfirm}
            disabled={loading}
          >
            <Text style={styles.confirmButtonText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  addressContainer: {
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
  },
  addressLabel: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  addressText: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  map: {
    flex: 1,
  },
  loadingOverlay: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingText: {
    marginLeft: Spacing.md,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    fontWeight: "500",
  },
  infoContainer: {
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  coordinatesLabel: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  coordinatesText: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    fontFamily: "monospace",
  },
  buttonContainer: {
    flexDirection: "row",
    padding: Spacing.lg,
    gap: Spacing.md,
    backgroundColor: Colors.surface,
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    fontSize: FontSizes.md,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
  },
  confirmButtonText: {
    fontSize: FontSizes.md,
    fontWeight: "600",
    color: Colors.surface,
  },
});
