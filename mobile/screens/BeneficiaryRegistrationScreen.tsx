import React, { useState } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView,
	ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { beneficiaryService } from '../services/beneficiaryService';
import { styles } from '../styles/BeneficiaryRegistrationScreenStyle';
import { FeedbackMessage } from '../components';
import { useRequestState } from '../hooks/useRequestState';

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
}: Readonly<BeneficiaryRegistrationScreenProps>) {
	const [formData, setFormData] = useState({
		nombre: '',
		email: '',
		telefono: '',
	});

	// Usar el hook personalizado para gestionar el estado de la petición
	const requestState = useRequestState();

	const handleInputChange = (field: string, value: string) => {
		setFormData({ ...formData, [field]: value });
		// Resetear el estado cuando el usuario empiece a editar de nuevo
		if (requestState.error || requestState.success) {
			requestState.reset();
		}
	};

	const handleSubmit = async () => {
		// Validación básica
		if (!formData.nombre || !formData.email || !formData.telefono) {
			requestState.setError('Por favor completa todos los campos');
			return;
		}

		// Validación de email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(formData.email)) {
			requestState.setError('Por favor ingresa un correo electrónico válido');
			return;
		}

		// Iniciar estado de carga
		requestState.setLoading();

		try {
			// Llamada al backend
			const response = await beneficiaryService.create(formData);

			console.log('Beneficiario creado:', response);

			// Marcar como exitoso
			requestState.setSuccess();

			// Esperar un momento para que el usuario vea el mensaje de éxito
			setTimeout(() => {
				navigation.navigate('Home');
			}, 2000);
		} catch (error) {
			console.error('Error al registrar beneficiario:', error);

			let errorMessage = 'No se pudo registrar el beneficiario';

			if (error instanceof Error) {
				errorMessage = error.message;
			}

			requestState.setError(errorMessage);
		}
	};

	return (
		<ScrollView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Registrar Beneficiario</Text>
				<Text style={styles.subtitle}>Completa tu información personal</Text>
			</View>

			{/* Mensajes de feedback */}
			<View style={styles.form}>
				{requestState.loading && (
					<FeedbackMessage
						type="loading"
						message="Registrando beneficiario..."
						visible={true}
					/>
				)}

				{requestState.success && (
					<FeedbackMessage
						type="success"
						message="¡Beneficiario registrado exitosamente! Redirigiendo..."
						visible={true}
					/>
				)}

				{requestState.error && (
					<FeedbackMessage type="error" message={requestState.error} visible={true} />
				)}

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
					style={[
						styles.submitButton,
						requestState.loading && styles.submitButtonDisabled,
					]}
					onPress={handleSubmit}
					disabled={requestState.loading || requestState.success}
				>
					{requestState.loading ? (
						<ActivityIndicator color="white" />
					) : (
						<Text style={styles.submitButtonText}>Registrar Beneficiario</Text>
					)}
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.cancelButton}
					onPress={() => navigation.goBack()}
					disabled={requestState.loading}
				>
					<Text style={styles.cancelButtonText}>Cancelar</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
}
