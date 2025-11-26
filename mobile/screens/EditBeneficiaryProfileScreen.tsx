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
import { profileService, UserProfile } from '../services/profileService';
import { FeedbackMessage } from '../components';
import { styles } from '../styles/EditEstablishmentProfileScreenStyle'; // Reusing styles
import { useToast } from '../hooks/useToast';

type RootStackParamList = {
	Home: undefined;
	EditBeneficiaryProfile: undefined;
	Login: undefined;
};

type Props = {
	navigation: NativeStackNavigationProp<RootStackParamList, 'EditBeneficiaryProfile'>;
};

// Constantes para tipos de documento
const DOCUMENT_TYPES = [
	{ label: 'Cédula de Ciudadanía', value: 'CC' },
	{ label: 'Tarjeta de Identidad', value: 'TI' },
	{ label: 'Cédula de Extranjería', value: 'CE' },
	{ label: 'Registro Civil', value: 'RC' },
	{ label: 'Pasaporte', value: 'PAS' },
	{ label: 'Permiso de Permanencia', value: 'PPT' },
];

export default function EditBeneficiaryProfileScreen({ navigation }: Readonly<Props>) {
	const { user, logout } = useAuth();
	const requestState = useRequestState();
	const toast = useToast();

	const [loading, setLoading] = useState(true);
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

	// Guardar datos originales para comparación
	const [originalData, setOriginalData] = useState({
		email: '',
		phone: '',
		username: '',
		name: '',
		lastName: '',
		documentNumber: '',
		documentType: '',
	});

	// Campos editables
	const [formData, setFormData] = useState({
		email: '',
		phone: '',
		username: '',
		name: '',
		lastName: '',
		documentNumber: '',
		documentType: '',
	});

	const [showDocumentTypeModal, setShowDocumentTypeModal] = useState(false);

	useEffect(() => {
		loadProfile();
	}, []);

	const loadProfile = async () => {
		try {
			setLoading(true);
			const data = await profileService.getUserProfile();

			const initialData = {
				email: data.user.email || '',
				phone: data.user.phone || '',
				username: data.user.username || '',
				name: (data.user as any).name || '', // Assuming name is in user object for beneficiary
				lastName: (data.user as any).lastName || '', // Assuming lastName is in user object for beneficiary
				documentNumber: data.user.documentNumber || '',
				documentType: data.user.documentType || '',
			};

			setUserProfile(data.user);
			setFormData(initialData);
			setOriginalData(initialData);
			setLoading(false);
		} catch (error) {
			const errorMsg =
				error instanceof Error ? error.message : 'Error al cargar el perfil';
			requestState.setError(errorMsg);
			toast.error(errorMsg, 'Error de carga');
			setLoading(false);
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

	const handleSave = async () => {
		if (!formData.email) {
			toast.warning('El email es obligatorio', 'Campo requerido');
			return;
		}

		if (!formData.name) {
			toast.warning('El nombre es obligatorio', 'Campo requerido');
			return;
		}

		if (!formData.lastName) {
			toast.warning('El apellido es obligatorio', 'Campo requerido');
			return;
		}

		try {
			requestState.setLoading();

			const updateData: any = {
				email: formData.email,
				name: formData.name,
				lastName: formData.lastName,
			};

			if (formData.phone) updateData.phone = formData.phone;
			if (formData.username) updateData.username = formData.username;
			if (formData.documentNumber) updateData.documentNumber = formData.documentNumber;
			if (formData.documentType) updateData.documentType = formData.documentType;

			await profileService.updateUserProfile(updateData);

			requestState.setSuccess();
			toast.success('Perfil actualizado correctamente', 'Éxito');

			setTimeout(() => {
				setOriginalData({ ...formData });
				requestState.reset();
			}, 1500);
		} catch (error) {
			const errorMsg =
				error instanceof Error ? error.message : 'Error al actualizar el perfil';
			requestState.setError(errorMsg);
			toast.error(errorMsg, 'Error al guardar');
		}
	};

	const handleDeleteAccount = () => {
		Alert.alert(
			'Eliminar Cuenta',
			'¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.',
			[
				{
					text: 'Cancelar',
					style: 'cancel',
				},
				{
					text: 'Eliminar',
					style: 'destructive',
					onPress: async () => {
						try {
							setLoading(true);
							await profileService.deleteAccount();
							await logout();
							// Navigation to Login/Welcome handled by AuthContext/App.tsx
						} catch (error) {
							const errorMsg =
								error instanceof Error ? error.message : 'Error al eliminar la cuenta';
							toast.error(errorMsg, 'Error');
							setLoading(false);
						}
					},
				},
			]
		);
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
					<Text style={styles.subtitle}>Actualiza tu información personal</Text>
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

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>👤 Información Personal</Text>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Email *</Text>
						<TextInput
							style={[styles.input, hasChanges('email') && styles.inputModified]}
							value={formData.email}
							onChangeText={(value) => handleInputChange('email', value)}
							keyboardType="email-address"
							editable={!requestState.loading}
						/>
					</View>

					<View style={styles.row}>
						<View style={[styles.inputGroup, styles.halfWidth]}>
							<Text style={styles.label}>Nombre *</Text>
							<TextInput
								style={[styles.input, hasChanges('name') && styles.inputModified]}
								value={formData.name}
								onChangeText={(value) => handleInputChange('name', value)}
								editable={!requestState.loading}
							/>
						</View>
						<View style={[styles.inputGroup, styles.halfWidth]}>
							<Text style={styles.label}>Apellido *</Text>
							<TextInput
								style={[styles.input, hasChanges('lastName') && styles.inputModified]}
								value={formData.lastName}
								onChangeText={(value) => handleInputChange('lastName', value)}
								editable={!requestState.loading}
							/>
						</View>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Teléfono</Text>
						<TextInput
							style={[styles.input, hasChanges('phone') && styles.inputModified]}
							value={formData.phone}
							onChangeText={(value) => handleInputChange('phone', value)}
							keyboardType="phone-pad"
							editable={!requestState.loading}
						/>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Usuario</Text>
						<TextInput
							style={[styles.input, hasChanges('username') && styles.inputModified]}
							value={formData.username}
							onChangeText={(value) => handleInputChange('username', value)}
							editable={!requestState.loading}
						/>
					</View>

					<View style={styles.row}>
						<View style={[styles.inputGroup, styles.halfWidth]}>
							<Text style={styles.label}>Tipo Documento</Text>
							<TouchableOpacity
								style={[
									styles.pickerButton,
									hasChanges('documentType') && styles.pickerButtonModified,
								]}
								onPress={() => setShowDocumentTypeModal(true)}
								disabled={requestState.loading}
							>
								<Text style={styles.pickerButtonText}>
									{DOCUMENT_TYPES.find((d) => d.value === formData.documentType)?.label ||
										formData.documentType ||
										'Seleccionar'}
								</Text>
							</TouchableOpacity>
						</View>
						<View style={[styles.inputGroup, styles.halfWidth]}>
							<Text style={styles.label}>Número Documento</Text>
							<TextInput
								style={[
									styles.input,
									hasChanges('documentNumber') && styles.inputModified,
								]}
								value={formData.documentNumber}
								onChangeText={(value) => handleInputChange('documentNumber', value)}
								editable={!requestState.loading}
								keyboardType="numeric"
							/>
						</View>
					</View>

					{hasAnyChanges() && (
						<TouchableOpacity
							style={styles.sectionSaveButton}
							onPress={handleSave}
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

				<View
					style={[
						styles.section,
						{ marginTop: 20, borderColor: '#ffcdd2', backgroundColor: '#ffebee' },
					]}
				>
					<Text style={[styles.sectionTitle, { color: '#d32f2f' }]}>
						⚠️ Zona de Peligro
					</Text>
					<Text style={{ color: '#d32f2f', marginBottom: 15 }}>
						Si eliminas tu cuenta, perderás acceso a todos tus datos y no podrás
						recuperarlos.
					</Text>
					<TouchableOpacity
						style={{
							backgroundColor: '#d32f2f',
							padding: 15,
							borderRadius: 8,
							alignItems: 'center',
						}}
						onPress={handleDeleteAccount}
						disabled={requestState.loading}
					>
						<Text style={{ color: 'white', fontWeight: 'bold' }}>🗑️ Eliminar Cuenta</Text>
					</TouchableOpacity>
				</View>

				<View style={{ height: 50 }} />
			</ScrollView>

			{/* Modal Tipo Documento */}
			<Modal
				visible={showDocumentTypeModal}
				transparent
				animationType="slide"
				onRequestClose={() => setShowDocumentTypeModal(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<View style={styles.modalHeader}>
							<Text style={styles.modalTitle}>Tipo de Documento</Text>
							<TouchableOpacity
								style={styles.modalCloseButton}
								onPress={() => setShowDocumentTypeModal(false)}
							>
								<Text style={styles.modalCloseText}>✕</Text>
							</TouchableOpacity>
						</View>
						<ScrollView style={styles.modalOptions}>
							{DOCUMENT_TYPES.map((option) => (
								<TouchableOpacity
									key={option.value}
									style={[
										styles.modalOption,
										formData.documentType === option.value && styles.modalOptionSelected,
									]}
									onPress={() => {
										handleInputChange('documentType', option.value);
										setShowDocumentTypeModal(false);
									}}
								>
									<Text
										style={[
											styles.modalOptionText,
											formData.documentType === option.value &&
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
		</KeyboardAvoidingView>
	);
}
