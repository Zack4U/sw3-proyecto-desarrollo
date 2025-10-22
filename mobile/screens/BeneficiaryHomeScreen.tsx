import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { styles } from '../styles/HomeScreenStyle';
import ProfileModal from '../components/ProfileModal';

// Pantalla para beneficiarios: muestra el mismo header que HomeScreen (establecimiento) y contenido en blanco
export default function BeneficiaryHomeScreen() {
	const { logout, user, isLoading } = useAuth();
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
			<View style={{ flex: 1, backgroundColor: 'transparent' }} />

			<ProfileModal
				visible={profileModalVisible}
				user={user}
				onClose={() => setProfileModalVisible(false)}
			/>
		</View>
	);
}
