import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Input, FeedbackMessage, GoogleSignInButton } from '../components';
import { styles } from '../styles/LoginScreenStyle';
import { useAuth } from '../hooks/useAuth';
import { useGoogleSignIn } from '../hooks/useGoogleSignIn';
import authService from '../services/authService';
import { useToast } from '../hooks/useToast';
import { LoginCredentials } from '../types/auth.types';

type RootStackParamList = {
	Home: undefined;
	RegisterOptions: undefined;
};

type Props = {
	navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function LoginScreen({ navigation }: Readonly<Props>) {
	const [identifier, setIdentifier] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState<{
		identifier?: string;
		password?: string;
	}>({});
	const { login, isLoading, error, clearError, loginWithGoogle } = useAuth();
	const toast = useToast();
	const [forgotLoading, setForgotLoading] = useState(false);
	const {
		googleUser,
		isLoading: isGoogleLoading,
		error: googleError,
		signIn,
	} = useGoogleSignIn();

	const validate = () => {
		const next: { identifier?: string; password?: string } = {};
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!identifier) next.identifier = 'El correo, usuario o documento es obligatorio';
		else if (!emailRegex.test(identifier) && identifier.length < 3) {
			next.identifier = 'Ingresa un correo válido, usuario o documento';
		}

		if (!password) next.password = 'La contraseña es obligatoria';
		else if (password.length < 8)
			next.password = 'La contraseña debe tener al menos 8 caracteres';

		setErrors(next);
		return Object.keys(next).length === 0;
	};

	const onSubmit = async () => {
		if (!validate()) return;

		try {
			clearError();
			const credentials: LoginCredentials = {
				identifier,
				password,
			};
			await login(credentials);
			// La navegación se maneja automáticamente en App.tsx por el estado de autenticación
		} catch (e) {
			console.error('Login error', e);
			// El error se muestra automáticamente desde el contexto
		}
	};

	const onRegisterPress = () => {
		clearError();
		navigation.navigate('RegisterOptions');
	};

	const handleGoogleSignIn = async () => {
		try {
			clearError();
			await signIn();
		} catch (e) {
			console.error('Google sign in error', e);
		}
	};

	const handleForgotPassword = async () => {
		clearError();
		const email = identifier;
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email || !emailRegex.test(email)) {
			toast.info(
				'Ingresa el correo electrónico asociado a tu cuenta',
				'Correo requerido'
			);
			return;
		}

		try {
			setForgotLoading(true);
			const res = await authService.requestPasswordReset(email);
			toast.success(
				res?.message || 'Si el correo está registrado, recibirás instrucciones por email'
			);
		} catch (e: any) {
			const msg = e?.message || 'Error solicitando recuperación';
			toast.error(msg, 'Error');
		} finally {
			setForgotLoading(false);
		}
	};

	// Effect para manejar cuando el usuario de Google ha sido autenticado
	React.useEffect(() => {
		if (googleUser && !isGoogleLoading) {
			const handleGoogleLogin = async () => {
				try {
					// Nuevo flujo: login común sin especificar tipo de usuario
					// googleId viene del usuario de Google (user.id desde react-native-google-signin)
					await loginWithGoogle({
						token: googleUser.idToken || '', // Backend requiere el Google ID token
						email: googleUser.email,
						name: googleUser.name,
						picture: googleUser.picture,
						googleId: googleUser.id,
					});
					// La navegación a CompleteProfileScreen se maneja en App.tsx
				} catch (e) {
					console.error('Google login error', e);
				}
			};
			handleGoogleLogin();
		}
	}, [googleUser, isGoogleLoading, loginWithGoogle]);

	return (
		<ScrollView contentContainerStyle={styles.scrollContainer}>
			<View style={styles.container}>
				<View style={styles.card}>
					<View style={styles.header}>
						<Text style={styles.title}>Iniciar sesión</Text>
						<Text style={styles.subtitle}>Accede con tus credenciales</Text>
					</View>

					<FeedbackMessage
						type="loading"
						message="Iniciando sesión..."
						visible={isLoading}
					/>
					<FeedbackMessage
						type="error"
						message={error ?? googleError ?? ''}
						visible={!!error || !!googleError}
					/>

					<View style={styles.form}>
						<Input
							label="Correo, usuario o documento"
							keyboardType="email-address"
							autoCapitalize="none"
							value={identifier}
							onChangeText={(t) => {
								setIdentifier(t);
								clearError();
							}}
							error={errors.identifier}
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
					</View>

					<View style={styles.actions}>
						<Button
							title="Iniciar sesión"
							onPress={onSubmit}
							variant="primary"
							disabled={isLoading}
						/>
					</View>

					{/* Recuperar contraseña: debajo del botón Iniciar sesión dentro de la card */}
					<View style={{ alignItems: 'flex-end', marginTop: 8 }}>
						<Button
							title="Recuperar contraseña"
							onPress={handleForgotPassword}
							variant="text"
							disabled={isLoading}
							loading={forgotLoading}
						/>
					</View>

					<View style={styles.divider}>
						<View style={styles.dividerLine} />
						<Text style={styles.dividerText}>o</Text>
						<View style={styles.dividerLine} />
					</View>

					<View style={styles.googleContainer}>
						<GoogleSignInButton
							onPress={handleGoogleSignIn}
							isLoading={isGoogleLoading}
							disabled={isLoading}
						/>
					</View>
				</View>
			</View>
		</ScrollView>
	);
}
