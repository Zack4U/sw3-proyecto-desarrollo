import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Alert,
	ActivityIndicator,
} from 'react-native';
import { locationService, Department, City } from '../services/locationService';
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
	return (
		<View
			style={{
				borderWidth: 1,
				borderColor: '#E0E0E0',
				borderRadius: 8,
				backgroundColor: '#fff',
				marginBottom: 8,
			}}
		>
			<Text style={{ color: '#6B6B6B', padding: 8 }}>{placeholder}</Text>
			{items.map((item) => (
				<TouchableOpacity
					key={item[valueKey]}
					style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}
					onPress={() => onValueChange(item[valueKey])}
				>
					<Text
						style={{ color: selectedValue === item[valueKey] ? '#3CA55C' : '#2E2E2E' }}
					>
						{item[labelKey]}
					</Text>
				</TouchableOpacity>
			))}
		</View>
	);
};

export default function EstablishmentRegistrationScreen({
	navigation,
}: EstablishmentRegistrationScreenProps) {
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		departmentId: '',
		cityId: '',
		neighborhood: '',
		address: '',
		location: '',
		establishmentType: '',
		userId: '',
	});
	const [departments, setDepartments] = useState<Department[]>([]);
	const [filteredCities, setFilteredCities] = useState<City[]>([]);
	const [loading, setLoading] = useState(false);

	const handleInputChange = (field: string, value: string) => {
		setFormData({ ...formData, [field]: value });
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
			Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
			return;
		}

		setLoading(true);

		try {
			// Llamada al backend
			const payload = {
				name: formData.name,
				description: formData.description,
				cityId: formData.cityId,
				neighborhood: formData.neighborhood,
				address: formData.address,
				location: formData.location,
				establishmentType: formData.establishmentType,
				userId: formData.userId || 'temp-user-id',
			};
			const response = await establishmentService.create(payload);

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
						placeholder="Breve descripción"
						value={formData.description}
						onChangeText={(value) => handleInputChange('description', value)}
					/>
				</View>

				{/* Departamento */}
				<View style={styles.inputGroup}>
					<Text style={styles.label}>Departamento *</Text>
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
					<Text style={styles.label}>Ciudad *</Text>
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
					<Text style={styles.label}>Barrio</Text>
					<TextInput
						style={styles.input}
						placeholder="Ej: Chapinero, La Floresta"
						value={formData.neighborhood}
						onChangeText={(value) => handleInputChange('neighborhood', value)}
					/>
				</View>

				{/* Dirección */}
				<View style={styles.inputGroup}>
					<Text style={styles.label}>Dirección *</Text>
					<TextInput
						style={styles.input}
						placeholder="Ej: Calle 123 #45-67"
						value={formData.address}
						onChangeText={(value) => handleInputChange('address', value)}
					/>
				</View>

				{/* Tipo de establecimiento */}
				<View style={styles.inputGroup}>
					<Text style={styles.label}>Tipo de Establecimiento *</Text>
					<TextInput
						style={styles.input}
						placeholder="Ej: Restaurante, Cafetería, Panadería"
						value={formData.establishmentType}
						onChangeText={(value) => handleInputChange('establishmentType', value)}
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
