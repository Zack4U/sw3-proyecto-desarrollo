import { StyleSheet } from 'react-native';
import { Colors, Spacing, GlobalStyles } from './global';

export const styles = StyleSheet.create({
	container: {
		...GlobalStyles.scrollContainer,
	},
	header: {
		...GlobalStyles.header,
		backgroundColor: Colors.primary,
	},
	title: {
		...GlobalStyles.headerTitle,
	},
	subtitle: {
		...GlobalStyles.headerSubtitle,
	},
	filtersContainer: {
		width: '100%',
		paddingHorizontal: 16,
		marginBottom: 16,
		marginTop: 8,
	},
	card: {
		marginBottom: Spacing.lg,
	},
	name: {
		...GlobalStyles.headerTitle,
		fontSize: 18,
		marginBottom: Spacing.xs,
		color: Colors.primary,
	},
	address: {
		...GlobalStyles.label,
		color: Colors.textSecondary,
		marginBottom: Spacing.xs,
	},
	type: {
		...GlobalStyles.label,
		color: Colors.secondary,
		fontWeight: 'bold',
	},
	divider: {
		...GlobalStyles.divider,
		marginTop: 12,
	},
	list: {
		paddingHorizontal: 16,
		paddingBottom: Spacing.lg,
	},
	input: {
		...GlobalStyles.input,
		width: '100%',
		backgroundColor: '#f5f5f5',
		borderRadius: 8,
		padding: 8,
		alignSelf: 'stretch',
	},
	label: {
		...GlobalStyles.label,
		width: '100%',
		textAlign: 'left',
		marginBottom: 8,
		fontWeight: 'bold',
		fontSize: 16,
	},
	// Botones de paginación
	paginationContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: Spacing.md,
	},
	paginationButton: {
		...GlobalStyles.buttonPrimary,
		minWidth: 120,
		marginHorizontal: 8,
		marginBottom: Spacing.md,
		// Override padding from global button to make buttons slightly smaller/tighter
		paddingVertical: Spacing.sm,
		paddingHorizontal: Spacing.lg,
	},
	paginationButtonDisabled: {
		...GlobalStyles.buttonDisabled,
	},
	paginationText: {
		...GlobalStyles.buttonTextPrimary,
	},
	paginationInfo: {
		...GlobalStyles.subtitle,
		textAlign: 'center',
		marginBottom: Spacing.sm,
	},
});
