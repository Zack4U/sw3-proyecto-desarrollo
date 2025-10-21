import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { styles } from '../styles/HomeScreenStyle';

type RootStackParamList = {
	Home: undefined;
	Login: undefined;
	RegisterOptions: undefined;
};

type HomeScreenProps = {
	navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: Readonly<HomeScreenProps>) {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>ComiYa</Text>
			<Text style={styles.subtitle}>
				¡Bienvenido! Reduce el desperdicio de alimentos con nosotros.
			</Text>
			<View style={styles.menuContainer}>
				<TouchableOpacity
					style={[styles.menuButton, styles.establishmentButton]}
					onPress={() => navigation.navigate('Login')}
				>
					<Text style={styles.buttonIcon}>🔐</Text>
					<Text style={styles.buttonText}>Iniciar sesión</Text>
					<Text style={styles.buttonDescription}>Accede con tu correo y contraseña</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.menuButton, styles.beneficiaryButton]}
					onPress={() => navigation.navigate('RegisterOptions')}
				>
					<Text style={styles.buttonIcon}>�</Text>
					<Text style={styles.buttonText}>Registrarse</Text>
					<Text style={styles.buttonDescription}>Crea una cuenta para comenzar</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}
