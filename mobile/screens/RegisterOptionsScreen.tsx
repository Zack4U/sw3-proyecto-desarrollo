import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
	Colors,
	Spacing,
	FontSizes,
	FontWeights,
	BorderRadius,
	Shadows,
} from '../styles/global';

type RootStackParamList = {
	EstablishmentRegistration: undefined;
	BeneficiaryRegistration: undefined;
	FoodRegistration: undefined;
};

type Props = {
	navigation: NativeStackNavigationProp<RootStackParamList>;
};

export default function RegisterOptionsScreen({ navigation }: Readonly<Props>) {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Crear una cuenta</Text>
			<Text style={styles.subtitle}>Elige el tipo de registro</Text>

			<View style={styles.menuContainer}>
				<TouchableOpacity
					style={[styles.menuButton, styles.establishmentButton]}
					onPress={() => navigation.navigate('EstablishmentRegistration')}
				>
					<Text style={styles.buttonIcon}>🏬</Text>
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

				<TouchableOpacity
					style={[styles.menuButton, styles.foodButton]}
					onPress={() => navigation.navigate('FoodRegistration')}
				>
					<Text style={styles.buttonIcon}>🍎</Text>
					<Text style={styles.buttonText}>Registrar Alimento</Text>
					<Text style={styles.buttonDescription}>
						Publica alimentos disponibles para donación
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
		padding: Spacing.md,
		justifyContent: 'center',
	},
	title: {
		fontSize: FontSizes.xxxl,
		fontWeight: FontWeights.bold,
		color: Colors.primary,
		textAlign: 'center',
		marginBottom: Spacing.sm,
	},
	subtitle: {
		fontSize: FontSizes.md,
		color: Colors.textSecondary,
		textAlign: 'center',
		marginBottom: Spacing.xxl,
	},
	menuContainer: {
		gap: Spacing.md,
	},
	menuButton: {
		backgroundColor: Colors.surface,
		padding: Spacing.lg,
		borderRadius: BorderRadius.xl,
		alignItems: 'center',
		...Shadows.md,
	},
	establishmentButton: {
		borderLeftWidth: 5,
		borderLeftColor: Colors.primary,
	},
	beneficiaryButton: {
		borderLeftWidth: 5,
		borderLeftColor: Colors.secondary,
	},
	foodButton: {
		borderLeftWidth: 5,
		borderLeftColor: Colors.accent,
	},
	buttonIcon: {
		fontSize: 48,
		marginBottom: Spacing.sm,
	},
	buttonText: {
		fontSize: FontSizes.xl,
		fontWeight: FontWeights.semibold,
		color: Colors.textPrimary,
		marginBottom: Spacing.xs,
	},
	buttonDescription: {
		fontSize: FontSizes.sm,
		color: Colors.textSecondary,
		textAlign: 'center',
	},
});
