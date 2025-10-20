import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterOptionsScreen from './screens/RegisterOptionsScreen';
import EstablishmentRegistrationScreen from './screens/EstablishmentRegistrationScreen';
import BeneficiaryRegistrationScreen from './screens/BeneficiaryRegistrationScreen';
import FoodRegistrationScreen from './screens/FoodRegistrationScreen';

export type RootStackParamList = {
	Home: undefined;
	Login: undefined;
	RegisterOptions: undefined;
	EstablishmentRegistration: undefined;
	BeneficiaryRegistration: undefined;
	FoodRegistration: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
	return (
		<NavigationContainer>
			<StatusBar style="auto" />
			<Stack.Navigator
				initialRouteName="Home"
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
				<Stack.Screen
					name="Home"
					component={HomeScreen}
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
					name="RegisterOptions"
					component={RegisterOptionsScreen}
					options={{
						title: 'Crear cuenta',
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name="EstablishmentRegistration"
					component={EstablishmentRegistrationScreen}
					options={{
						title: 'Registro de Establecimiento',
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name="BeneficiaryRegistration"
					component={BeneficiaryRegistrationScreen}
					options={{
						title: 'Registro de Beneficiario',
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name="FoodRegistration"
					component={FoodRegistrationScreen}
					options={{
						title: 'Registro de Alimento',
						headerShown: false,
					}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}
