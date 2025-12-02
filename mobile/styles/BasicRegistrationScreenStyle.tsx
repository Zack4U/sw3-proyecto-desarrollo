import { StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from './global';

export const styles = StyleSheet.create({
	scrollContainer: {
		flexGrow: 1,
		backgroundColor: Colors.background,
	},
	container: {
		flex: 1,
		backgroundColor: Colors.background,
		padding: Spacing.lg,
		justifyContent: 'center',
	},
	card: {
		backgroundColor: Colors.surface,
		borderRadius: BorderRadius.xl,
		padding: Spacing.xl,
		...Shadows.md,
	},
	header: {
		marginBottom: Spacing.lg,
	},
	title: {
		fontSize: FontSizes.xxl,
		fontWeight: FontWeights.bold,
		color: Colors.primary,
		marginBottom: Spacing.xs,
	},
	subtitle: {
		fontSize: FontSizes.md,
		color: Colors.textSecondary,
	},
	form: {
		marginBottom: Spacing.lg,
	},
	actions: {
		marginBottom: Spacing.md,
	},
	footer: {
		alignItems: 'center',
		marginTop: Spacing.md,
	},
	footerText: {
		fontSize: FontSizes.md,
		color: Colors.textSecondary,
	},
	linkText: {
		color: Colors.primary,
		fontWeight: FontWeights.semibold,
	},
});
