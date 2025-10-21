import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GlobalStyles } from '../styles/global';

interface CardProps {
	children: React.ReactNode;
	compact?: boolean;
	style?: any;
}

export default function Card({ children, compact = false, style }: CardProps) {
	return (
		<View style={[compact ? GlobalStyles.cardCompact : GlobalStyles.card, style]}>
			{children}
		</View>
	);
}
