import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';

// ─── Screens ─────────────────────────────────────────────
import HomeScreen from './screens/HomeScreen';
import BeneficiaryHomeScreen from './screens/BeneficiaryHomeScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import BasicRegistrationScreen from './screens/BasicRegistrationScreen';
import RegisterOptionsScreen from './screens/RegisterOptionsScreen';
import EstablishmentRegistrationScreen from './screens/EstablishmentRegistrationScreen';
import BeneficiaryRegistrationScreen from './screens/BeneficiaryRegistrationScreen';
import FoodRegistrationScreen from './screens/FoodRegistrationScreen';
import EstablishmentListScreen from './screens/EstablishmentListScreen';
import SplashScreen from './screens/SplashScreen';
import CompleteProfileScreen from './screens/CompleteProfileScreen';
import SearchEstablishmentsScreen from './screens/SearchEstablishmentsScreen';

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
  EstablishmentList: undefined;
  CompleteProfile: undefined;
  SearchEstablishments: undefined;
};

// ─── Creación del Stack ──────────────────────────────────
const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * 📱 RootNavigator: controla qué pantallas mostrar
 * dependiendo de si el usuario está autenticado o no.
 */
function RootNavigator() {
  const { isAuthenticated, isInitializing, user } = useAuth();

  // Mientras se carga el estado de autenticación → Splash
  if (isInitializing) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? 'Home' : 'Welcome'}
      screenOptions={{
        headerStyle: { backgroundColor: '#2e7d32' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      {isAuthenticated ? (
        <>
          {/* Si el usuario completó el perfil */}
          {user?.isActive ? (
            <>
              {/* ─── Establecimiento autenticado ─── */}
              {user?.role === 'ESTABLISHMENT' ? (
                <>
                  <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                      title: 'ComiYa',
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="FoodRegistration"
                    component={FoodRegistrationScreen}
                    options={{
                      title: 'Registrar Alimento',
                    }}
                  />
                  <Stack.Screen
                    name="EstablishmentList"
                    component={EstablishmentListScreen}
                    options={{
                      title: 'Establecimientos',
                      headerShown: false,
                    }}
                  />
                </>
              ) : (
                <>
                  {/* ─── Beneficiario autenticado ─── */}
                  <Stack.Screen
                    name="BeneficiaryHome"
                    component={BeneficiaryHomeScreen}
                    options={{
                      title: 'ComiYa',
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="SearchEstablishments"
                    component={SearchEstablishmentsScreen}
                    options={{
                      title: 'Buscar Establecimientos',
                      headerShown: false,
                    }}
                  />
                </>
              )}
            </>
          ) : (
            // Usuario autenticado pero sin completar el perfil
            <Stack.Screen
              name="CompleteProfile"
              component={CompleteProfileScreen}
              options={{
                title: 'Completar Perfil',
                headerShown: true,
                gestureEnabled: false,
              }}
            />
          )}
        </>
      ) : (
        // ─── Usuario no autenticado ───
        <>
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{
              title: 'ComiYa',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              title: 'Iniciar sesión',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="BasicRegistration"
            component={BasicRegistrationScreen}
            options={{
              title: 'Crear cuenta',
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="RegisterOptions"
            component={RegisterOptionsScreen}
            options={{
              title: 'Crear cuenta',
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="EstablishmentRegistration"
            component={EstablishmentRegistrationScreen}
            options={{
              title: 'Registro de Establecimiento',
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="BeneficiaryRegistration"
            component={BeneficiaryRegistrationScreen}
            options={{
              title: 'Registro de Beneficiario',
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
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
