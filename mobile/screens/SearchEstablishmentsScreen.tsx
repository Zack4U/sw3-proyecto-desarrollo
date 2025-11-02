import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Instala si no lo tienes
import Input from '../components/Input';
import Button from '../components/Button';
import  { establishmentService, EstablishmentResponse } from '../services/establishmentService';
import { styles } from '../styles/EstablishmentListScreenStyle';

export default function SearchEstablishmentsScreen() {
  const [filter, setFilter] = useState<'city' | 'neighborhood'>('city');
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState<EstablishmentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      let params: any = {};
      if (filter === 'city') params.cityName = searchValue;
      if (filter === 'neighborhood') params.neighborhood = searchValue;
      const response = await establishmentService.searchEstablishments(params);
      setResults(response.data);
    } catch (err) {
      setError('Error al buscar establecimientos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Establecimientos</Text>
      <Picker
        selectedValue={filter}
        onValueChange={(itemValue) => setFilter(itemValue)}
        style={{ marginBottom: 16 }}
      >
        <Picker.Item label="Ciudad" value="city" />
        <Picker.Item label="Barrio" value="neighborhood" />
      </Picker>
      <Input
        placeholder={filter === 'city' ? 'Ingrese el nombre de la ciudad' : 'Ingrese el barrio'}
        value={searchValue}
        onChangeText={setSearchValue}
        style={styles.input}
      />
      <Button title="Buscar" onPress={handleSearch} />
      {loading && <Text>Cargando...</Text>}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <FlatList
        data={results}
        keyExtractor={item => item.establishmentId}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>{item.address}</Text>
            <Text>{item.neighborhood}</Text>
          </View>
        )}
        ListEmptyComponent={!loading && <Text>No hay resultados</Text>}
      />
    </View>
  );
}