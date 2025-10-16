import React, { useState } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Alert,
	ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { establishmentService } from '../services/establishmentService';
import { styles } from '../styles/EstablishmentRegistrationScreenStyle';

type RootStackParamList = {
	Home: undefined;
	EstablishmentRegistration: undefined;
	BeneficiaryRegistration: undefined;
};

type EstablishmentRegistrationScreenProps = {
	navigation: NativeStackNavigationProp<RootStackParamList, 'EstablishmentRegistration'>;
};

export default function EstablishmentRegistrationScreen({
	navigation,
}: EstablishmentRegistrationScreenProps) {
	const [formData, setFormData] = useState({
		nombre: '',
		address: '',
		type: '',
		location: '',
	});
	const [loading, setLoading] = useState(false);

	const handleInputChange = (field: string, value: string) => {
		setFormData({ ...formData, [field]: value });
	};

	const handleSubmit = async () => {
		// Validación básica
		if (!formData.nombre || !formData.address || !formData.type || !formData.location) {
			Alert.alert('Error', 'Por favor completa todos los campos');
			return;
		}

		setLoading(true);

		try {
			// Llamada al backend
			const response = await establishmentService.create(formData);

			console.log('Establecimiento creado:', response);

			Alert.alert('¡Éxito!', 'Establecimiento registrado correctamente', [
				{
					text: 'OK',
					onPress: () => navigation.navigate('Home'),
				},
			]);
		} catch (error) {
			console.error('Error al registrar establecimiento:', error);

			let errorMessage = 'No se pudo registrar el establecimiento';

			if (error instanceof Error) {
				errorMessage = error.message;
			}

			Alert.alert('Error', errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return (
		<ScrollView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Registrar Establecimiento</Text>
				<Text style={styles.subtitle}>Completa la información de tu negocio</Text>
			</View>

			<View style={styles.form}>
				<View style={styles.inputGroup}>
					<Text style={styles.label}>Nombre del Establecimiento *</Text>
					<TextInput
						style={styles.input}
						placeholder="Ej: Restaurante El Buen Sabor"
						value={formData.nombre}
						onChangeText={(value) => handleInputChange('nombre', value)}
					/>
				</View>

				<View style={styles.inputGroup}>
					<Text style={styles.label}>Dirección *</Text>
					<TextInput
						style={styles.input}
						placeholder="Ej: Calle 123 #45-67"
						value={formData.address}
						onChangeText={(value) => handleInputChange('address', value)}
					/>
				</View>

				<View style={styles.inputGroup}>
					<Text style={styles.label}>Tipo de Establecimiento *</Text>
					<TextInput
						style={styles.input}
						placeholder="Ej: Restaurante, Cafetería, Panadería"
						value={formData.type}
						onChangeText={(value) => handleInputChange('type', value)}
					/>
				</View>

				<View style={styles.inputGroup}>
					<Text style={styles.label}>Ubicación/Zona *</Text>
					<TextInput
						style={styles.input}
						placeholder="Ej: Centro, Norte, Sur"
						value={formData.location}
						onChangeText={(value) => handleInputChange('location', value)}
					/>
				</View>

				<TouchableOpacity
					style={[styles.submitButton, loading && styles.submitButtonDisabled]}
					onPress={handleSubmit}
					disabled={loading}
				>
					{loading ? (
						<ActivityIndicator color="white" />
					) : (
						<Text style={styles.submitButtonText}>Registrar Establecimiento</Text>
					)}
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.cancelButton}
					onPress={() => navigation.goBack()}
					disabled={loading}
				>
					<Text style={styles.cancelButtonText}>Cancelar</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
}
