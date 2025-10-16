import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import EstablishmentRegistrationScreen from './screens/EstablishmentRegistrationScreen';
import BeneficiaryRegistrationScreen from './screens/BeneficiaryRegistrationScreen';

export type RootStackParamList = {
	Home: undefined;
	EstablishmentRegistration: undefined;
	BeneficiaryRegistration: undefined;
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
						title: 'ComeYa',
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
			</Stack.Navigator>
		</NavigationContainer>
	);
}
