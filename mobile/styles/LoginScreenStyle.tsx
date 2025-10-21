import { StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from './global';

export const styles = StyleSheet.create({
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
		textAlign: 'center',
	},
	subtitle: {
		marginTop: Spacing.xs,
		fontSize: FontSizes.sm,
		color: Colors.textSecondary,
		textAlign: 'center',
	},
	form: {
		gap: Spacing.md,
	},
	actions: {
		marginTop: Spacing.lg,
	},
	footer: {
		marginTop: Spacing.lg,
		alignItems: 'center',
	},
	link: {
		color: Colors.primary,
		fontWeight: FontWeights.semibold,
	},
});
