import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { foodService, FoodResponse } from '../services/foodService';
import { establishmentService } from '../services/establishmentService';
import { styles } from '../styles/EstablishmentListScreenStyle';
import { Card, FeedbackMessage } from '../components';
import { useAuth } from '../hooks/useAuth';

type RootStackParamList = {
	FoodManagement: undefined;
	FoodEdit: { foodId: string } | undefined;
};

type Props = {
	navigation: NativeStackNavigationProp<RootStackParamList, 'FoodManagement'>;
};

export default function FoodManagementScreen({ navigation }: Readonly<Props>) {
	const { user } = useAuth();
	const [foods, setFoods] = useState<FoodResponse[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchFoods = useCallback(async () => {
		// Determine which establishmentId to use: prefer the one in the authenticated user,
		// otherwise try to resolve it by querying establishments belonging to the user.
		let establishmentId = user?.establishmentId;
		if (!establishmentId && user?.userId) {
			try {
				// try fetching a batch of establishments and find one that belongs to this user
				const paginated = await establishmentService.getPaginated(1, 100);
				const mine = paginated.data.find((e) => e.userId === user.userId);
				if (mine) {
					establishmentId = mine.establishmentId;
				}
			} catch (err) {
				console.debug('No se pudo resolver establishmentId desde establishments:', err);
			}
		}

		if (!establishmentId) return;
		setLoading(true);
		setError(null);
		try {
			const res = await foodService.getByEstablishment(establishmentId);
			setFoods(res);
		} catch (err) {
			console.error(err);
			setError(err instanceof Error ? err.message : 'Error al cargar alimentos');
		} finally {
			setLoading(false);
		}
	}, [user?.establishmentId, user?.userId]);

	useEffect(() => {
		fetchFoods();
	}, [fetchFoods]);

	const handleDelete = (id: string) => {
		Alert.alert('Confirmar', '¿Deseas eliminar este alimento?', [
			{ text: 'Cancelar', style: 'cancel' },
			{
				text: 'Eliminar',
				style: 'destructive',
				onPress: async () => {
					try {
						setLoading(true);
						await foodService.delete(id);
						await fetchFoods();
					} catch (err) {
						setError(err instanceof Error ? err.message : 'Error al eliminar');
					} finally {
						setLoading(false);
					}
				},
			},
		]);
	};

	const renderItem = ({ item }: { item: FoodResponse }) => (
		<Card style={styles.card}>
			<Text style={{ fontSize: 28, marginBottom: 8 }}>🍽️</Text>
			<Text style={styles.name}>{item.name}</Text>
			<Text style={styles.address}>{item.description}</Text>
			<Text style={styles.type}>
				{item.category} • {item.quantity} {item.unitOfMeasure}
			</Text>
			<View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
				<TouchableOpacity
					style={[styles.paginationButton]}
					onPress={() => navigation.navigate('FoodEdit', { foodId: item.foodId })}
				>
					<Text style={styles.paginationText}>Editar</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.paginationButton, styles.paginationButtonDisabled]}
					onPress={() => handleDelete(item.foodId)}
				>
					<Text style={styles.paginationText}>Eliminar</Text>
				</TouchableOpacity>
			</View>
		</Card>
	);

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Administrar Alimentos</Text>
				<Text style={styles.subtitle}>Actualiza o elimina los alimentos publicados</Text>
			</View>

			<View style={{ paddingHorizontal: 16 }}>
				{loading && (
					<FeedbackMessage type="loading" message="Cargando..." visible={true} />
				)}
				{error && <FeedbackMessage type="error" message={error} visible={true} />}
			</View>

			<FlatList
				data={foods}
				keyExtractor={(i, index) => (i.foodId ? String(i.foodId) : String(index))}
				renderItem={renderItem}
				contentContainerStyle={styles.list}
				ListEmptyComponent={
					loading ? null : (
						<View style={{ padding: 16 }}>
							<Text style={{ textAlign: 'center', color: '#666' }}>
								No hay alimentos registrados.
							</Text>
						</View>
					)
				}
			/>
		</View>
	);
}
