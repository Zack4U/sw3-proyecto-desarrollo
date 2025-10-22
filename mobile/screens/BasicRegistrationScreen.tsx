import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Input, FeedbackMessage } from '../components';
import { styles } from '../styles/BasicRegistrationScreenStyle';
import { useAuth } from '../hooks/useAuth';
import { testBackendConnection } from '../utils/networkDebug';

type RootStackParamList = {
	Welcome: undefined;
	Login: undefined;
	BasicRegistration: undefined;
	CompleteProfile: undefined;
};

type Props = {
	navigation: NativeStackNavigationProp<RootStackParamList, 'BasicRegistration'>;
};

export default function BasicRegistrationScreen({ navigation }: Readonly<Props>) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [errors, setErrors] = useState<{
		email?: string;
		password?: string;
		confirmPassword?: string;
	}>({});
	const { registerBasic, isLoading, error, clearError } = useAuth();

	const validate = () => {
		const next: { email?: string; password?: string; confirmPassword?: string } = {};
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!email) next.email = 'El correo electrónico es obligatorio';
		else if (!emailRegex.test(email)) next.email = 'Ingresa un correo válido';

		if (!password) next.password = 'La contraseña es obligatoria';
		else if (password.length < 8)
			next.password = 'La contraseña debe tener al menos 8 caracteres';

		if (!confirmPassword) next.confirmPassword = 'Debes confirmar tu contraseña';
		else if (password !== confirmPassword)
			next.confirmPassword = 'Las contraseñas no coinciden';

		setErrors(next);
		return Object.keys(next).length === 0;
	};

	const onSubmit = async () => {
		if (!validate()) return;

		try {
			clearError();

			// Test de conexión antes de intentar el registro
			console.log('🔍 Probando conexión con backend...');
			await testBackendConnection();

			console.log('📝 Intentando registrar usuario...');
			await registerBasic({ email, password, confirmPassword });
			// La navegación se maneja automáticamente en App.tsx
		} catch (e) {
			console.error('Registration error', e);
		}
	};

	const onLoginPress = () => {
		clearError();
		navigation.navigate('Login');
	};

	return (
		<ScrollView contentContainerStyle={styles.scrollContainer}>
			<View style={styles.container}>
				<View style={styles.card}>
					<View style={styles.header}>
						<Text style={styles.title}>Crear cuenta</Text>
						<Text style={styles.subtitle}>Ingresa tus datos básicos para comenzar</Text>
					</View>

					<FeedbackMessage
						type="loading"
						message="Creando cuenta..."
						visible={isLoading}
					/>
					<FeedbackMessage type="error" message={error ?? ''} visible={!!error} />

					<View style={styles.form}>
						<Input
							label="Correo electrónico"
							keyboardType="email-address"
							autoCapitalize="none"
							value={email}
							onChangeText={(t) => {
								setEmail(t);
								clearError();
							}}
							error={errors.email}
							required
							editable={!isLoading}
						/>
						<Input
							label="Contraseña"
							secureTextEntry
							value={password}
							onChangeText={(t) => {
								setPassword(t);
								clearError();
							}}
							error={errors.password}
							required
							editable={!isLoading}
						/>
						<Input
							label="Confirmar contraseña"
							secureTextEntry
							value={confirmPassword}
							onChangeText={(t) => {
								setConfirmPassword(t);
								clearError();
							}}
							error={errors.confirmPassword}
							required
							editable={!isLoading}
						/>
					</View>

					<View style={styles.actions}>
						<Button
							title="Crear cuenta"
							onPress={onSubmit}
							variant="primary"
							disabled={isLoading}
						/>
					</View>

					<View style={styles.footer}>
						<Text style={styles.footerText}>
							¿Ya tienes cuenta?{' '}
							<Text style={styles.linkText} onPress={onLoginPress}>
								Inicia sesión
							</Text>
						</Text>
					</View>
				</View>
			</View>
		</ScrollView>
	);
}
