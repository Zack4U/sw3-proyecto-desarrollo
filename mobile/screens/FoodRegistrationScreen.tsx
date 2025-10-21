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
import { foodService, FOOD_CATEGORIES, UNIT_OF_MEASURE } from '../services/foodService';
import { styles } from '../styles/FoodRegistrationScreenStyle';
import { FeedbackMessage } from '../components';
import { useRequestState } from '../hooks/useRequestState';

type RootStackParamList = {
	Home: undefined;
	EstablishmentRegistration: undefined;
	BeneficiaryRegistration: undefined;
	FoodRegistration: undefined;
};

type FoodRegistrationScreenProps = {
	navigation: NativeStackNavigationProp<RootStackParamList, 'FoodRegistration'>;
};

// Componente personalizado para Picker
type CustomPickerProps = {
	items: { value: string; label: string }[];
	selectedValue: string;
	onValueChange: (value: string) => void;
	placeholder?: string;
};

const CustomPicker: React.FC<CustomPickerProps> = ({
	items,
	selectedValue,
	onValueChange,
	placeholder,
}) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<View style={styles.pickerContainer}>
			<TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
				<Text style={[styles.pickerPlaceholder, selectedValue && { color: '#2E2E2E' }]}>
					{selectedValue
						? items.find((item) => item.value === selectedValue)?.label
						: placeholder}
				</Text>
			</TouchableOpacity>
			{isOpen && (
				<ScrollView
					style={{ maxHeight: 200 }}
					nestedScrollEnabled
					keyboardShouldPersistTaps="handled"
				>
					{items.map((item) => (
						<TouchableOpacity
							key={item.value}
							style={[
								styles.pickerItem,
								selectedValue === item.value && styles.pickerItemSelected,
							]}
							onPress={() => {
								onValueChange(item.value);
								setIsOpen(false);
							}}
						>
							<Text
								style={[
									styles.pickerItemText,
									selectedValue === item.value && styles.pickerItemTextSelected,
								]}
							>
								{item.label}
							</Text>
						</TouchableOpacity>
					))}
				</ScrollView>
			)}
		</View>
	);
};

export default function FoodRegistrationScreen({
	navigation,
}: Readonly<FoodRegistrationScreenProps>) {
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		category: '',
		quantity: '',
		unitOfMeasure: '',
		expiresAt: '',
		// Por ahora usamos un ID temporal, en producción se obtendría del usuario logueado
		establishmentId: 'temp-establishment-id',
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
		if (
			!formData.name ||
			!formData.category ||
			!formData.quantity ||
			!formData.unitOfMeasure ||
			!formData.expiresAt
		) {
			requestState.setError('Por favor completa todos los campos obligatorios');
			return;
		}

		// Validar que la cantidad sea un número positivo
		const quantity = Number.parseFloat(formData.quantity);
		if (Number.isNaN(quantity) || quantity <= 0) {
			requestState.setError('La cantidad debe ser un número positivo');
			return;
		}

		// Validar que la fecha de expiración sea futura
		const expiresAt = new Date(formData.expiresAt);
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		if (expiresAt < today) {
			requestState.setError('La fecha de expiración debe ser posterior a hoy');
			return;
		}

		// Validar que haya un establecimiento asociado
		if (
			!formData.establishmentId ||
			formData.establishmentId === 'temp-establishment-id'
		) {
			requestState.setError(
				'Debes tener un establecimiento registrado para agregar alimentos'
			);
			return;
		}

		// Iniciar estado de carga
		requestState.setLoading();

		try {
			// Llamada al backend
			const payload = {
				name: formData.name,
				description: formData.description,
				category: formData.category,
				quantity: quantity,
				unitOfMeasure: formData.unitOfMeasure,
				expiresAt: formData.expiresAt,
				establishmentId: formData.establishmentId,
			};

			const response = await foodService.create(payload);

			console.log('Alimento creado:', response);

			// Marcar como exitoso
			requestState.setSuccess();

			// Esperar un momento para que el usuario vea el mensaje de éxito
			setTimeout(() => {
				navigation.navigate('Home');
			}, 2000);
		} catch (error) {
			console.error('Error al registrar alimento:', error);

			let errorMessage = 'No se pudo registrar el alimento';

			if (error instanceof Error) {
				errorMessage = error.message;
			}

			requestState.setError(errorMessage);
		}
	};

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={{ paddingBottom: 32 }}
			keyboardShouldPersistTaps="handled"
			nestedScrollEnabled
			contentInsetAdjustmentBehavior="automatic"
			showsVerticalScrollIndicator
		>
			<View style={styles.header}>
				<Text style={styles.title}>Registrar Alimento</Text>
				<Text style={styles.subtitle}>
					Completa la información del alimento disponible
				</Text>
			</View>

			{/* Mensajes de feedback */}
			<View style={styles.form}>
				{requestState.loading && (
					<FeedbackMessage
						type="loading"
						message="Registrando alimento..."
						visible={true}
					/>
				)}

				{requestState.success && (
					<FeedbackMessage
						type="success"
						message="¡Alimento registrado exitosamente! Redirigiendo..."
						visible={true}
					/>
				)}

				{requestState.error && (
					<FeedbackMessage type="error" message={requestState.error} visible={true} />
				)}

				{/* Nombre del alimento */}
				<View style={styles.inputGroup}>
					<Text style={styles.label}>
						Nombre del Alimento <Text style={styles.required}>*</Text>
					</Text>
					<TextInput
						style={styles.input}
						placeholder="Ej: Pan integral, Arroz blanco"
						value={formData.name}
						onChangeText={(value) => handleInputChange('name', value)}
					/>
				</View>

				{/* Descripción */}
				<View style={styles.inputGroup}>
					<Text style={styles.label}>Descripción</Text>
					<TextInput
						style={styles.textArea}
						placeholder="Describe el estado y características del alimento"
						value={formData.description}
						onChangeText={(value) => handleInputChange('description', value)}
						multiline
						numberOfLines={3}
					/>
				</View>

				{/* Categoría */}
				<View style={styles.inputGroup}>
					<Text style={styles.label}>
						Categoría <Text style={styles.required}>*</Text>
					</Text>
					<CustomPicker
						items={FOOD_CATEGORIES}
						selectedValue={formData.category}
						onValueChange={(value) => handleInputChange('category', value)}
						placeholder="Selecciona una categoría"
					/>
				</View>

				{/* Cantidad y Unidad de Medida */}
				<View style={styles.row}>
					<View style={[styles.inputGroup, styles.halfWidth]}>
						<Text style={styles.label}>
							Cantidad <Text style={styles.required}>*</Text>
						</Text>
						<TextInput
							style={styles.input}
							placeholder="Ej: 5"
							value={formData.quantity}
							onChangeText={(value) => handleInputChange('quantity', value)}
							keyboardType="numeric"
						/>
					</View>

					<View style={[styles.inputGroup, styles.halfWidth]}>
						<Text style={styles.label}>
							Unidad <Text style={styles.required}>*</Text>
						</Text>
						<CustomPicker
							items={UNIT_OF_MEASURE}
							selectedValue={formData.unitOfMeasure}
							onValueChange={(value) => handleInputChange('unitOfMeasure', value)}
							placeholder="Selecciona"
						/>
					</View>
				</View>

				{/* Fecha de Expiración */}
				<View style={styles.inputGroup}>
					<Text style={styles.label}>
						Fecha de Expiración <Text style={styles.required}>*</Text>
					</Text>
					<TextInput
						style={styles.input}
						placeholder="YYYY-MM-DD (ej: 2025-12-31)"
						value={formData.expiresAt}
						onChangeText={(value) => handleInputChange('expiresAt', value)}
					/>
					<Text style={styles.helpText}>Formato: Año-Mes-Día (2025-12-31)</Text>
				</View>

				{/* Botones */}
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
						<Text style={styles.submitButtonText}>Registrar Alimento</Text>
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
