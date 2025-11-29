import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { styles } from "../styles/HomeScreenStyle";
import { useAuth } from "../hooks/useAuth";
import { ProfileModal } from "../components";

type RootStackParamList = {
  Home: undefined;
  FoodRegistration: undefined;
  FoodManagement: undefined;
  EditEstablishmentProfile: undefined;
  PickupManagement: undefined;
};

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

export default function HomeScreen({ navigation }: Readonly<HomeScreenProps>) {
  const { logout, user, isLoading } = useAuth();
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ComiYa</Text>
        <View style={styles.headerButtonsContainer}>
          {user && (
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => setProfileModalVisible(true)}
            >
              <Text style={styles.profileButtonText}>👤</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            disabled={isLoading}
          >
            <Text style={styles.logoutButtonText}>🚪 Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.subtitle}>
          ¡Bienvenido! Reduce el desperdicio de alimentos con nosotros.
        </Text>
        <View style={styles.menuContainer}>
          {user?.role === "ESTABLISHMENT" && (
            <TouchableOpacity
              style={[styles.menuButton, styles.establishmentButton]}
              onPress={() => navigation.navigate("FoodRegistration")}
            >
              <Text style={styles.buttonIcon}>🍎</Text>
              <Text style={styles.buttonText}>Registrar alimento</Text>
              <Text style={styles.buttonDescription}>
                Publica alimentos disponibles para la comunidad
              </Text>
            </TouchableOpacity>
          )}
          {user?.role === "ESTABLISHMENT" && (
            <TouchableOpacity
              style={[
                styles.menuButton,
                styles.establishmentButton,
                { marginTop: 12 },
              ]}
              onPress={() => navigation.navigate("FoodManagement")}
            >
              <Text style={styles.buttonIcon}>✏️</Text>
              <Text style={styles.buttonText}>Editar alimento</Text>
              <Text style={styles.buttonDescription}>
                Actualiza o elimina alimentos ya registrados
              </Text>
            </TouchableOpacity>
          )}
          {user?.role === "ESTABLISHMENT" && (
            <TouchableOpacity
              style={[
                styles.menuButton,
                styles.establishmentButton,
                { marginTop: 12 },
              ]}
              onPress={() => navigation.navigate("PickupManagement")}
            >
              <Text style={styles.buttonIcon}>📋</Text>
              <Text style={styles.buttonText}>Gestión de Recogidas</Text>
              <Text style={styles.buttonDescription}>
                Administra las solicitudes de recogida
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <ProfileModal
        visible={profileModalVisible}
        user={user}
        onClose={() => setProfileModalVisible(false)}
        onEditProfile={() => navigation.navigate("EditEstablishmentProfile")}
      />
    </View>
  );
}
