import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView,
	ActivityIndicator,
	Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { foodService } from '../services/foodService';
import { styles } from '../styles/FoodRegistrationScreenStyle';
import { FeedbackMessage } from '../components';
import { useRequestState } from '../hooks/useRequestState';
import { useAuth } from '../hooks/useAuth';

type RootStackParamList = {
	FoodEdit: { foodId: string };
};

type Props = {
	navigation: NativeStackNavigationProp<any>;
	route: RouteProp<RootStackParamList, 'FoodEdit'>;
};

export default function FoodEditScreen({ navigation, route }: Readonly<Props>) {
	const { foodId } = route.params;
	const [initialLoading, setInitialLoading] = useState(true);
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		category: '',
		quantity: '',
		unitOfMeasure: '',
		expiresAt: '',
	});

	// keep the establishmentId from the loaded food in case auth user doesn't have it
	const [foodEstablishmentId, setFoodEstablishmentId] = useState<string | null>(null);

	const requestState = useRequestState();
	const { user } = useAuth();

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const data = await foodService.getById(foodId);
				if (!mounted) return;
				setFormData({
					name: data.name,
					description: data.description || '',
					category: data.category,
					quantity: String(data.quantity),
					unitOfMeasure: data.unitOfMeasure,
					expiresAt: data.expiresAt.split('T')[0],
				});
				setFoodEstablishmentId(data.establishmentId || null);
			} catch (err) {
				console.error(err);
				Alert.alert(
					'Error',
					err instanceof Error ? err.message : 'Error al cargar alimento'
				);
				navigation.goBack();
			} finally {
				setInitialLoading(false);
			}
		})();

		return () => {
			mounted = false;
		};
	}, [foodId]);

	const handleInputChange = (field: string, value: string) => {
		setFormData({ ...formData, [field]: value });
		if (requestState.error || requestState.success) requestState.reset();
	};

	const handleUpdate = async () => {
		// basic validation similar to registration
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

		const quantity = Number.parseFloat(formData.quantity);
		if (Number.isNaN(quantity) || quantity <= 0) {
			requestState.setError('La cantidad debe ser un número positivo');
			return;
		}

		requestState.setLoading();
		try {
			// prepare payload, include establishmentId only if defined (avoid null)
			const estId = user?.establishmentId ?? foodEstablishmentId ?? undefined;
			const payload: any = {
				name: formData.name,
				description: formData.description,
				category: formData.category,
				quantity: quantity,
				unitOfMeasure: formData.unitOfMeasure,
				expiresAt: formData.expiresAt,
			};
			if (estId) payload.establishmentId = estId;

			await foodService.update(foodId, payload);
			requestState.setSuccess();
			setTimeout(() => navigation.goBack(), 1000);
		} catch (err) {
			requestState.setError(err instanceof Error ? err.message : 'Error al actualizar');
		}
	};

	const handleDelete = () => {
		Alert.alert('Confirmar', '¿Deseas eliminar este alimento?', [
			{ text: 'Cancelar', style: 'cancel' },
			{
				text: 'Eliminar',
				style: 'destructive',
				onPress: async () => {
					try {
						requestState.setLoading();
						await foodService.delete(foodId);
						requestState.setSuccess();
						setTimeout(() => navigation.navigate('FoodManagement'), 500);
					} catch (err) {
						requestState.setError(
							err instanceof Error ? err.message : 'Error al eliminar'
						);
					}
				},
			},
		]);
	};

	if (initialLoading) {
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.title}>Editar Alimento</Text>
				</View>
				<View style={{ padding: 16 }}>
					<ActivityIndicator />
				</View>
			</View>
		);
	}

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={{ paddingBottom: 32 }}
			keyboardShouldPersistTaps="handled"
			nestedScrollEnabled
		>
			<View style={styles.header}>
				<Text style={styles.title}>Editar Alimento</Text>
				<Text style={styles.subtitle}>Modifica los datos del alimento</Text>
			</View>

			<View style={styles.form}>
				{requestState.loading && (
					<FeedbackMessage type="loading" message="Actualizando..." visible={true} />
				)}
				{requestState.success && (
					<FeedbackMessage type="success" message="Actualizado" visible={true} />
				)}
				{requestState.error && (
					<FeedbackMessage type="error" message={requestState.error} visible={true} />
				)}

				<View style={styles.inputGroup}>
					<Text style={styles.label}>Nombre del Alimento</Text>
					<TextInput
						style={styles.input}
						value={formData.name}
						onChangeText={(v) => handleInputChange('name', v)}
					/>
				</View>

				<View style={styles.inputGroup}>
					<Text style={styles.label}>Descripción</Text>
					<TextInput
						style={styles.textArea}
						value={formData.description}
						onChangeText={(v) => handleInputChange('description', v)}
						multiline
						numberOfLines={3}
					/>
				</View>

				<View style={styles.inputGroup}>
					<Text style={styles.label}>Categoría</Text>
					{/* reuse simple picker UI from registration screen */}
					<TouchableOpacity
						onPress={() => {
							/* for brevity reuse simple text input behavior */
						}}
					>
						<TextInput
							style={styles.input}
							value={formData.category}
							onChangeText={(v) => handleInputChange('category', v)}
						/>
					</TouchableOpacity>
				</View>

				<View style={styles.row}>
					<View style={[styles.inputGroup, styles.halfWidth]}>
						<Text style={styles.label}>Cantidad</Text>
						<TextInput
							style={styles.input}
							value={formData.quantity}
							onChangeText={(v) => handleInputChange('quantity', v)}
							keyboardType="numeric"
						/>
					</View>
					<View style={[styles.inputGroup, styles.halfWidth]}>
						<Text style={styles.label}>Unidad</Text>
						<TextInput
							style={styles.input}
							value={formData.unitOfMeasure}
							onChangeText={(v) => handleInputChange('unitOfMeasure', v)}
						/>
					</View>
				</View>

				<View style={styles.inputGroup}>
					<Text style={styles.label}>Fecha de Expiración</Text>
					<TextInput
						style={styles.input}
						value={formData.expiresAt}
						onChangeText={(v) => handleInputChange('expiresAt', v)}
					/>
				</View>

				<TouchableOpacity
					style={[
						styles.submitButton,
						requestState.loading && styles.submitButtonDisabled,
					]}
					onPress={handleUpdate}
					disabled={requestState.loading}
				>
					{requestState.loading ? (
						<ActivityIndicator color="white" />
					) : (
						<Text style={styles.submitButtonText}>Actualizar</Text>
					)}
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.cancelButton}
					onPress={handleDelete}
					disabled={requestState.loading}
				>
					<Text style={styles.cancelButtonText}>Eliminar Alimento</Text>
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
