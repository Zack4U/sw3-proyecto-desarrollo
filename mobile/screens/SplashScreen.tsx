import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '../styles/global';

/**
 * Pantalla de splash: Valida la sesión del usuario al iniciar la app
 * Si hay sesión válida → navega a Home
 * Si no hay sesión → navega a Welcome
 */
export default function SplashScreen() {
	return (
		<View style={styles.container}>
			<ActivityIndicator size="large" color={Colors.primary} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff',
	},
});
