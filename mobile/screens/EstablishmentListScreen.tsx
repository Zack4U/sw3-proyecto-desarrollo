import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import {
  establishmentService,
  EstablishmentResponse,
  getEstablishmentTypeLabel,
} from "../services/establishmentService";
import { styles as listStyles } from "../styles/EstablishmentListScreenStyle";
import { styles as mapStyles } from "../styles/EstablishmentMapScreenStyle";
import { FeedbackMessage, Card, Input } from "../components";

type RootStackParamList = {
  Home: undefined;
  EstablishmentList: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "EstablishmentList"
  >;
};

// Coordenadas de Bogotá como ubicación por defecto
const BOGOTA_COORDS = {
  latitude: 4.60971,
  longitude: -74.08175,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function EstablishmentListScreen({
  navigation,
}: Readonly<Props>) {
  const [establishments, setEstablishments] = useState<EstablishmentResponse[]>(
    []
  );
  const [total, setTotal] = useState(0);
  const [totalAvailable, setTotalAvailable] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Puedes ajustar el tamaño de página aquí
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [initialMapRegion, setInitialMapRegion] = useState(BOGOTA_COORDS);
  const [locationLoading, setLocationLoading] = useState(false);
  const [hasLoadedLocation, setHasLoadedLocation] = useState(false);

  useEffect(() => {
    setLoading(true);

    // En modo mapa, cargar todos sin paginación
    // En modo lista, usar paginación
    const filters = viewMode === "map" ? undefined : { page, limit };

    establishmentService
      .getWithAvailableFood(filters)
      .then((res) => {
        setEstablishments(res.establishments);
        setTotal(res.total);
        setTotalAvailable(res.totalAvailable);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [page, limit, viewMode]);

  // Obtener ubicación del usuario cuando se cambia a vista de mapa (solo la primera vez)
  useEffect(() => {
    if (viewMode === "map" && !hasLoadedLocation) {
      getUserLocation();
    }
  }, [viewMode, hasLoadedLocation]);

  const getUserLocation = async () => {
    try {
      setLocationLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        setInitialMapRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } else {
        // Si no hay permisos, usar Bogotá por defecto
        setInitialMapRegion(BOGOTA_COORDS);
      }
      setHasLoadedLocation(true);
    } catch (err) {
      console.error("Error obteniendo ubicación:", err);
      setInitialMapRegion(BOGOTA_COORDS);
      setHasLoadedLocation(true);
    } finally {
      setLocationLoading(false);
    }
  };

  const filteredEstablishments = establishments.filter((est) =>
    est.name.toLowerCase().includes(search.toLowerCase())
  );

  // Extraer coordenadas de los establecimientos para el mapa
  const getEstablishmentCoordinates = (
    establishment: EstablishmentResponse
  ) => {
    try {
      if (!establishment.location) {
        return null;
      }

      // Manejar diferentes formatos de location
      let coordinates;

      if (
        establishment.location.coordinates &&
        Array.isArray(establishment.location.coordinates)
      ) {
        coordinates = establishment.location.coordinates;
      } else if (typeof establishment.location === "string") {
        // Si location viene como string, parsearlo
        const parsed = JSON.parse(establishment.location);
        coordinates = parsed.coordinates;
      } else if (
        establishment.location.type === "Point" &&
        establishment.location.coordinates
      ) {
        // Formato GeoJSON
        coordinates = establishment.location.coordinates;
      } else {
        return null;
      }

      // Validar que tenemos coordenadas válidas
      if (!Array.isArray(coordinates) || coordinates.length < 2) {
        return null;
      }

      const [longitude, latitude] = coordinates;

      // Validar que sean números válidos
      if (
        typeof latitude !== "number" ||
        typeof longitude !== "number" ||
        isNaN(latitude) ||
        isNaN(longitude)
      ) {
        return null;
      }

      // Validar rangos de coordenadas válidas
      if (
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
      ) {
        return null;
      }

      return { latitude, longitude };
    } catch (err) {
      console.error(
        "Error parsing location for establishment:",
        establishment.name,
        err
      );
    }
    return null;
  };

  const renderToggleButtons = () => (
    <View style={mapStyles.toggleContainer}>
      <Pressable
        style={[
          mapStyles.toggleButton,
          viewMode === "list" && mapStyles.toggleButtonActive,
        ]}
        onPress={() => setViewMode("list")}
      >
        <Text
          style={[
            mapStyles.toggleButtonText,
            viewMode === "list" && mapStyles.toggleButtonTextActive,
          ]}
        >
          📋 Lista
        </Text>
      </Pressable>
      <Pressable
        style={[
          mapStyles.toggleButton,
          viewMode === "map" && mapStyles.toggleButtonActive,
        ]}
        onPress={() => setViewMode("map")}
      >
        <Text
          style={[
            mapStyles.toggleButtonText,
            viewMode === "map" && mapStyles.toggleButtonTextActive,
          ]}
        >
          🗺️ Mapa
        </Text>
      </Pressable>
    </View>
  );

  const renderHeader = useCallback(
    () => (
      <View>
        <View style={listStyles.filtersContainer}>
          <Input
            label="Buscar"
            labelStyle={listStyles.label}
            placeholder="Buscar por nombre..."
            value={search}
            onChangeText={setSearch}
            style={listStyles.input}
          />
        </View>

        {loading && (
          <FeedbackMessage
            type="loading"
            message="Cargando establecimientos..."
            visible={true}
          />
        )}

        {error && (
          <FeedbackMessage type="error" message={error} visible={true} />
        )}
      </View>
    ),
    [search, loading, error]
  );

  const renderFooter = useCallback(
    () => (
      <View>
        <View style={listStyles.paginationContainer}>
          <Text style={listStyles.paginationInfo}>
            Página {page} de {Math.ceil(total / limit) || 1}
          </Text>
        </View>
        <View style={listStyles.paginationContainer}>
          <Pressable
            style={[
              listStyles.paginationButton,
              page <= 1 && listStyles.paginationButtonDisabled,
            ]}
            onPress={() => page > 1 && setPage(page - 1)}
            disabled={page <= 1}
          >
            <Text style={listStyles.paginationText}>Anterior</Text>
          </Pressable>
          <Pressable
            style={[
              listStyles.paginationButton,
              page >= Math.ceil(total / limit) &&
                listStyles.paginationButtonDisabled,
            ]}
            onPress={() => page < Math.ceil(total / limit) && setPage(page + 1)}
            disabled={page >= Math.ceil(total / limit)}
          >
            <Text style={listStyles.paginationText}>Siguiente</Text>
          </Pressable>
        </View>
      </View>
    ),
    [page, total, limit]
  );

  const renderListView = () => (
    <FlatList
      data={filteredEstablishments}
      keyExtractor={(item) => item.establishmentId}
      renderItem={({ item }) => (
        <Card style={listStyles.card}>
          <Text style={{ fontSize: 28, marginBottom: 8 }}>🏢</Text>
          <Text style={listStyles.name}>{item.name}</Text>
          <Text style={listStyles.address}>{item.address}</Text>
          <Text style={listStyles.type}>
            {getEstablishmentTypeLabel(item.establishmentType)}
          </Text>
          {item.foodAvailable !== undefined && (
            <Text style={listStyles.foodAvailable}>
              🍽️ {item.foodAvailable} alimento
              {item.foodAvailable !== 1 ? "s" : ""} disponible
              {item.foodAvailable !== 1 ? "s" : ""}
            </Text>
          )}
          {!!(item.foodAvailable && item.foodAvailable > 0) && (
            <Pressable
              style={listStyles.viewFoodsButton}
              onPress={() =>
                navigation.navigate("AvailableFoodList" as any, {
                  establishmentId: item.establishmentId,
                })
              }
            >
              <Text style={listStyles.viewFoodsButtonText}>Ver Alimentos</Text>
            </Pressable>
          )}
          <View style={listStyles.divider} />
        </Card>
      )}
      contentContainerStyle={listStyles.list}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={
        loading ? null : (
          <View style={{ padding: 16 }}>
            <Text style={{ textAlign: "center", color: "#666" }}>
              No se encontraron establecimientos.
            </Text>
          </View>
        )
      }
    />
  );

  const renderMapView = () => {
  // Filtrar establecimientos con coordenadas válidas
  const establishmentsWithCoords = establishments.filter((est) => {
    const coords = getEstablishmentCoordinates(est);
    return coords !== null;
  });

  return (
    <View style={mapStyles.mapContainer}>
      {(loading || locationLoading) && (
        <View style={mapStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#3CA55C" />
          <Text style={mapStyles.loadingText}>
            {locationLoading ? "Obteniendo ubicación..." : "Cargando establecimientos..."}
          </Text>
        </View>
      )}

      {error && (
        <View style={mapStyles.errorContainer}>
          <Text style={mapStyles.errorText}>{String(error)}</Text>
        </View>
      )}

      <MapView
        style={mapStyles.map}
        initialRegion={initialMapRegion}
        showsUserLocation
        showsMyLocationButton
      >
        {establishmentsWithCoords.map((establishment) => {
          const coords = getEstablishmentCoordinates(establishment)!;

          return (
            <Marker
              key={`marker-${establishment.establishmentId}`}
              coordinate={coords}
              title={String(establishment.name ?? "")}
              description={String(establishment.address ?? "")}
              pinColor="#3CA55C"
              // ✅ Navega usando onCalloutPress del Marker (mejor en Android)
              onCalloutPress={() => {
                if (establishment.foodAvailable && establishment.foodAvailable > 0) {
                  navigation.navigate("AvailableFoodList" as any, {
                    establishmentId: establishment.establishmentId,
                  });
                }
              }}
            >
              {/* ✅ Claves: key única, tooltip y collapsable={false} en el root */}
              <Callout
                key={`callout-${establishment.establishmentId}`}
                tooltip
              >
                <View collapsable={false} style={mapStyles.markerCallout}>
                  <Text style={mapStyles.markerTitle}>
                    {String(establishment.name ?? "")}
                  </Text>
                  <Text style={mapStyles.markerAddress}>
                    {String(establishment.address ?? "")}
                  </Text>
                  <Text style={mapStyles.markerType}>
                    {String(getEstablishmentTypeLabel(establishment.establishmentType) ?? "")}
                  </Text>
                  {establishment.foodAvailable !== undefined && (
                    <Text style={mapStyles.markerFoodAvailable}>
                      {`🍽️ ${String(establishment.foodAvailable)} alimento${
                        establishment.foodAvailable !== 1 ? "s" : ""
                      } disponible${establishment.foodAvailable !== 1 ? "s" : ""}`}
                    </Text>
                  )}
                  {!!(establishment.foodAvailable && establishment.foodAvailable > 0) && (
                    <Text style={mapStyles.markerCallout}>
                      👉 Toca para ver alimentos
                    </Text>
                  )}
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
};


  return (
    <View style={mapStyles.container}>
      <View style={mapStyles.header}>
        <Text style={mapStyles.title}>Establecimientos Registrados</Text>
        <Text style={mapStyles.subtitle}>Puntos de donación</Text>
      </View>
      {renderToggleButtons()}
      {viewMode === "list" ? renderListView() : renderMapView()}
    </View>
  );
}
