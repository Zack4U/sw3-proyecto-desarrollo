import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { GlobalStyles, Colors } from '../styles/global';

interface InputProps extends TextInputProps {
	label: string;
	error?: string;
	required?: boolean;
}

export default function Input({
	label,
	error,
	required = false,
	style,
	...props
}: InputProps) {
	const [isFocused, setIsFocused] = useState(false);

	return (
		<View style={GlobalStyles.inputGroup}>
			<Text style={GlobalStyles.label}>
				{label} {required && <Text style={{ color: Colors.error }}>*</Text>}
			</Text>
			<TextInput
				style={[
					GlobalStyles.input,
					isFocused && GlobalStyles.inputFocused,
					error && GlobalStyles.inputError,
					style,
				]}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				{...props}
			/>
			{error && <Text style={GlobalStyles.errorText}>{error}</Text>}
		</View>
	);
}
