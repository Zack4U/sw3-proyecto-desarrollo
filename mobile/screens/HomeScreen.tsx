import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { styles } from '../styles/HomeScreenStyle';

type RootStackParamList = {
	Home: undefined;
	EstablishmentRegistration: undefined;
	BeneficiaryRegistration: undefined;
};

type HomeScreenProps = {
	navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>ComiYa</Text>
			<Text style={styles.subtitle}>Reduce el desperdicio de alimentos</Text>

			<View style={styles.menuContainer}>
				<TouchableOpacity
					style={[styles.menuButton, styles.establishmentButton]}
					onPress={() => navigation.navigate('EstablishmentRegistration')}
				>
					<Text style={styles.buttonIcon}>🏪</Text>
					<Text style={styles.buttonText}>Registrar Establecimiento</Text>
					<Text style={styles.buttonDescription}>
						¿Eres dueño de un restaurante? Registra tu negocio
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.menuButton, styles.beneficiaryButton]}
					onPress={() => navigation.navigate('BeneficiaryRegistration')}
				>
					<Text style={styles.buttonIcon}>👤</Text>
					<Text style={styles.buttonText}>Registrar Beneficiario</Text>
					<Text style={styles.buttonDescription}>
						Recibe alimentos disponibles en tu área
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}
