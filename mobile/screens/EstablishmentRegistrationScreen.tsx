import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Input, FeedbackMessage } from '../components';
import { styles } from '../styles/LoginScreenStyle';
import { useAuth } from '../hooks/useAuth';
import { RegisterEstablishmentData } from '../types/auth.types';

type RootStackParamList = {
	Home: undefined;
	Login: undefined;
};

type EstablishmentRegistrationScreenProps = {
	navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

interface FormErrors {
	email?: string;
	establishmentName?: string;
	password?: string;
	confirmPassword?: string;
}

export default function EstablishmentRegistrationScreen({
	navigation,
}: Readonly<EstablishmentRegistrationScreenProps>) {
	const [email, setEmail] = useState('');
	const [establishmentName, setEstablishmentName] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [errors, setErrors] = useState<FormErrors>({});
	const { registerEstablishment, isLoading, error, clearError } = useAuth();

	const validate = (): boolean => {
		const next: FormErrors = {};
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!email) next.email = 'El correo es obligatorio';
		else if (!emailRegex.test(email)) next.email = 'Correo inválido';

		if (!establishmentName)
			next.establishmentName = 'El nombre del establecimiento es obligatorio';
		else if (establishmentName.length < 3)
			next.establishmentName = 'El nombre debe tener al menos 3 caracteres';

		if (!password) next.password = 'La contraseña es obligatoria';
		else if (password.length < 8)
			next.password = 'La contraseña debe tener al menos 8 caracteres';

		if (!confirmPassword) next.confirmPassword = 'Confirma tu contraseña';
		else if (confirmPassword !== password)
			next.confirmPassword = 'Las contraseñas no coinciden';

		setErrors(next);
		return Object.keys(next).length === 0;
	};

	const onSubmit = async () => {
		if (!validate()) return;

		try {
			clearError();
			const data: RegisterEstablishmentData = {
				email,
				establishmentName,
				password,
				confirmPassword,
			};
			await registerEstablishment(data);
		} catch (e) {
			console.error('Registration error', e);
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.scrollContainer}>
			<View style={styles.container}>
				<View style={styles.card}>
					<View style={styles.header}>
						<Text style={styles.title}>Registrarse como Establecimiento</Text>
						<Text style={styles.subtitle}>Crea tu cuenta para compartir alimentos</Text>
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
							label="Nombre del Establecimiento"
							autoCapitalize="words"
							value={establishmentName}
							onChangeText={(t) => {
								setEstablishmentName(t);
								clearError();
							}}
							error={errors.establishmentName}
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
							title="Registrarse"
							onPress={onSubmit}
							variant="primary"
							disabled={isLoading}
						/>
					</View>

					<View style={styles.footer}>
						<Text style={styles.footerText}>
							¿Ya tienes cuenta?{' '}
							<Text style={styles.linkText} onPress={() => navigation.navigate('Login')}>
								Inicia sesión aquí
							</Text>
						</Text>
					</View>
				</View>
			</View>
		</ScrollView>
	);
}
