import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  Image,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import {
  foodService,
  FoodResponse,
  getFoodCategoryLabel,
  getUnitOfMeasureLabel,
  FOOD_CATEGORIES,
} from "../services/foodService";
import {
  establishmentService,
  EstablishmentResponse,
} from "../services/establishmentService";
import { Card, Input, FeedbackMessage, Button } from "../components";
import { availableFoodListStyles } from "../styles/AvailableFoodListScreenStyle";
import { Picker } from "@react-native-picker/picker";

type RootStackParamList = {
  AvailableFoodList: { establishmentId?: string };
  BeneficiaryHome: undefined;
  PickupRequest: { foodId: string; establishmentId: string };
};

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "AvailableFoodList"
  >;
  route: RouteProp<RootStackParamList, "AvailableFoodList">;
};

export default function AvailableFoodListScreen({
  navigation,
  route,
}: Readonly<Props>) {
  const [foods, setFoods] = useState<FoodResponse[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<FoodResponse[]>([]);
  const [establishments, setEstablishments] = useState<
    Map<string, EstablishmentResponse>
  >(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [searchName, setSearchName] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterEstablishment, setFilterEstablishment] = useState<string>("");

  const { establishmentId } = route.params || {};

  // Cargar alimentos
  useEffect(() => {
    loadFoods();
  }, [establishmentId]);

  const loadFoods = async () => {
    try {
      setLoading(true);
      setError(null);

      let foodsData: FoodResponse[];

      // Si viene un establishmentId de los params, filtrar por ese establecimiento
      if (establishmentId) {
        foodsData = await foodService.getByEstablishment(establishmentId);
        setFilterEstablishment(establishmentId);
      } else {
        foodsData = await foodService.getAll();
      }

      // Filtrar solo alimentos disponibles
      const availableFoods = foodsData.filter(
        (food) => food.status === "AVAILABLE"
      );

      setFoods(availableFoods);
      setFilteredFoods(availableFoods);

      // Cargar información de establecimientos
      await loadEstablishments(availableFoods);
    } catch (err: any) {
      setError(err.message || "Error al cargar alimentos");
      console.error("Error loading foods:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadEstablishments = async (foodsList: FoodResponse[]) => {
    const establishmentIds = [
      ...new Set(foodsList.map((food) => food.establishmentId)),
    ];
    const establishmentsMap = new Map<string, EstablishmentResponse>();

    await Promise.all(
      establishmentIds.map(async (id) => {
        try {
          const establishment = await establishmentService.getById(id);
          establishmentsMap.set(id, establishment);
        } catch (err) {
          console.error(`Error loading establishment ${id}:`, err);
        }
      })
    );

    setEstablishments(establishmentsMap);
  };

  // Aplicar filtros
  useEffect(() => {
    applyFilters();
  }, [searchName, filterCategory, filterEstablishment, foods]);

  const applyFilters = () => {
    let filtered = [...foods];

    // Filtrar por nombre
    if (searchName.trim()) {
      filtered = filtered.filter((food) =>
        food.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (filterCategory && filterCategory !== "ALL") {
      filtered = filtered.filter((food) => food.category === filterCategory);
    }

    // Filtrar por establecimiento
    if (filterEstablishment && filterEstablishment !== "ALL") {
      filtered = filtered.filter(
        (food) => food.establishmentId === filterEstablishment
      );
    }

    setFilteredFoods(filtered);
  };

  const clearFilters = () => {
    setSearchName("");
    setFilterCategory("");
    setFilterEstablishment(establishmentId || "");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderFoodItem = ({ item }: { item: FoodResponse }) => {
    const establishment = establishments.get(item.establishmentId);
    const isExpiringSoon =
      new Date(item.expiresAt) < new Date(Date.now() + 24 * 60 * 60 * 1000);

    return (
      <Card style={availableFoodListStyles.foodCard}>
        {/* Imagen del alimento */}
        {item.imageUrl && (
          <Image
            source={{ uri: item.imageUrl }}
            style={availableFoodListStyles.foodImage}
            resizeMode="cover"
          />
        )}

        {/* Badge de estado si expira pronto */}
        {isExpiringSoon && (
          <View style={availableFoodListStyles.urgentBadge}>
            <Text style={availableFoodListStyles.urgentBadgeText}>
              ⚠️ Expira pronto
            </Text>
          </View>
        )}

        {/* Información del alimento */}
        <View style={availableFoodListStyles.foodInfo}>
          <Text style={availableFoodListStyles.foodName}>{item.name}</Text>

          {item.description && (
            <Text style={availableFoodListStyles.foodDescription}>
              {item.description}
            </Text>
          )}

          {/* Categoría */}
          <View style={availableFoodListStyles.infoRow}>
            <Text style={availableFoodListStyles.infoLabel}>🏷️ Categoría:</Text>
            <Text style={availableFoodListStyles.infoValue}>
              {getFoodCategoryLabel(item.category)}
            </Text>
          </View>

          {/* Cantidad */}
          <View style={availableFoodListStyles.infoRow}>
            <Text style={availableFoodListStyles.infoLabel}>📦 Cantidad:</Text>
            <Text style={availableFoodListStyles.infoValue}>
              {item.quantity} {getUnitOfMeasureLabel(item.unitOfMeasure)}
            </Text>
          </View>

          {/* Establecimiento */}
          <View style={availableFoodListStyles.infoRow}>
            <Text style={availableFoodListStyles.infoLabel}>📍 Ubicación:</Text>
            <Text style={availableFoodListStyles.infoValue}>
              {establishment?.name || "Cargando..."}
            </Text>
          </View>
          {establishment?.address && (
            <Text style={availableFoodListStyles.establishmentAddress}>
              {establishment.address}
              {establishment.neighborhood && `, ${establishment.neighborhood}`}
            </Text>
          )}

          {/* Fecha de expiración */}
          <View style={availableFoodListStyles.infoRow}>
            <Text style={availableFoodListStyles.infoLabel}>⏰ Expira:</Text>
            <Text
              style={[
                availableFoodListStyles.infoValue,
                isExpiringSoon && availableFoodListStyles.expiringText,
              ]}
            >
              {formatDate(item.expiresAt)}
            </Text>
          </View>

          {/* Botón de solicitar recogida */}
          <Pressable
            style={({ pressed }) => [
              availableFoodListStyles.requestButton,
              pressed && availableFoodListStyles.requestButtonPressed,
            ]}
            onPress={() =>
              navigation.navigate("PickupRequest", {
                foodId: item.foodId,
                establishmentId: item.establishmentId,
              })
            }
          >
            <Text style={availableFoodListStyles.requestButtonText}>
              📋 Solicitar Recogida
            </Text>
          </Pressable>
        </View>
      </Card>
    );
  };

  const renderFilters = () => (
    <View style={availableFoodListStyles.filtersContainer}>
      {/* Búsqueda por nombre */}
      <Input
        label="Buscar por nombre"
        placeholder="Ej: Pan, Frutas..."
        value={searchName}
        onChangeText={setSearchName}
        style={availableFoodListStyles.searchInput}
      />

      {/* Filtro por categoría */}
      {!establishmentId && (
        <View style={availableFoodListStyles.pickerContainer}>
          <Text style={availableFoodListStyles.pickerLabel}>
            Filtrar por categoría
          </Text>
          <Picker
            selectedValue={filterCategory}
            onValueChange={setFilterCategory}
            style={availableFoodListStyles.picker}
          >
            <Picker.Item label="Todas las categorías" value="ALL" />
            {FOOD_CATEGORIES.map((cat) => (
              <Picker.Item
                key={cat.value}
                label={cat.label}
                value={cat.value}
              />
            ))}
          </Picker>
        </View>
      )}

      {/* Filtro por establecimiento (solo si no viene de un establecimiento específico) */}
      {!establishmentId && establishments.size > 0 && (
        <View style={availableFoodListStyles.pickerContainer}>
          <Text style={availableFoodListStyles.pickerLabel}>
            Filtrar por establecimiento
          </Text>
          <Picker
            selectedValue={filterEstablishment}
            onValueChange={setFilterEstablishment}
            style={availableFoodListStyles.picker}
          >
            <Picker.Item label="Todos los establecimientos" value="ALL" />
            {Array.from(establishments.values()).map((est) => (
              <Picker.Item
                key={est.establishmentId}
                label={est.name}
                value={est.establishmentId}
              />
            ))}
          </Picker>
        </View>
      )}

      {/* Botón para limpiar filtros */}
      {(searchName ||
        filterCategory ||
        (filterEstablishment && !establishmentId)) && (
        <Button
          title="Limpiar filtros"
          onPress={clearFilters}
          variant="outline"
          style={availableFoodListStyles.clearButton}
        />
      )}
    </View>
  );

  const renderHeader = () => (
    <View>
      <View style={availableFoodListStyles.header}>
        <Text style={availableFoodListStyles.title}>
          {establishmentId
            ? "Alimentos del Establecimiento"
            : "Alimentos Disponibles"}
        </Text>
        <Text style={availableFoodListStyles.subtitle}>
          {filteredFoods.length} alimento{filteredFoods.length !== 1 ? "s" : ""}{" "}
          disponible{filteredFoods.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {renderFilters()}

      {loading && (
        <FeedbackMessage
          type="loading"
          message="Cargando alimentos disponibles..."
          visible={true}
        />
      )}

      {error && <FeedbackMessage type="error" message={error} visible={true} />}
    </View>
  );

  const renderEmpty = () => {
    if (loading) return null;

    return (
      <View style={availableFoodListStyles.emptyContainer}>
        <Text style={availableFoodListStyles.emptyIcon}>🍽️</Text>
        <Text style={availableFoodListStyles.emptyTitle}>
          No hay alimentos disponibles
        </Text>
        <Text style={availableFoodListStyles.emptyMessage}>
          {searchName || filterCategory || filterEstablishment
            ? "Intenta ajustar tus filtros de búsqueda"
            : "No se encontraron alimentos en este momento"}
        </Text>
        {(searchName || filterCategory || filterEstablishment) && (
          <Button
            title="Limpiar filtros"
            onPress={clearFilters}
            variant="primary"
            style={availableFoodListStyles.emptyButton}
          />
        )}
      </View>
    );
  };

  return (
    <View style={availableFoodListStyles.container}>
      <FlatList
        data={filteredFoods}
        keyExtractor={(item) => item.foodId}
        renderItem={renderFoodItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={availableFoodListStyles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
