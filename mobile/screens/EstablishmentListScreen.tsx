import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { establishmentService, EstablishmentResponse } from '../services/establishmentService';
import { styles } from '../styles/EstablishmentListScreenStyle';
import { FeedbackMessage, Card, Input } from '../components';
import { GlobalStyles } from '../styles/global';

type RootStackParamList = {
    Home: undefined;
    EstablishmentList: undefined;
};

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'EstablishmentList'>;
};

export default function EstablishmentListScreen({ navigation }: Readonly<Props>) {
    const [establishments, setEstablishments] = useState<EstablishmentResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        establishmentService.getAll()
            .then(data => setEstablishments(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const filteredEstablishments = establishments.filter(est =>
        est.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <ScrollView style={styles.container}>
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
                <FeedbackMessage type="loading" message="Cargando establecimientos..." visible={true} />
            )}

            {error && (
                <FeedbackMessage type="error" message={error} visible={true} />
            )}

            <FlatList
                data={filteredEstablishments}
                keyExtractor={item => item.establishmentId}
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
            />
        </ScrollView>
    );
}