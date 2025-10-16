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
import { beneficiaryService } from '../services/beneficiaryService';
import { styles } from '../styles/BeneficiaryRegistrationScreenStyle';

type RootStackParamList = {
	Home: undefined;
	EstablishmentRegistration: undefined;
	BeneficiaryRegistration: undefined;
};

type BeneficiaryRegistrationScreenProps = {
	navigation: NativeStackNavigationProp<RootStackParamList, 'BeneficiaryRegistration'>;
};

export default function BeneficiaryRegistrationScreen({
	navigation,
}: BeneficiaryRegistrationScreenProps) {
	const [formData, setFormData] = useState({
		nombre: '',
		email: '',
		telefono: '',
	});
	const [loading, setLoading] = useState(false);

	const handleInputChange = (field: string, value: string) => {
		setFormData({ ...formData, [field]: value });
	};

	const handleSubmit = async () => {
		// Validación básica
		if (!formData.nombre || !formData.email || !formData.telefono) {
			Alert.alert('Error', 'Por favor completa todos los campos');
			return;
		}

		setLoading(true);

		try {
			// Llamada al backend
			const response = await beneficiaryService.create(formData);

			console.log('Beneficiario creado:', response);

			Alert.alert('¡Éxito!', 'Beneficiario registrado correctamente', [
				{
					text: 'OK',
					onPress: () => navigation.navigate('Home'),
				},
			]);
		} catch (error) {
			console.error('Error al registrar beneficiario:', error);

			let errorMessage = 'No se pudo registrar el beneficiario';

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
				<Text style={styles.title}>Registrar Beneficiario</Text>
				<Text style={styles.subtitle}>Completa tu información personal</Text>
			</View>

			<View style={styles.form}>
				<View style={styles.inputGroup}>
					<Text style={styles.label}>Nombre Completo *</Text>
					<TextInput
						style={styles.input}
						placeholder="Ej: Juan Pérez"
						value={formData.nombre}
						onChangeText={(value) => handleInputChange('nombre', value)}
					/>
				</View>

				<View style={styles.inputGroup}>
					<Text style={styles.label}>Correo Electrónico *</Text>
					<TextInput
						style={styles.input}
						placeholder="Ej: juan@email.com"
						value={formData.email}
						onChangeText={(value) => handleInputChange('email', value)}
						keyboardType="email-address"
						autoCapitalize="none"
					/>
				</View>

				<View style={styles.inputGroup}>
					<Text style={styles.label}>Teléfono *</Text>
					<TextInput
						style={styles.input}
						placeholder="Ej: 3001234567"
						value={formData.telefono}
						onChangeText={(value) => handleInputChange('telefono', value)}
						keyboardType="phone-pad"
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
						<Text style={styles.submitButtonText}>Registrar Beneficiario</Text>
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
