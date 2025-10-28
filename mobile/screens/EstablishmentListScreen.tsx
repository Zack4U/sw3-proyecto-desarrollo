import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
	establishmentService,
	EstablishmentResponse,
} from '../services/establishmentService';
import { styles } from '../styles/EstablishmentListScreenStyle';
import { FeedbackMessage, Card, Input } from '../components';

type RootStackParamList = {
	Home: undefined;
	EstablishmentList: undefined;
};

type Props = {
	navigation: NativeStackNavigationProp<RootStackParamList, 'EstablishmentList'>;
};

export default function EstablishmentListScreen({ navigation }: Readonly<Props>) {
	const [establishments, setEstablishments] = useState<EstablishmentResponse[]>([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);
	const [limit] = useState(10); // Puedes ajustar el tamaño de página aquí

	useEffect(() => {
		setLoading(true);
		establishmentService
			.getPaginated(page, limit)
			.then((res) => {
				setEstablishments(res.data);
				setTotal(res.total);
			})
			.catch((err) => setError(err.message))
			.finally(() => setLoading(false));
	}, [page, limit]);

	const filteredEstablishments = establishments.filter((est) =>
		est.name.toLowerCase().includes(search.toLowerCase())
	);

	const renderHeader = useCallback(
		() => (
			<View>
				<View style={styles.header}>
					<Text style={styles.title}>Establecimientos Registrados</Text>
					<Text style={styles.subtitle}>Lista de puntos de donación</Text>
				</View>

				<View style={styles.filtersContainer}>
					<Input
						label="Buscar"
						labelStyle={styles.label}
						placeholder="Buscar por nombre..."
						value={search}
						onChangeText={setSearch}
						style={styles.input}
					/>
				</View>

				{loading && (
					<FeedbackMessage
						type="loading"
						message="Cargando establecimientos..."
						visible={true}
					/>
				)}

				{error && <FeedbackMessage type="error" message={error} visible={true} />}
			</View>
		),
		[search, loading, error]
	);

	const renderFooter = useCallback(
		() => (
			<View>
				<View style={styles.paginationContainer}>
					<Text style={styles.paginationInfo}>
						Página {page} de {Math.ceil(total / limit) || 1}
					</Text>
				</View>
				<View style={styles.paginationContainer}>
					<Pressable
						style={[
							styles.paginationButton,
							page <= 1 && styles.paginationButtonDisabled,
						]}
						onPress={() => page > 1 && setPage(page - 1)}
						disabled={page <= 1}
					>
						<Text style={styles.paginationText}>Anterior</Text>
					</Pressable>
					<Pressable
						style={[
							styles.paginationButton,
							page >= Math.ceil(total / limit) && styles.paginationButtonDisabled,
						]}
						onPress={() => page < Math.ceil(total / limit) && setPage(page + 1)}
						disabled={page >= Math.ceil(total / limit)}
					>
						<Text style={styles.paginationText}>Siguiente</Text>
					</Pressable>
				</View>
			</View>
		),
		[page, total, limit]
	);

	return (
		<View style={styles.container}>
			<FlatList
				data={filteredEstablishments}
				keyExtractor={(item) => item.establishmentId}
				renderItem={({ item }) => (
					<Card style={styles.card}>
						<Text style={{ fontSize: 28, marginBottom: 8 }}>🏢</Text>
						<Text style={styles.name}>{item.name}</Text>
						<Text style={styles.address}>{item.address}</Text>
						<Text style={styles.type}>{item.establishmentType}</Text>
						<View style={styles.divider} />
					</Card>
				)}
				contentContainerStyle={styles.list}
				ListHeaderComponent={renderHeader}
				ListFooterComponent={renderFooter}
				ListEmptyComponent={
					loading ? null : (
						<View style={{ padding: 16 }}>
							<Text style={{ textAlign: 'center', color: '#666' }}>
								No se encontraron establecimientos.
							</Text>
						</View>
					)
				}
			/>
		</View>
	);
}
