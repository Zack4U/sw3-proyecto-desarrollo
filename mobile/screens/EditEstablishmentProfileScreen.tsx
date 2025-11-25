import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	ScrollView,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
	Alert,
	KeyboardAvoidingView,
	Platform,
	Modal,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { useRequestState } from '../hooks/useRequestState';
import { useAddressVerification } from '../hooks/useAddressVerification';
import {
	profileService,
	EstablishmentProfile,
	UserProfile,
} from '../services/profileService';
import { locationService } from '../services/locationService';
import { FeedbackMessage, AddressVerificationModal } from '../components';
import { styles } from '../styles/EditEstablishmentProfileScreenStyle';
import {
	getEstablishmentTypeOptions,
	getEstablishmentTypeLabel,
} from '../utils/establishmentTypeTranslations';

type RootStackParamList = {
	Home: undefined;
	EditEstablishmentProfile: undefined;
};

type Props = {
	navigation: NativeStackNavigationProp<RootStackParamList, 'EditEstablishmentProfile'>;
};

import { useToast } from '../hooks/useToast';

export default function EditEstablishmentProfileScreen({ navigation }: Readonly<Props>) {
	const { user } = useAuth();
	const requestState = useRequestState();
	const toast = useToast();

	const [loading, setLoading] = useState(true);
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
	const [establishment, setEstablishment] = useState<EstablishmentProfile | null>(null);

	// Guardar datos originales para comparación
	const [originalData, setOriginalData] = useState({
		email: '',
		phone: '',
		username: '',
		documentNumber: '',
		name: '',
		description: '',
		address: '',
		neighborhood: '',
		establishmentType: '',
		cityId: '',
	});

	// Campos editables
	const [formData, setFormData] = useState({
		email: '',
		phone: '',
		username: '',
		documentNumber: '',
		name: '',
		description: '',
		address: '',
		neighborhood: '',
		establishmentType: '',
		cityId: '',
	});

	// Estado para el modal del picker
	const [showEstablishmentTypePicker, setShowEstablishmentTypePicker] = useState(false);
	const [showAddressVerification, setShowAddressVerification] = useState(false);
	const [verifiedLocation, setVerifiedLocation] = useState<any>(null);
	const [cityName, setCityName] = useState('');

	// Estados para los modales de ciudad y departamento
	const [showCityModal, setShowCityModal] = useState(false);
	const [showDepartmentModal, setShowDepartmentModal] = useState(false);
	const [departments, setDepartments] = useState<any[]>([]);
	const [cities, setCities] = useState<any[]>([]);
	const [selectedDepartment, setSelectedDepartment] = useState<any>(null);
	const [loadingCities, setLoadingCities] = useState(false);
	const [loadingDepartments, setLoadingDepartments] = useState(false);

	// Hooks
	const addressVerification = useAddressVerification();

	useEffect(() => {
		loadProfile();
		loadDepartments();
	}, []);

	const loadProfile = async () => {
		try {
			console.log('🔄 EditEstablishmentProfileScreen - loadProfile iniciando...');
			setLoading(true);
			const data = await profileService.getUserProfile();
			console.log('📊 EditEstablishmentProfileScreen - Data recibida:', data);
			console.log('👤 User data:', data.user);
			console.log('🏪 Establishment data:', data.establishment);

			if (data.establishment) {
				console.log('✅ Establishment encontrado, preparando initialData...');
				const initialData = {
					email: data.user.email || '',
					phone: data.user.phone || '',
					username: data.user.username || '',
					documentNumber: data.user.documentNumber || '',
					name: data.establishment.name || '',
					description: data.establishment.description || '',
					address: data.establishment.address || '',
					neighborhood: data.establishment.neighborhood || '',
					establishmentType: data.establishment.establishmentType || '',
					cityId: data.establishment.cityId || '',
				};
				console.log('💾 initialData:', initialData);

				setUserProfile(data.user);
				setEstablishment(data.establishment);
				setFormData(initialData);
				setOriginalData(initialData);

				// Cargar el nombre de la ciudad si existe cityId
				if (data.establishment.cityId) {
					loadCityName(data.establishment.cityId);
				}

				console.log('✅ Estados actualizados correctamente');
			} else {
				console.warn('⚠️ No establishment encontrado en la respuesta');
			}
			setLoading(false);
		} catch (error) {
			const errorMsg =
				error instanceof Error ? error.message : 'Error al cargar el perfil';
			console.error('❌ Error en loadProfile:', errorMsg);
			requestState.setError(errorMsg);
			toast.error(errorMsg, 'Error de carga');
			setLoading(false);
		}
	};

	const loadDepartments = async () => {
		try {
			setLoadingDepartments(true);
			const data = await locationService.getDepartments();
			setDepartments(data);
		} catch (error) {
			console.error('Error loading departments:', error);
		} finally {
			setLoadingDepartments(false);
		}
	};

	const loadCitiesByDepartment = async (department: any) => {
		try {
			setLoadingCities(true);
			setSelectedDepartment(department);
			const data = await locationService.getCitiesByDepartment(department.departmentId);
			setCities(data);
		} catch (error) {
			console.error('Error loading cities:', error);
		} finally {
			setLoadingCities(false);
		}
	};

	const loadCityName = async (cityId: string) => {
		try {
			// Necesitamos obtener primero todos los departamentos para buscar la ciudad
			const depts = await locationService.getDepartments();
			for (const dept of depts) {
				const citiesList = await locationService.getCitiesByDepartment(dept.departmentId);
				const city = citiesList.find((c) => c.cityId === cityId);
				if (city) {
					setCityName(city.name);
					// También guardar el departamento para el selector
					setSelectedDepartment(dept);
					break;
				}
			}
		} catch (error) {
			console.error('Error loading city name:', error);
			setCityName('Ciudad desconocida');
		}
	};

	const handleSelectCity = (city: any) => {
		setFormData((prev) => ({ ...prev, cityId: city.cityId }));
		setCityName(city.name);
		setShowCityModal(false);

		// Limpiar error si existe
		if (requestState.error || requestState.success) {
			requestState.reset();
		}
	};

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));

		if (requestState.error || requestState.success) {
			requestState.reset();
		}
	};

	const hasChanges = (field: keyof typeof formData): boolean => {
		return formData[field] !== originalData[field];
	};

	const hasAnyChanges = (): boolean => {
		return Object.keys(formData).some((field) =>
			hasChanges(field as keyof typeof formData)
		);
	};

	const hasUserChanges = (): boolean => {
		return (
			hasChanges('email') ||
			hasChanges('phone') ||
			hasChanges('username') ||
			hasChanges('documentNumber')
		);
	};

	const hasEstablishmentChanges = (): boolean => {
		return (
			hasChanges('name') ||
			hasChanges('description') ||
			hasChanges('address') ||
			hasChanges('neighborhood') ||
			hasChanges('establishmentType') ||
			hasChanges('cityId')
		);
	};

	const validateForm = (): boolean => {
		if (!formData.email) {
			const msg = 'El email es obligatorio';
			requestState.setError(msg);
			toast.warning(msg, 'Campo requerido');
			return false;
		}

		if (!formData.name) {
			const msg = 'El nombre del establecimiento es obligatorio';
			requestState.setError(msg);
			toast.warning(msg, 'Campo requerido');
			return false;
		}

		if (!formData.address) {
			const msg = 'La dirección es obligatoria';
			requestState.setError(msg);
			toast.warning(msg, 'Campo requerido');
			return false;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(formData.email)) {
			const msg = 'Por favor ingresa un email válido';
			requestState.setError(msg);
			toast.warning(msg, 'Email inválido');
			return false;
		}

		return true;
	};

	const handleAddressVerified = (data: {
		latitude: number;
		longitude: number;
		address: string;
		location: {
			type: 'Point';
			coordinates: [number, number];
		};
	}) => {
		console.log('📍 [EDIT_PROFILE] Address verified with location:', data);
		setVerifiedLocation(data);
		setFormData((prev) => ({
			...prev,
			address: data.address,
		}));
		setShowAddressVerification(false);
		toast.success('Dirección verificada correctamente', 'Ubicación');
	};

	const handleSaveUserChanges = async () => {
		if (!formData.email) {
			const msg = 'El email es obligatorio';
			requestState.setError(msg);
			toast.warning(msg, 'Campo requerido');
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(formData.email)) {
			const msg = 'Por favor ingresa un email válido';
			requestState.setError(msg);
			toast.warning(msg, 'Email inválido');
			return;
		}

		try {
			requestState.setLoading();

			const updateData: any = {
				email: formData.email,
			};

			// Solo agregar campos opcionales si tienen valor
			if (formData.phone) {
				updateData.phone = formData.phone;
			}
			if (formData.documentNumber) {
				updateData.documentNumber = formData.documentNumber;
			}

			console.log('📤 Enviando updateData (user):', updateData);
			await profileService.updateUserProfile(updateData);

			requestState.setSuccess();
			toast.success('Información personal actualizada', 'Éxito');
			setTimeout(() => {
				const newOriginal = { ...originalData };
				newOriginal.email = formData.email;
				newOriginal.phone = formData.phone;
				newOriginal.documentNumber = formData.documentNumber;
				setOriginalData(newOriginal);
				requestState.reset();
			}, 1500);
		} catch (error) {
			const errorMsg =
				error instanceof Error ? error.message : 'Error al actualizar el perfil';
			requestState.setError(errorMsg);
			toast.error(errorMsg, 'Error al guardar');
		}
	};

	const handleSaveEstablishmentChanges = async () => {
		if (!formData.name) {
			const msg = 'El nombre del establecimiento es obligatorio';
			requestState.setError(msg);
			toast.warning(msg, 'Campo requerido');
			return;
		}

		if (!formData.address) {
			const msg = 'La dirección es obligatoria';
			requestState.setError(msg);
			toast.warning(msg, 'Campo requerido');
			return;
		}

		try {
			requestState.setLoading();

			const updateData: any = {
				name: formData.name,
				address: formData.address,
			};

			// Solo agregar campos opcionales si tienen valor
			if (formData.description) {
				updateData.description = formData.description;
			}
			if (formData.neighborhood) {
				updateData.neighborhood = formData.neighborhood;
			}
			if (formData.establishmentType) {
				updateData.establishmentType = formData.establishmentType;
			}
			if (formData.cityId) {
				updateData.cityId = formData.cityId;
			}

			// Agregar ubicación verificada si existe
			if (verifiedLocation) {
				updateData.location = verifiedLocation.location;
				console.log('📍 [EDIT_PROFILE] Including verified location:', verifiedLocation);
			}

			console.log('📤 Enviando updateData:', updateData);
			await profileService.updateEstablishmentProfile(updateData);

			requestState.setSuccess();
			toast.success('Información del establecimiento actualizada', 'Éxito');
			setTimeout(() => {
				const newOriginal = { ...originalData };
				newOriginal.name = formData.name;
				newOriginal.description = formData.description;
				newOriginal.address = formData.address;
				newOriginal.neighborhood = formData.neighborhood;
				newOriginal.establishmentType = formData.establishmentType;
				newOriginal.cityId = formData.cityId;
				setOriginalData(newOriginal);
				requestState.reset();
			}, 1500);
		} catch (error) {
			const errorMsg =
				error instanceof Error ? error.message : 'Error al actualizar el perfil';
			requestState.setError(errorMsg);
			toast.error(errorMsg, 'Error al guardar');
		}
	};

	const handleCancel = () => {
		if (userProfile && establishment) {
			setFormData(originalData);
			requestState.reset();
		}
	};

	if (loading) {
		return (
			<View style={styles.centerContainer}>
				<ActivityIndicator size="large" color="#3CA55C" />
				<Text style={styles.loadingText}>Cargando perfil...</Text>
			</View>
		);
	}

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={styles.container}
		>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.header}>
					<Text style={styles.title}>Editar Perfil</Text>
					<Text style={styles.subtitle}>
						Actualiza la información de tu establecimiento
					</Text>
				</View>

				<FeedbackMessage
					type="error"
					message={requestState.error || ''}
					visible={!!requestState.error}
				/>
				<FeedbackMessage
					type="success"
					message="Cambios guardados exitosamente"
					visible={requestState.success}
				/>

				{/* Sección: Información del Usuario */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>👤 Información Personal</Text>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Email *</Text>
						<TextInput
							style={[styles.input, hasChanges('email') && styles.inputModified]}
							placeholder="correo@ejemplo.com"
							value={formData.email}
							onChangeText={(value) => handleInputChange('email', value)}
							keyboardType="email-address"
							editable={!requestState.loading}
						/>
						{hasChanges('email') && (
							<Text style={styles.modifiedBadge}>● MODIFICADO</Text>
						)}
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Teléfono</Text>
						<TextInput
							style={[styles.input, hasChanges('phone') && styles.inputModified]}
							placeholder="+34 912 345 678"
							value={formData.phone}
							onChangeText={(value) => handleInputChange('phone', value)}
							keyboardType="phone-pad"
							editable={!requestState.loading}
						/>
						{hasChanges('phone') && (
							<Text style={styles.modifiedBadge}>● MODIFICADO</Text>
						)}
					</View>

					<View style={styles.row}>
						<View style={[styles.inputGroup, styles.halfWidth]}>
							<Text style={styles.label}>Nombre de Usuario</Text>
							<TextInput
								style={[styles.input, hasChanges('username') && styles.inputModified]}
								placeholder="usuario"
								value={formData.username}
								onChangeText={(value) => handleInputChange('username', value)}
								editable={!requestState.loading}
							/>
							{hasChanges('username') && <Text style={styles.modifiedBadge}>● MOD.</Text>}
						</View>

						<View style={[styles.inputGroup, styles.halfWidth]}>
							<Text style={styles.label}>Documento</Text>
							<TextInput
								style={[
									styles.input,
									hasChanges('documentNumber') && styles.inputModified,
								]}
								placeholder="123456789"
								value={formData.documentNumber}
								onChangeText={(value) => handleInputChange('documentNumber', value)}
								editable={!requestState.loading}
							/>
							{hasChanges('documentNumber') && (
								<Text style={styles.modifiedBadge}>● MOD.</Text>
							)}
						</View>
					</View>

					{hasUserChanges() && (
						<TouchableOpacity
							style={[styles.sectionSaveButton]}
							onPress={handleSaveUserChanges}
							disabled={requestState.loading}
						>
							{requestState.loading ? (
								<ActivityIndicator color="#FFFFFF" size="small" />
							) : (
								<Text style={styles.sectionSaveButtonText}>💾 Guardar cambios</Text>
							)}
						</TouchableOpacity>
					)}
				</View>

				{/* Sección: Información del Establecimiento */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>🏪 Información del Establecimiento</Text>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Nombre del Establecimiento *</Text>
						<TextInput
							style={[styles.input, hasChanges('name') && styles.inputModified]}
							placeholder="Ej: Panadería Central"
							value={formData.name}
							onChangeText={(value) => handleInputChange('name', value)}
							editable={!requestState.loading}
						/>
						{hasChanges('name') && <Text style={styles.modifiedBadge}>● MODIFICADO</Text>}
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Descripción</Text>
						<TextInput
							style={[
								styles.input,
								styles.multilineInput,
								hasChanges('description') && styles.inputModified,
							]}
							placeholder="Cuéntanos sobre tu establecimiento..."
							value={formData.description}
							onChangeText={(value) => handleInputChange('description', value)}
							multiline
							numberOfLines={4}
							textAlignVertical="top"
							editable={!requestState.loading}
						/>
						{hasChanges('description') && (
							<Text style={styles.modifiedBadge}>● MOD.</Text>
						)}
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Dirección *</Text>
						<TextInput
							style={[styles.input, hasChanges('address') && styles.inputModified]}
							placeholder="Calle Principal 123, Apartado 5"
							value={formData.address}
							onChangeText={(value) => handleInputChange('address', value)}
							editable={!requestState.loading}
						/>
						{hasChanges('address') && (
							<Text style={styles.modifiedBadge}>● MODIFICADO</Text>
						)}

						{/* Botón para verificar dirección con Google Maps */}
						<TouchableOpacity
							onPress={() => setShowAddressVerification(true)}
							disabled={!formData.address.trim() || requestState.loading}
							style={{
								backgroundColor: verifiedLocation ? '#4caf50' : '#2196f3',
								paddingVertical: 10,
								paddingHorizontal: 12,
								borderRadius: 8,
								marginTop: 8,
								opacity: !formData.address.trim() || requestState.loading ? 0.6 : 1,
							}}
						>
							<Text
								style={{
									color: '#fff',
									textAlign: 'center',
									fontWeight: '600',
									fontSize: 13,
								}}
							>
								{verifiedLocation ? '✓ Dirección verificada' : '📍 Verificar dirección'}
							</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Ciudad *</Text>
						<TouchableOpacity
							style={[
								styles.input,
								hasChanges('cityId') && styles.inputModified,
								{ justifyContent: 'center' },
							]}
							onPress={() => setShowDepartmentModal(true)}
							disabled={requestState.loading}
						>
							<Text style={{ color: cityName ? '#333' : '#999', fontSize: 14 }}>
								{cityName || 'Selecciona una ciudad'}
							</Text>
						</TouchableOpacity>
						{hasChanges('cityId') && (
							<Text style={styles.modifiedBadge}>● MODIFICADO</Text>
						)}
					</View>

					<View style={styles.row}>
						<View style={[styles.inputGroup, styles.halfWidth]}>
							<Text style={styles.label}>Barrio/Zona</Text>
							<TextInput
								style={[styles.input, hasChanges('neighborhood') && styles.inputModified]}
								placeholder="Ej: Centro"
								value={formData.neighborhood}
								onChangeText={(value) => handleInputChange('neighborhood', value)}
								editable={!requestState.loading}
							/>
							{hasChanges('neighborhood') && (
								<Text style={styles.modifiedBadge}>● MOD.</Text>
							)}
						</View>

						<View style={[styles.inputGroup, styles.halfWidth]}>
							<Text style={styles.label}>Tipo de Establecimiento</Text>
							<TouchableOpacity
								style={[
									styles.pickerButton,
									hasChanges('establishmentType') && styles.pickerButtonModified,
								]}
								onPress={() => setShowEstablishmentTypePicker(true)}
								disabled={requestState.loading}
							>
								<Text
									style={[
										styles.pickerButtonText,
										!formData.establishmentType && styles.pickerButtonPlaceholder,
									]}
								>
									{formData.establishmentType
										? getEstablishmentTypeLabel(formData.establishmentType)
										: 'Seleccionar tipo'}
								</Text>
								<Text style={styles.pickerArrow}>▼</Text>
							</TouchableOpacity>
							{hasChanges('establishmentType') && (
								<Text style={styles.modifiedBadge}>● MOD.</Text>
							)}
						</View>
					</View>

					{hasEstablishmentChanges() && (
						<TouchableOpacity
							style={[styles.sectionSaveButton]}
							onPress={handleSaveEstablishmentChanges}
							disabled={requestState.loading}
						>
							{requestState.loading ? (
								<ActivityIndicator color="#FFFFFF" size="small" />
							) : (
								<Text style={styles.sectionSaveButtonText}>💾 Guardar cambios</Text>
							)}
						</TouchableOpacity>
					)}
				</View>

				{/* Botones de Acción Eliminados - Los botones aparecer dentro de cada sección */}
				<View style={{ height: Spacing.xl }} />
			</ScrollView>

			{/* Modal para seleccionar tipo de establecimiento */}
			<Modal
				visible={showEstablishmentTypePicker}
				transparent
				animationType="slide"
				onRequestClose={() => setShowEstablishmentTypePicker(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<View style={styles.modalHeader}>
							<Text style={styles.modalTitle}>Tipo de Establecimiento</Text>
							<TouchableOpacity
								style={styles.modalCloseButton}
								onPress={() => setShowEstablishmentTypePicker(false)}
							>
								<Text style={styles.modalCloseText}>✕</Text>
							</TouchableOpacity>
						</View>

						<ScrollView style={styles.modalOptions}>
							{getEstablishmentTypeOptions().map((option) => (
								<TouchableOpacity
									key={option.value}
									style={[
										styles.modalOption,
										formData.establishmentType === option.value &&
											styles.modalOptionSelected,
									]}
									onPress={() => {
										handleInputChange('establishmentType', option.value);
										setShowEstablishmentTypePicker(false);
									}}
								>
									<Text
										style={[
											styles.modalOptionText,
											formData.establishmentType === option.value &&
												styles.modalOptionSelectedText,
										]}
									>
										{option.label}
									</Text>
								</TouchableOpacity>
							))}
						</ScrollView>
					</View>
				</View>
			</Modal>

			{/* Modal de Selección de Departamento */}
			<Modal
				visible={showDepartmentModal}
				transparent
				animationType="slide"
				onRequestClose={() => setShowDepartmentModal(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<View style={styles.modalHeader}>
							<Text style={styles.modalTitle}>Selecciona un Departamento</Text>
							<TouchableOpacity
								style={styles.modalCloseButton}
								onPress={() => setShowDepartmentModal(false)}
							>
								<Text style={styles.modalCloseText}>✕</Text>
							</TouchableOpacity>
						</View>

						{loadingDepartments ? (
							<ActivityIndicator
								size="large"
								color="#2e7d32"
								style={{ marginVertical: 20 }}
							/>
						) : (
							<ScrollView style={styles.modalOptions}>
								{departments.map((dept) => (
									<TouchableOpacity
										key={dept.departmentId}
										style={[
											styles.modalOption,
											selectedDepartment?.departmentId === dept.departmentId &&
												styles.modalOptionSelected,
										]}
										onPress={() => {
											loadCitiesByDepartment(dept);
											setShowDepartmentModal(false);
											setShowCityModal(true);
										}}
									>
										<Text
											style={[
												styles.modalOptionText,
												selectedDepartment?.departmentId === dept.departmentId &&
													styles.modalOptionSelectedText,
											]}
										>
											{dept.name}
										</Text>
									</TouchableOpacity>
								))}
							</ScrollView>
						)}
					</View>
				</View>
			</Modal>

			{/* Modal de Selección de Ciudad */}
			<Modal
				visible={showCityModal}
				transparent
				animationType="slide"
				onRequestClose={() => setShowCityModal(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<View style={styles.modalHeader}>
							<Text style={styles.modalTitle}>
								Selecciona una Ciudad
								{selectedDepartment && ` - ${selectedDepartment.name}`}
							</Text>
							<TouchableOpacity
								style={styles.modalCloseButton}
								onPress={() => setShowCityModal(false)}
							>
								<Text style={styles.modalCloseText}>✕</Text>
							</TouchableOpacity>
						</View>

						{loadingCities ? (
							<ActivityIndicator
								size="large"
								color="#2e7d32"
								style={{ marginVertical: 20 }}
							/>
						) : (
							<>
								<ScrollView style={styles.modalOptions}>
									{cities.map((city) => (
										<TouchableOpacity
											key={city.cityId}
											style={[
												styles.modalOption,
												formData.cityId === city.cityId && styles.modalOptionSelected,
											]}
											onPress={() => handleSelectCity(city)}
										>
											<Text
												style={[
													styles.modalOptionText,
													formData.cityId === city.cityId &&
														styles.modalOptionSelectedText,
												]}
											>
												{city.name}
											</Text>
										</TouchableOpacity>
									))}
								</ScrollView>
								<TouchableOpacity
									style={{
										padding: 15,
										backgroundColor: '#f5f5f5',
										borderTopWidth: 1,
										borderTopColor: '#ddd',
									}}
									onPress={() => {
										setShowCityModal(false);
										setShowDepartmentModal(true);
									}}
								>
									<Text style={{ textAlign: 'center', color: '#2e7d32' }}>
										← Volver a Departamentos
									</Text>
								</TouchableOpacity>
							</>
						)}
					</View>
				</View>
			</Modal>

			{/* Modal de verificación de dirección */}
			<AddressVerificationModal
				visible={showAddressVerification}
				address={formData.address}
				city={cityName || 'Bogotá'}
				onConfirm={handleAddressVerified}
				onCancel={() => setShowAddressVerification(false)}
			/>
		</KeyboardAvoidingView>
	);
}

// Importar Spacing para el espaciado final
import { Spacing } from '../styles/global';
