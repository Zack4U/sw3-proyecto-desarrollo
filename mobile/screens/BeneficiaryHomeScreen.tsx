import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { styles } from '../styles/HomeScreenStyle';
import ProfileModal from '../components/ProfileModal';
import Button from '../components/Button';

export default function BeneficiaryHomeScreen() {
  const { logout, user, isLoading } = useAuth();
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const navigation = useNavigation();

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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
        <Button
          title="🔍 Buscar Establecimientos"
          onPress={() => navigation.navigate('SearchEstablishments' as never)}
          fullWidth
        />
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
