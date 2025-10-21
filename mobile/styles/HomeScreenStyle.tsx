import { StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from './global';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
		padding: Spacing.md,
		justifyContent: 'center',
	},
	title: {
		fontSize: FontSizes.xxxl,
		fontWeight: FontWeights.bold,
		color: Colors.primary,
		textAlign: 'center',
		marginBottom: Spacing.sm,
	},
	subtitle: {
		fontSize: FontSizes.md,
		color: Colors.textSecondary,
		textAlign: 'center',
		marginBottom: Spacing.xxl,
	},
	menuContainer: {
		gap: Spacing.md,
	},
	menuButton: {
		backgroundColor: Colors.surface,
		padding: Spacing.lg,
		borderRadius: BorderRadius.xl,
		alignItems: 'center',
		...Shadows.md,
	},
	establishmentButton: {
		borderLeftWidth: 5,
		borderLeftColor: Colors.primary,
	},
	beneficiaryButton: {
		borderLeftWidth: 5,
		borderLeftColor: Colors.secondary,
	},
	// foodButton removed for simplified menu
	buttonIcon: {
		fontSize: 48,
		marginBottom: Spacing.sm,
	},
	buttonText: {
		fontSize: FontSizes.xl,
		fontWeight: FontWeights.semibold,
		color: Colors.textPrimary,
		marginBottom: Spacing.xs,
	},
	buttonDescription: {
		fontSize: FontSizes.sm,
		color: Colors.textSecondary,
		textAlign: 'center',
	},
});
