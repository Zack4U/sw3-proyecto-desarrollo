import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
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
	const getButtonStyle = () => {
		switch (variant) {
			case 'primary':
				return GlobalStyles.buttonPrimary;
			case 'secondary':
				return GlobalStyles.buttonSecondary;
			case 'accent':
				return GlobalStyles.buttonAccent;
			case 'outline':
				return GlobalStyles.buttonOutline;
			case 'text':
				return GlobalStyles.buttonText;
			default:
				return GlobalStyles.buttonPrimary;
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
		<TouchableOpacity
			style={[
				getButtonStyle(),
				disabled && GlobalStyles.buttonDisabled,
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
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	fullWidth: {
		width: '100%',
	},
});
