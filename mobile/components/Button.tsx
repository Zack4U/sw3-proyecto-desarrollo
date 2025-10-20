import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { GlobalStyles, Colors } from '../styles/global';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'text';

interface ButtonProps {
	title: string;
	onPress: () => void;
	variant?: ButtonVariant;
	disabled?: boolean;
	loading?: boolean;
	fullWidth?: boolean;
	style?: any;
}

export default function Button({
	title,
	onPress,
	variant = 'primary',
	disabled = false,
	loading = false,
	fullWidth = false,
	style,
}: ButtonProps) {
	const getButtonStyle = (pressed: boolean) => {
		// Si está deshabilitado, no aplicar efecto pressed
		if (disabled) {
			switch (variant) {
				case 'primary':
					return [GlobalStyles.buttonPrimary, GlobalStyles.buttonDisabled];
				case 'secondary':
					return [GlobalStyles.buttonSecondary, GlobalStyles.buttonDisabled];
				case 'accent':
					return [GlobalStyles.buttonAccent, GlobalStyles.buttonDisabled];
				case 'outline':
					return [GlobalStyles.buttonOutline, GlobalStyles.buttonDisabled];
				case 'text':
					return [GlobalStyles.buttonText, GlobalStyles.buttonDisabled];
				default:
					return [GlobalStyles.buttonPrimary, GlobalStyles.buttonDisabled];
			}
		}
		// Efecto visual al presionar
		switch (variant) {
			case 'primary':
				return [
					GlobalStyles.buttonPrimary,
					pressed && { backgroundColor: '#33884d' }, // Verde más oscuro al presionar
				];
			case 'secondary':
				return [
					GlobalStyles.buttonSecondary,
					pressed && { backgroundColor: '#8bbf4d' }, // Verde claro más oscuro
				];
			case 'accent':
				return [
					GlobalStyles.buttonAccent,
					pressed && { backgroundColor: '#c68618' }, // Acento cálido más oscuro
				];
			case 'outline':
				return [
					GlobalStyles.buttonOutline,
					pressed && { borderColor: Colors.primary, backgroundColor: Colors.surface },
				];
			case 'text':
				return [GlobalStyles.buttonText, pressed && { backgroundColor: Colors.surface }];
			default:
				return [GlobalStyles.buttonPrimary, pressed && { backgroundColor: '#33884d' }];
		}
	};

	const getTextStyle = () => {
		switch (variant) {
			case 'primary':
				return GlobalStyles.buttonTextPrimary;
			case 'secondary':
				return GlobalStyles.buttonTextSecondary;
			case 'accent':
				return GlobalStyles.buttonTextAccent;
			case 'outline':
				return GlobalStyles.buttonTextOutline;
			case 'text':
				return GlobalStyles.buttonTextGhost;
			default:
				return GlobalStyles.buttonTextPrimary;
		}
	};

	return (
		<Pressable
			style={({ pressed }) => [
				...getButtonStyle(pressed),
				fullWidth && styles.fullWidth,
				style,
			]}
			onPress={onPress}
			disabled={disabled || loading}
		>
			{loading ? (
				<ActivityIndicator
					color={
						variant === 'outline' || variant === 'text'
							? Colors.primary
							: Colors.textLight
					}
				/>
			) : (
				<Text style={getTextStyle()}>{title}</Text>
			)}
		</Pressable>
	);
}

const styles = StyleSheet.create({
	fullWidth: {
		width: '100%',
	},
});
