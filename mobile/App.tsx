import { StatusBar } from "expo-status-bar";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { useAuth } from "./hooks/useAuth";
import { setNavigationCallback } from "./hooks/useNotifications";
import { useEffect } from "react";

// ─── Screens ─────────────────────────────────────────────
import HomeScreen from "./screens/HomeScreen";
import BeneficiaryHomeScreen from "./screens/BeneficiaryHomeScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import LoginScreen from "./screens/LoginScreen";
import BasicRegistrationScreen from "./screens/BasicRegistrationScreen";
import RegisterOptionsScreen from "./screens/RegisterOptionsScreen";
import EstablishmentRegistrationScreen from "./screens/EstablishmentRegistrationScreen";
import BeneficiaryRegistrationScreen from "./screens/BeneficiaryRegistrationScreen";
import FoodRegistrationScreen from "./screens/FoodRegistrationScreen";
import FoodManagementScreen from "./screens/FoodManagementScreen";
import FoodEditScreen from "./screens/FoodEditScreen";
import EstablishmentListScreen from "./screens/EstablishmentListScreen";
import AvailableFoodListScreen from "./screens/AvailableFoodListScreen";
import SplashScreen from "./screens/SplashScreen";
import CompleteProfileScreen from "./screens/CompleteProfileScreen";
import EditEstablishmentProfileScreen from "./screens/EditEstablishmentProfileScreen";
import EditBeneficiaryProfileScreen from "./screens/EditBeneficiaryProfileScreen";
import SearchEstablishmentsScreen from "./screens/SearchEstablishmentsScreen";

// ─── Pickup Screens ──────────────────────────────────────
import PickupRequestScreen from "./screens/PickupRequestScreen";
import MyPickupsScreen from "./screens/MyPickupsScreen";
import PickupManagementScreen from "./screens/PickupManagementScreen";
import PickupDetailsScreen from "./screens/PickupDetailsScreen";

// ─── Notifications Screen ────────────────────────────────
import NotificationsScreen from "./screens/NotificationsScreen";

// ─── Tipado de Rutas ─────────────────────────────────────
export type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
  BeneficiaryHome: undefined;
  Login: undefined;
  BasicRegistration: undefined;
  RegisterOptions: undefined;
  EstablishmentRegistration: undefined;
  BeneficiaryRegistration: undefined;
  FoodRegistration: undefined;
  FoodManagement: undefined;
  FoodEdit: { foodId: string };
  EstablishmentList: undefined;
  AvailableFoodList: { establishmentId?: string };
  CompleteProfile: undefined;
  EditEstablishmentProfile: undefined;
  EditBeneficiaryProfile: undefined;
  SearchEstablishments: undefined;
  // Pickup Routes
  PickupRequest: { foodId: string; establishmentId: string };
  MyPickups: undefined;
  PickupManagement: undefined;
  PickupDetails: { pickupId: string };
  // Notifications
  Notifications: undefined;
};

// ─── Creación del Stack ──────────────────────────────────
const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * 📱 RootNavigator: controla qué pantallas mostrar
 * dependiendo de si el usuario está autenticado o no.
 */
function RootNavigator() {
  const { isAuthenticated, isInitializing, user } = useAuth();

  // Calcular initialRouteName dinámicamente según el estado del usuario
  let initialRouteName: keyof RootStackParamList = "Welcome";
  if (isAuthenticated) {
    if (!user?.isActive) {
      initialRouteName = "CompleteProfile";
    } else if (user?.role === "ESTABLISHMENT") {
      initialRouteName = "Home";
    } else {
      initialRouteName = "BeneficiaryHome";
    }
  }

  if (isInitializing) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerStyle: { backgroundColor: "#2e7d32" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      {isAuthenticated ? (
        <>
          {user?.isActive ? (
            <>
              {/* ─── Establecimientos ─── */}
              {user?.role === "ESTABLISHMENT" ? (
                <>
                  <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ title: "ComiYa", headerShown: false }}
                  />
                  <Stack.Screen
                    name="FoodRegistration"
                    component={FoodRegistrationScreen}
                    options={{ title: "Registrar Alimento" }}
                  />
                  <Stack.Screen
                    name="FoodManagement"
                    component={FoodManagementScreen}
                    options={{ title: "Administrar Alimentos" }}
                  />
                  <Stack.Screen
                    name="FoodEdit"
                    component={FoodEditScreen}
                    options={{ title: "Editar Alimento" }}
                  />
                  <Stack.Screen
                    name="EditEstablishmentProfile"
                    component={EditEstablishmentProfileScreen}
                    options={{ title: "Editar Perfil" }}
                  />
                  <Stack.Screen
                    name="PickupManagement"
                    component={PickupManagementScreen}
                    options={{ title: "Gestión de Recogidas" }}
                  />
                  <Stack.Screen
                    name="PickupDetails"
                    component={PickupDetailsScreen}
                    options={{ title: "Detalles de Recogida" }}
                  />
                </>
              ) : (
                <>
                  {/* ─── Beneficiarios ─── */}
                  <Stack.Screen
                    name="BeneficiaryHome"
                    component={BeneficiaryHomeScreen}
                    options={{
                      title: "ComiYa",
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="SearchEstablishments"
                    component={SearchEstablishmentsScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="EditBeneficiaryProfile"
                    component={EditBeneficiaryProfileScreen}
                    options={{ title: "Editar Perfil" }}
                  />
                  <Stack.Screen
                    name="PickupRequest"
                    component={PickupRequestScreen}
                    options={{ title: "Solicitar Recogida" }}
                  />
                  <Stack.Screen
                    name="MyPickups"
                    component={MyPickupsScreen}
                    options={{ title: "Mis Recogidas" }}
                  />
                  <Stack.Screen
                    name="PickupDetails"
                    component={PickupDetailsScreen}
                    options={{ title: "Detalles de Recogida" }}
                  />
                </>
              )}

              {/* Pantalla compartida para ambos roles */}
              <Stack.Screen
                name="EstablishmentList"
                component={EstablishmentListScreen}
                options={{
                  title: "Establecimientos",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="AvailableFoodList"
                component={AvailableFoodListScreen}
                options={{
                  title: "Alimentos Disponibles",
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="Notifications"
                component={NotificationsScreen}
                options={{
                  title: "Notificaciones",
                  headerShown: false,
                }}
              />
            </>
          ) : (
            // Usuario autenticado pero sin completar el perfil
            <Stack.Screen
              name="CompleteProfile"
              component={CompleteProfileScreen}
              options={{
                title: "Completar Perfil",
                headerShown: true,
                gestureEnabled: false, // No permitir swipe back
              }}
            />
          )}
        </>
      ) : (
        <>
          {/* ─── Usuario no autenticado ─── */}
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ title: "ComiYa", headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: "Iniciar sesión", headerShown: false }}
          />
          <Stack.Screen
            name="BasicRegistration"
            component={BasicRegistrationScreen}
            options={{ title: "Crear cuenta", headerShown: true }}
          />
          <Stack.Screen
            name="RegisterOptions"
            component={RegisterOptionsScreen}
            options={{ title: "Crear cuenta", headerShown: true }}
          />
          <Stack.Screen
            name="EstablishmentRegistration"
            component={EstablishmentRegistrationScreen}
            options={{
              title: "Registro de Establecimiento",
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="BeneficiaryRegistration"
            component={BeneficiaryRegistrationScreen}
            options={{
              title: "Registro de Beneficiario",
              headerShown: true,
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

// ─── App Principal ───────────────────────────────────────
export default function App() {
  const navigationRef = useNavigationContainerRef<RootStackParamList>();

  useEffect(() => {
    // Configurar el callback de navegación para notificaciones
    setNavigationCallback((screen: string, params?: Record<string, any>) => {
      if (navigationRef.isReady()) {
        navigationRef.navigate(screen as any, params as any);
      }
    });
  }, [navigationRef]);

  return (
    <AuthProvider>
      <NavigationContainer ref={navigationRef}>
        <StatusBar style="auto" />
        <NotificationProvider>
          <RootNavigator />
        </NotificationProvider>
      </NavigationContainer>
      <Toast />
    </AuthProvider>
  );
}
