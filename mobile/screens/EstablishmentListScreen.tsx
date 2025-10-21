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
import { FeedbackMessage, Card } from '../components';
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

    useEffect(() => {
        establishmentService.getAll()
            .then(data => setEstablishments(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Establecimientos Registrados</Text>
                <Text style={styles.subtitle}>Lista de puntos de donación</Text>
            </View>

            {loading && (
                <FeedbackMessage type="loading" message="Cargando establecimientos..." visible={true} />
            )}

            {error && (
                <FeedbackMessage type="error" message={error} visible={true} />
            )}

            <FlatList
                data={establishments}
                keyExtractor={item => item.establishmentId}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.address}>{item.address}</Text>
                        <Text style={styles.type}>{item.establishmentType}</Text>
                        <View style={styles.divider} />
                    </View>
                )}
                contentContainerStyle={styles.list}
            />
        </ScrollView>
    );
}