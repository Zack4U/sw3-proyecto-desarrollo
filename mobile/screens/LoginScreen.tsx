import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Input, FeedbackMessage } from '../components';
import { styles } from '../styles/LoginScreenStyle';
import { useRequestState } from '../hooks/useRequestState';

type RootStackParamList = {
	Home: undefined;
};

type Props = {
	navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function LoginScreen({ navigation }: Readonly<Props>) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
	const request = useRequestState();

	const validate = () => {
		const next: { email?: string; password?: string } = {};
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email) next.email = 'El correo es obligatorio';
		else if (!emailRegex.test(email)) next.email = 'Correo inválido';
		if (!password) next.password = 'La contraseña es obligatoria';
		setErrors(next);
		return Object.keys(next).length === 0;
	};

	const onSubmit = async () => {
		if (!validate()) return;
		request.setLoading();
		try {
			// Aquí conectaremos con auth cuando exista
			await new Promise((r) => setTimeout(r, 800));
			request.setSuccess();
			setTimeout(() => navigation.navigate('Home'), 800);
		} catch (e: unknown) {
			console.error('Login error', e);
			request.setError('No fue posible iniciar sesión');
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.card}>
				<View style={styles.header}>
					<Text style={styles.title}>Iniciar sesión</Text>
					<Text style={styles.subtitle}>Accede con tu correo y contraseña</Text>
				</View>

				<FeedbackMessage
					type="loading"
					message="Iniciando sesión..."
					visible={request.loading}
				/>
				<FeedbackMessage
					type="success"
					message="Inicio de sesión exitoso"
					visible={request.success}
				/>
				<FeedbackMessage
					type="error"
					message={request.error ?? ''}
					visible={!!request.error}
				/>

				<View style={styles.form}>
					<Input
						label="Correo electrónico"
						keyboardType="email-address"
						autoCapitalize="none"
						value={email}
						onChangeText={(t) => {
							setEmail(t);
							request.reset();
						}}
						error={errors.email}
						required
					/>
					<Input
						label="Contraseña"
						secureTextEntry
						value={password}
						onChangeText={(t) => {
							setPassword(t);
							request.reset();
						}}
						error={errors.password}
						required
					/>
				</View>

				<View style={styles.actions}>
					<Button title="Iniciar sesión" onPress={onSubmit} variant="primary" />
				</View>

				<View style={styles.footer}>
					<Text style={styles.subtitle}>¿Olvidaste tu contraseña?</Text>
				</View>
			</View>
		</View>
	);
}
