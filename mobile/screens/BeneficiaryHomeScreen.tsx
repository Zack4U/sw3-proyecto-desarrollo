import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { useNotificationContext } from '../contexts/NotificationContext';
import { styles } from '../styles/HomeScreenStyle';
import ProfileModal from '../components/ProfileModal';

// Pantalla para beneficiarios: muestra el mismo header que HomeScreen (establecimiento) y contenido en blanco
export default function BeneficiaryHomeScreen() {
	const { logout, user, isLoading } = useAuth();
	const { expoPushToken, sendTestNotification, registerForPushNotifications } = useNotificationContext();

	const navigation =
		useNavigation<NativeStackNavigationProp<Record<string, object | undefined>>>();
	const [profileModalVisible, setProfileModalVisible] = useState(false);
	const [isTestingNotification, setIsTestingNotification] = useState(false);

	const handleLogout = async () => {
		try {
			await logout();
		} catch (error) {
			console.error('Error al cerrar sesión:', error);
		}
	};

	/**
	 * Maneja la prueba de notificaciones push/locales
	 * ✅ Funciona en emuladores (notificaciones locales)
	 * ✅ Funciona en dispositivos físicos (notificaciones push)
	 */
	const handleTestPushNotification = async () => {
		try {
			setIsTestingNotification(true);

			// Intentar registrar si no hay token
			if (!expoPushToken) {
				console.log('ℹ️ Token no disponible, intentando registrar...');
				await registerForPushNotifications();
			}

			// Enviar notificación de prueba (local o push según el dispositivo)
			await sendTestNotification();

			const isEmulator = expoPushToken === 'LOCAL_TESTING_TOKEN';
			const message = isEmulator
				? 'Notificación LOCAL enviada (emulador).\n\nDeberías verla en la parte superior de la pantalla en unos segundos.'
				: 'Notificación PUSH enviada (dispositivo físico).\n\nDeberías recibirla en unos segundos.\n\nEsta simula la notificación que recibiría un establecimiento cuando seleccionas uno de sus alimentos.';

			Alert.alert(
				'✅ Notificación Enviada',
				message,
				[
					{
						text: 'Perfecto',
						style: 'default',
					},
				]
			);

			console.log('🔔 Notificación de prueba enviada exitosamente');
			console.log('📱 Token:', expoPushToken);
			console.log('👤 Usuario:', user?.email);
			console.log('🖥️ Modo:', isEmulator ? 'Emulador (Local)' : 'Dispositivo (Push)');
		} catch (error) {
			console.error('❌ Error enviando notificación de prueba:', error);
			const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
			Alert.alert(
				'❌ Error',
				`No se pudo enviar la notificación:\n${errorMessage}\n\nVerifica los permisos en Configuración > Apps > ComiYa > Permisos > Notificaciones.`,
				[{ text: 'Entendido' }]
			);
		} finally {
			setIsTestingNotification(false);
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

					<TouchableOpacity
						style={[styles.menuButton, styles.beneficiaryButton]}
						onPress={() => navigation.navigate('AvailableFoodList' as any)}
					>
						<Text style={styles.buttonIcon}>🍽️</Text>
						<Text style={styles.buttonText}>Ver alimentos disponibles</Text>
						<Text style={styles.buttonDescription}>
							Explora todos los alimentos donados
						</Text>
					</TouchableOpacity>

					{/* Botón de prueba de notificaciones push */}
					<TouchableOpacity
						style={[styles.menuButton, styles.notificationTestButton]}
						onPress={handleTestPushNotification}
						disabled={isTestingNotification}
					>
						<Text style={styles.buttonIcon}>🔔</Text>
						<Text style={styles.buttonText}>
							{isTestingNotification ? 'Enviando...' : 'Probar Notificaciones'}
						</Text>
						<Text style={styles.buttonDescription}>
							Simula notificación al establecimiento
						</Text>
						{expoPushToken && (
							<Text style={styles.tokenStatusSmall}>✅ Token registrado</Text>
						)}
						{isTestingNotification && (
							<ActivityIndicator size="small" color="#2e7d32" style={{ marginTop: 8 }} />
						)}
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
