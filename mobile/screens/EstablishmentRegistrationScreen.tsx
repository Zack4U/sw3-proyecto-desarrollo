import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView,
	ActivityIndicator,
} from 'react-native';
import { locationService, Department, City } from '../services/locationService';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
	establishmentService,
	ESTABLISHMENT_TYPES,
} from '../services/establishmentService';
import { styles } from '../styles/EstablishmentRegistrationScreenStyle';
import { FeedbackMessage } from '../components';
import { useRequestState } from '../hooks/useRequestState';

// Función para generar UUID v4
const generateUUID = (): string => {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = Math.trunc(Math.random() * 16);
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
};

type RootStackParamList = {
	Home: undefined;
	EstablishmentRegistration: undefined;
	BeneficiaryRegistration: undefined;
};

type EstablishmentRegistrationScreenProps = {
	navigation: NativeStackNavigationProp<RootStackParamList, 'EstablishmentRegistration'>;
};

// Componente personalizado para Picker
type CustomPickerProps = {
	items: any[];
	selectedValue: string;
	onValueChange: (value: string) => void;
	labelKey: string;
	valueKey: string;
	placeholder?: string;
};

const CustomPicker: React.FC<CustomPickerProps> = ({
	items,
	selectedValue,
	onValueChange,
	labelKey,
	valueKey,
	placeholder,
}) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<View style={{ marginBottom: 8 }}>
			<TouchableOpacity
				onPress={() => setIsOpen(!isOpen)}
				style={{
					borderWidth: 1,
					borderColor: '#E0E0E0',
					borderRadius: 8,
					backgroundColor: '#fff',
					padding: 12,
				}}
			>
				<Text style={{ color: selectedValue ? '#2E2E2E' : '#6B6B6B' }}>
					{selectedValue
						? items.find((item) => item[valueKey] === selectedValue)?.[labelKey] ||
						  placeholder
						: placeholder}
				</Text>
			</TouchableOpacity>
			{isOpen && (
				<ScrollView
					style={{
						maxHeight: 200,
						borderWidth: 1,
						borderColor: '#E0E0E0',
						borderRadius: 8,
						backgroundColor: '#fff',
						marginTop: 4,
					}}
					nestedScrollEnabled
				>
					{items.map((item) => (
						<TouchableOpacity
							key={item[valueKey]}
							style={{
								padding: 12,
								borderBottomWidth: 1,
								borderBottomColor: '#F0F0F0',
								backgroundColor: selectedValue === item[valueKey] ? '#E8F5E9' : '#fff',
							}}
							onPress={() => {
								onValueChange(item[valueKey]);
								setIsOpen(false);
							}}
						>
							<Text
								style={{
									color: selectedValue === item[valueKey] ? '#3CA55C' : '#2E2E2E',
								}}
							>
								{item[labelKey]}
							</Text>
						</TouchableOpacity>
					))}
				</ScrollView>
			)}
		</View>
	);
};

export default function EstablishmentRegistrationScreen({
	navigation,
}: Readonly<EstablishmentRegistrationScreenProps>) {
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		departmentId: '',
		cityId: '',
		neighborhood: '',
		address: '',
		latitude: '',
		longitude: '',
		establishmentType: '',
		userId: 'temp-user-id', // TODO: Obtener del contexto de autenticación
	});
	const [departments, setDepartments] = useState<Department[]>([]);
	const [filteredCities, setFilteredCities] = useState<City[]>([]);

	// Usar el hook personalizado para gestionar el estado de la petición
	const requestState = useRequestState();

	const handleInputChange = (field: string, value: string) => {
		setFormData({ ...formData, [field]: value });
		// Resetear el estado cuando el usuario empiece a editar de nuevo
		if (requestState.error || requestState.success) {
			requestState.reset();
		}
	};

	useEffect(() => {
		// Obtener departamentos al cargar
		locationService.getDepartments().then(setDepartments);
	}, []);

	useEffect(() => {
		// Filtrar ciudades cuando cambia el departamento
		if (formData.departmentId) {
			locationService
				.getCitiesByDepartment(formData.departmentId)
				.then(setFilteredCities);
		} else {
			setFilteredCities([]);
		}
	}, [formData.departmentId]);

	const handleSubmit = async () => {
		// Validación básica
		if (
			!formData.name ||
			!formData.address ||
			!formData.cityId ||
			!formData.departmentId ||
			!formData.establishmentType
		) {
			requestState.setError('Por favor completa todos los campos obligatorios');
			return;
		}

		// Validar coordenadas si se proporcionan
		if (formData.latitude || formData.longitude) {
			const lat = Number.parseFloat(formData.latitude);
			const lng = Number.parseFloat(formData.longitude);

			if (Number.isNaN(lat) || Number.isNaN(lng)) {
				requestState.setError('Las coordenadas deben ser números válidos');
				return;
			}
			if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
				requestState.setError('Las coordenadas están fuera de rango válido');
				return;
			}
		}

		// Iniciar estado de carga
		requestState.setLoading();

		try {
			// Generar UUID para el establecimiento
			const establishmentId = generateUUID();

			// Crear el objeto location en formato GeoJSON
			const location = {
				type: 'Point',
				coordinates: [
					formData.longitude ? Number.parseFloat(formData.longitude) : 0,
					formData.latitude ? Number.parseFloat(formData.latitude) : 0,
				],
			};

			// Llamada al backend con el formato correcto
			const payload = {
				establishmentId: establishmentId,
				name: formData.name,
				description: formData.description || undefined,
				address: formData.address,
				neighborhood: formData.neighborhood || undefined,
				location: location,
				establishmentType: formData.establishmentType,
				userId: formData.userId,
				cityId: formData.cityId,
			};
			const response = await establishmentService.create(payload);

			console.log('Establecimiento creado:', response);

			// Marcar como exitoso
			requestState.setSuccess();

			// Esperar un momento para que el usuario vea el mensaje de éxito
			setTimeout(() => {
				navigation.navigate('Home');
			}, 2000);
		} catch (error) {
			console.error('Error al registrar establecimiento:', error);

			let errorMessage = 'No se pudo registrar el establecimiento';

			if (error instanceof Error) {
				errorMessage = error.message;
			}

			requestState.setError(errorMessage);
		}
	};

	return (
		<ScrollView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Registrar Establecimiento</Text>
				<Text style={styles.subtitle}>Completa la información de tu negocio</Text>
			</View>

			{/* Mensajes de feedback */}
			<View style={styles.form}>
				{requestState.loading && (
					<FeedbackMessage
						type="loading"
						message="Registrando establecimiento..."
						visible={true}
					/>
				)}

				{requestState.success && (
					<FeedbackMessage
						type="success"
						message="¡Establecimiento registrado exitosamente! Redirigiendo..."
						visible={true}
					/>
				)}

				{requestState.error && (
					<FeedbackMessage type="error" message={requestState.error} visible={true} />
				)}

				{/* Nombre */}
				<View style={styles.inputGroup}>
					<Text style={styles.label}>Nombre del Establecimiento *</Text>
					<TextInput
						style={styles.input}
						placeholder="Ej: Restaurante El Buen Sabor"
						value={formData.name}
						onChangeText={(value) => handleInputChange('name', value)}
					/>
				</View>

				{/* Descripción */}
				<View style={styles.inputGroup}>
					<Text style={styles.label}>Descripción</Text>
					<TextInput
						style={styles.input}
						placeholder="Breve descripción de tu establecimiento"
						value={formData.description}
						onChangeText={(value) => handleInputChange('description', value)}
						multiline
						numberOfLines={3}
					/>
				</View>

				{/* Tipo de establecimiento */}
				<View style={styles.inputGroup}>
					<Text style={styles.label}>
						Tipo de Establecimiento <Text style={{ color: 'red' }}>*</Text>
					</Text>
					<CustomPicker
						items={ESTABLISHMENT_TYPES}
						selectedValue={formData.establishmentType}
						onValueChange={(value) => handleInputChange('establishmentType', value)}
						labelKey="label"
						valueKey="value"
						placeholder="Selecciona el tipo de establecimiento"
					/>
				</View>

				{/* Departamento */}
				<View style={styles.inputGroup}>
					<Text style={styles.label}>
						Departamento <Text style={{ color: 'red' }}>*</Text>
					</Text>
					<CustomPicker
						items={departments}
						selectedValue={formData.departmentId}
						onValueChange={(value) => handleInputChange('departmentId', value)}
						labelKey="name"
						valueKey="departmentID"
						placeholder="Selecciona un departamento"
					/>
				</View>

				{/* Ciudad */}
				<View style={styles.inputGroup}>
					<Text style={styles.label}>
						Ciudad <Text style={{ color: 'red' }}>*</Text>
					</Text>
					<CustomPicker
						items={filteredCities}
						selectedValue={formData.cityId}
						onValueChange={(value) => handleInputChange('cityId', value)}
						labelKey="name"
						valueKey="cityID"
						placeholder="Selecciona una ciudad"
					/>
				</View>

				{/* Barrio */}
				<View style={styles.inputGroup}>
					<Text style={styles.label}>Barrio / Zona</Text>
					<TextInput
						style={styles.input}
						placeholder="Ej: Chapinero, La Floresta"
						value={formData.neighborhood}
						onChangeText={(value) => handleInputChange('neighborhood', value)}
					/>
				</View>

				{/* Dirección */}
				<View style={styles.inputGroup}>
					<Text style={styles.label}>
						Dirección <Text style={{ color: 'red' }}>*</Text>
					</Text>
					<TextInput
						style={styles.input}
						placeholder="Ej: Calle 123 #45-67"
						value={formData.address}
						onChangeText={(value) => handleInputChange('address', value)}
					/>
				</View>

				{/* Coordenadas - Opcional */}
				<View style={styles.inputGroup}>
					<Text style={styles.label}>Ubicación (Opcional)</Text>
					<Text style={{ fontSize: 12, color: '#6B6B6B', marginBottom: 8 }}>
						Ingresa las coordenadas geográficas de tu establecimiento
					</Text>
					<View style={{ flexDirection: 'row', gap: 8 }}>
						<View style={{ flex: 1 }}>
							<Text style={{ fontSize: 12, marginBottom: 4 }}>Latitud</Text>
							<TextInput
								style={styles.input}
								placeholder="Ej: 4.6097"
								value={formData.latitude}
								onChangeText={(value) => handleInputChange('latitude', value)}
								keyboardType="numeric"
							/>
						</View>
						<View style={{ flex: 1 }}>
							<Text style={{ fontSize: 12, marginBottom: 4 }}>Longitud</Text>
							<TextInput
								style={styles.input}
								placeholder="Ej: -74.0817"
								value={formData.longitude}
								onChangeText={(value) => handleInputChange('longitude', value)}
								keyboardType="numeric"
							/>
						</View>
					</View>
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
						<Text style={styles.submitButtonText}>Registrar Establecimiento</Text>
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
