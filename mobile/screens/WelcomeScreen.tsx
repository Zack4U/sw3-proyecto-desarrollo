import React from 'react';
import { View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '../components';
import { styles } from '../styles/WelcomeScreenStyle';
import { RootStackParamList } from '../App';

type Props = {
	navigation: NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
};

export default function WelcomeScreen({ navigation }: Readonly<Props>) {
	return (
		<View style={styles.container}>
			{/* Hero superior */}
			<View style={styles.hero}>
				<Text style={styles.heroBrand}>ComiYa</Text>
				<Text style={styles.heroTitle}>¡Bienvenido!</Text>
				<Text style={styles.heroSubtitle}>
					Conectamos establecimientos con personas para reducir el desperdicio de
					alimentos.
				</Text>
			</View>

			{/* Card de acciones */}
			<View style={styles.card}>
				<Button
					title="Iniciar sesión"
					variant="primary"
					onPress={() => navigation.navigate('Login')}
					fullWidth
					style={styles.button}
				/>
				<Button
					title="Crear cuenta"
					variant="outline"
					onPress={() => navigation.navigate('BasicRegistration')}
					fullWidth
				/>
			</View>

			{/* Beneficios breves */}
			<View style={styles.featuresRow}>
				<View style={styles.featureItem}>
					<Text style={styles.featureIcon}>♻️</Text>
					<Text style={styles.featureText}>Reduce desperdicio</Text>
				</View>
				<View style={styles.featureItem}>
					<Text style={styles.featureIcon}>🏬</Text>
					<Text style={styles.featureText}>Conecta negocios</Text>
				</View>
				<View style={styles.featureItem}>
					<Text style={styles.featureIcon}>🤝</Text>
					<Text style={styles.featureText}>Impacto social</Text>
				</View>
			</View>

			<View style={styles.footer}>
				<Text style={styles.footerText}>Tu ayuda crea un impacto real.</Text>
			</View>
		</View>
	);
}
