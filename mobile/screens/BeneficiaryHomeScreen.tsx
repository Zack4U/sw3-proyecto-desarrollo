import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { styles } from '../styles/HomeScreenStyle';
import ProfileModal from '../components/ProfileModal';
import Button from '../components/Button';

export default function BeneficiaryHomeScreen() {
  const { logout, user, isLoading } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<Record<string, object | undefined>>>();
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>ComiYa</Text>
        <View style={styles.headerButtonsContainer}>
          {user && (
            <Button
              title="👤"
              onPress={() => setProfileModalVisible(true)}
              variant="secondary"
              style={{ width: 50, paddingHorizontal: 0 }}
            />
          )}
          <Button
            title="🚪 Cerrar sesión"
            onPress={handleLogout}
            variant="accent"
            disabled={isLoading}
            style={{ marginLeft: 10 }}
          />
        </View>
      </View>

      {/* Contenido principal */}
      <View style={styles.contentContainer}>
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={[styles.menuButton, styles.beneficiaryButton]}
            onPress={() => navigation.navigate('EstablishmentList' as never)}
          >
            <Text style={styles.buttonIcon}>🏢</Text>
            <Text style={styles.buttonText}>Ver establecimientos</Text>
            <Text style={styles.buttonDescription}>
              Explora los puntos de donación cercanos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuButton, styles.beneficiaryButton]}
            onPress={() => navigation.navigate('SearchEstablishments' as never)}
          >
            <Text style={styles.buttonIcon}>🔍</Text>
            <Text style={styles.buttonText}>Buscar establecimientos</Text>
            <Text style={styles.buttonDescription}>
              Filtra por ciudad o barrio
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuButton, styles.beneficiaryButton]}
            onPress={() => navigation.navigate('AvailableFoodList' as never)}
          >
            <Text style={styles.buttonIcon}>🍽️</Text>
            <Text style={styles.buttonText}>Ver alimentos disponibles</Text>
            <Text style={styles.buttonDescription}>
              Explora todos los alimentos donados
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de perfil */}
      <ProfileModal
        visible={profileModalVisible}
        user={user}
        onClose={() => setProfileModalVisible(false)}
      />
    </View>
  );
}
