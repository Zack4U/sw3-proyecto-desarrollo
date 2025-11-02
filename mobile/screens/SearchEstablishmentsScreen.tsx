import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Input from '../components/Input';
import Button from '../components/Button';
import { establishmentService, EstablishmentResponse } from '../services/establishmentService';
import { searchStyles as styles } from '../styles/SearchEstablishmentsScreenStyle';

export default function SearchEstablishmentsScreen() {
  const [filter, setFilter] = useState<'city' | 'neighborhood'>('city');
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState<EstablishmentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      setError('Por favor ingrese un valor de búsqueda');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (filter === 'city') params.city = searchValue.trim();
      if (filter === 'neighborhood') params.neighborhood = searchValue.trim();

      const response = await establishmentService.searchEstablishments(params);
      console.log('Resultados de búsqueda:', response);
      setResults(Array.isArray(response) ? response : []);
    } catch (err) {
      setError('Error al buscar establecimientos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Establecimientos</Text>

      <View style={styles.filterContainer}>
        <Text style={styles.label}>Filtrar por:</Text>
        <Picker
          selectedValue={filter}
          onValueChange={(itemValue) => setFilter(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Ciudad" value="city" />
          <Picker.Item label="Barrio" value="neighborhood" />
        </Picker>

        <Input
          label={filter === 'city' ? 'Ciudad' : 'Barrio'}
          placeholder={
            filter === 'city'
              ? 'Ingrese el nombre de la ciudad'
              : 'Ingrese el nombre del barrio'
          }
          value={searchValue}
          onChangeText={setSearchValue}
          style={styles.input}
        />

        <View style={styles.buttonContainer}>
          <Button title="Buscar" onPress={handleSearch} fullWidth />
        </View>
      </View>

      {loading && <Text style={styles.loadingText}>Cargando...</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}

      <FlatList
        data={results}
        keyExtractor={(item) => item.establishmentId}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.address}>{item.address}</Text>
            <Text style={styles.neighborhood}>{item.neighborhood}</Text>
          </View>
        )}
        ListEmptyComponent={() =>
          !loading && <Text style={styles.noResults}>No hay resultados</Text>
        }
        contentContainerStyle={styles.resultList}
      />
    </View>
  );
}
