import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { useAuth } from "../hooks/useAuth";

type SplashScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

/**
 * Pantalla de splash: Valida la sesión del usuario al iniciar la app
 * Si hay sesión válida → navega a Home
 * Si no hay sesión → navega a Login
 */
export default function SplashScreen({
  navigation,
}: Readonly<SplashScreenProps>) {
  const { isInitializing, isAuthenticated } = useAuth();

  useEffect(() => {
    // Esperar a que se termine de validar la sesión
    if (!isInitializing) {
      if (isAuthenticated) {
        navigation.replace("Home");
      } else {
        navigation.replace("Login");
      }
    }
  }, [isInitializing, isAuthenticated, navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2e7d32" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
