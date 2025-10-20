import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../styles/global';

export type FeedbackType = 'success' | 'error' | 'loading' | 'info';

interface FeedbackMessageProps {
	type: FeedbackType;
	message: string;
	visible: boolean;
}

export const FeedbackMessage: React.FC<FeedbackMessageProps> = ({
	type,
	message,
	visible,
}) => {
	if (!visible) return null;

	const getIcon = () => {
		switch (type) {
			case 'success':
				return '✓';
			case 'error':
				return '✕';
			case 'loading':
				return '⟳';
			case 'info':
				return 'ⓘ';
			default:
				return '';
		}
	};

	const getBackgroundColor = () => {
		switch (type) {
			case 'success':
				return Colors.success;
			case 'error':
				return Colors.error;
			case 'loading':
				return Colors.info;
			case 'info':
				return Colors.info;
			default:
				return Colors.border;
		}
	};

	return (
		<View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
			<Text style={styles.icon}>{getIcon()}</Text>
			<Text style={styles.message}>{message}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		borderRadius: 8,
		marginVertical: 12,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	icon: {
		fontSize: 24,
		color: '#FFFFFF',
		marginRight: 12,
		fontWeight: 'bold',
	},
	message: {
		flex: 1,
		fontSize: 14,
		color: '#FFFFFF',
		fontWeight: '500',
	},
});
