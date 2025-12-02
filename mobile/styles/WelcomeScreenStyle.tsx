import { StyleSheet } from 'react-native';
import {
	Colors,
	Spacing,
	FontSizes,
	FontWeights,
	BorderRadius,
	Shadows,
	GlobalStyles,
} from './global';

export const styles = StyleSheet.create({
	container: {
		...GlobalStyles.container,
		paddingHorizontal: Spacing.lg,
		paddingTop: Spacing.lg,
		justifyContent: 'space-between',
	},
	// Hero superior con fondo de marca
	hero: {
		backgroundColor: Colors.primary,
		paddingTop: Spacing.xxl,
		paddingBottom: Spacing.xl,
		paddingHorizontal: Spacing.lg,
		alignItems: 'center',
		borderBottomLeftRadius: 28,
		borderBottomRightRadius: 28,
		...Shadows.md,
		position: 'relative',
	},
	heroBrand: {
		fontSize: FontSizes.xxxl,
		fontWeight: FontWeights.bold,
		color: Colors.textLight,
		marginBottom: Spacing.xs,
	},
	heroTitle: {
		fontSize: FontSizes.xl,
		fontWeight: FontWeights.semibold,
		color: Colors.textLight,
		marginBottom: Spacing.xs,
	},
	heroSubtitle: {
		fontSize: FontSizes.md,
		color: Colors.textLight,
		opacity: 0.9,
		textAlign: 'center',
		maxWidth: 320,
	},
	illustrationBadge: {
		position: 'absolute',
		bottom: -28,
		width: 72,
		height: 72,
		borderRadius: BorderRadius.round,
		backgroundColor: Colors.surface,
		alignItems: 'center',
		justifyContent: 'center',
		...Shadows.lg,
	},
	illustrationEmoji: {
		fontSize: 32,
	},
	card: {
		backgroundColor: Colors.surface,
		borderRadius: BorderRadius.xl,
		padding: Spacing.xl,
		...Shadows.md,
		gap: Spacing.md,
		marginTop: Spacing.xxl,
	},
	button: {
		marginBottom: Spacing.md,
	},
	divider: {
		height: 1,
		backgroundColor: Colors.border,
		marginVertical: Spacing.md,
	},
	testButton: {
		borderColor: Colors.accent,
		borderWidth: 2,
		marginBottom: Spacing.xs,
	},
	tokenStatus: {
		fontSize: FontSizes.sm,
		color: Colors.success,
		textAlign: 'center',
		marginTop: Spacing.xs,
		fontWeight: FontWeights.semibold,
	},
	loader: {
		marginTop: Spacing.sm,
	},
	featuresRow: {
		marginTop: Spacing.lg,
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: Spacing.md,
	},
	featureItem: {
		flex: 1,
		backgroundColor: Colors.surface,
		borderRadius: BorderRadius.lg,
		paddingVertical: Spacing.md,
		alignItems: 'center',
		...Shadows.sm,
	},
	featureIcon: {
		fontSize: 18,
		marginBottom: Spacing.xs,
	},
	featureText: {
		fontSize: FontSizes.sm,
		color: Colors.textSecondary,
		textAlign: 'center',
	},
	footer: {
		alignItems: 'center',
		marginBottom: Spacing.xl,
	},
	footerText: {
		color: Colors.textSecondary,
	},
});
