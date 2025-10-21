import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { styles } from "../styles/HomeScreenStyle";
import { useAuth } from "../hooks/useAuth";
import { ProfileModal } from "../components";

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  RegisterOptions: undefined;
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
          <TouchableOpacity
            style={[styles.menuButton, styles.establishmentButton]}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.buttonIcon}>🔐</Text>
            <Text style={styles.buttonText}>Iniciar sesión</Text>
            <Text style={styles.buttonDescription}>
              Accede con tu correo y contraseña
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuButton, styles.beneficiaryButton]}
            onPress={() => navigation.navigate("RegisterOptions")}
          >
            <Text style={styles.buttonIcon}>📱</Text>
            <Text style={styles.buttonText}>Registrarse</Text>
            <Text style={styles.buttonDescription}>
              Crea una cuenta para comenzar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <ProfileModal
        visible={profileModalVisible}
        user={user}
        onClose={() => setProfileModalVisible(false)}
      />
    </View>
  );
}
