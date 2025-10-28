import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { styles } from '../styles/HomeScreenStyle';
import ProfileModal from '../components/ProfileModal';

// Pantalla para beneficiarios: muestra el mismo header que HomeScreen (establecimiento) y contenido en blanco
export default function BeneficiaryHomeScreen() {
	const { logout, user, isLoading } = useAuth();

	const navigation =
		useNavigation<NativeStackNavigationProp<Record<string, object | undefined>>>();
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
			{/* Header igual al de HomeScreen */}
			<View style={styles.header}>
				<Text style={styles.title}>ComiYa</Text>
				<View style={styles.headerButtonsContainer}>
					{user && (
						<TouchableOpacity
							style={styles.profileButton}
							onPress={() => setProfileModalVisible(true)}
						>
							<Text style={styles.profileButtonText}>👤</Text>
						</TouchableOpacity>
					)}
					<TouchableOpacity
						style={styles.logoutButton}
						onPress={handleLogout}
						disabled={isLoading}
					>
						<Text style={styles.logoutButtonText}>🚪 Cerrar sesión</Text>
					</TouchableOpacity>
				</View>
			</View>

			{/* Contenido en blanco por ahora */}
			<View style={styles.contentContainer}>
				{/* Botón para que beneficiarios vean la lista de establecimientos */}
				<View style={styles.menuContainer}>
					<TouchableOpacity
						style={[styles.menuButton, styles.beneficiaryButton]}
						onPress={() => navigation.navigate('EstablishmentList')}
					>
						<Text style={styles.buttonIcon}>🏢</Text>
						<Text style={styles.buttonText}>Ver establecimientos</Text>
						<Text style={styles.buttonDescription}>
							Explora los puntos de donación cercanos
						</Text>
					</TouchableOpacity>
				</View>
			</View>

			<ProfileModal
				visible={profileModalVisible}
				user={user}
				onClose={() => setProfileModalVisible(false)}
			/>
		</View>
	);
}
