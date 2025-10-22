import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import HomeScreen from './screens/HomeScreen';
import BeneficiaryHomeScreen from './screens/BeneficiaryHomeScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import BasicRegistrationScreen from './screens/BasicRegistrationScreen';
import RegisterOptionsScreen from './screens/RegisterOptionsScreen';
import EstablishmentRegistrationScreen from './screens/EstablishmentRegistrationScreen';
import BeneficiaryRegistrationScreen from './screens/BeneficiaryRegistrationScreen';
import FoodRegistrationScreen from './screens/FoodRegistrationScreen';
import SplashScreen from './screens/SplashScreen';
import CompleteProfileScreen from './screens/CompleteProfileScreen';

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
	CompleteProfile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Componente navegador basado en el estado de autenticación
 */
function RootNavigator() {
	const { isAuthenticated, isInitializing, user } = useAuth();

	if (isInitializing) {
		return <SplashScreen />;
	}

	return (
		<Stack.Navigator
			initialRouteName={isAuthenticated ? 'Home' : 'Welcome'}
			screenOptions={{
				headerStyle: {
					backgroundColor: '#2e7d32',
				},
				headerTintColor: '#fff',
				headerTitleStyle: {
					fontWeight: 'bold',
				},
			}}
		>
			{isAuthenticated ? (
				// Stack de la app autenticada
				<>
					{/* Si el usuario no completó el perfil (isActive = false), mostrar CompleteProfile */}
					{user?.isActive ? (
						<>
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
								</>
							) : (
								<Stack.Screen
									name="BeneficiaryHome"
									component={BeneficiaryHomeScreen}
									options={{
										title: 'ComiYa',
										headerShown: false, // usamos header personalizado dentro de la pantalla
									}}
								/>
							)}
						</>
					) : (
						<Stack.Screen
							name="CompleteProfile"
							component={CompleteProfileScreen}
							options={{
								title: 'Completar Perfil',
								headerShown: true,
								gestureEnabled: false, // No permitir swipe back
							}}
						/>
					)}
				</>
			) : (
				// Stack de autenticación
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
