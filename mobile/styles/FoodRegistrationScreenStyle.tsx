import { StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from './global';

export const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.background,
	},
	header: {
		backgroundColor: Colors.primary,
		paddingTop: Spacing.xxl + 10,
		paddingBottom: Spacing.xl,
		paddingHorizontal: Spacing.lg,
		borderBottomLeftRadius: BorderRadius.xl,
		borderBottomRightRadius: BorderRadius.xl,
		...Shadows.md,
	},
	title: {
		fontSize: FontSizes.xxl,
		fontWeight: FontWeights.bold,
		color: Colors.textLight,
		marginBottom: Spacing.xs,
	},
	subtitle: {
		fontSize: FontSizes.md,
		color: Colors.textLight,
		opacity: 0.9,
	},
	form: {
		padding: Spacing.lg,
		paddingBottom: Spacing.xxl,
	},
	inputGroup: {
		marginBottom: Spacing.md,
	},
	label: {
		fontSize: FontSizes.md,
		fontWeight: FontWeights.semibold,
		color: Colors.textPrimary,
		marginBottom: Spacing.xs,
	},
	required: {
		color: Colors.error,
	},
	input: {
		backgroundColor: Colors.surface,
		borderWidth: 1,
		borderColor: Colors.border,
		borderRadius: BorderRadius.md,
		paddingHorizontal: Spacing.md,
		paddingVertical: Spacing.sm + 4,
		fontSize: FontSizes.md,
		color: Colors.textPrimary,
	},
	textArea: {
		backgroundColor: Colors.surface,
		borderWidth: 1,
		borderColor: Colors.border,
		borderRadius: BorderRadius.md,
		paddingHorizontal: Spacing.md,
		paddingVertical: Spacing.sm + 4,
		fontSize: FontSizes.md,
		color: Colors.textPrimary,
		minHeight: 80,
		textAlignVertical: 'top',
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: Spacing.md,
	},
	halfWidth: {
		flex: 1,
	},
	pickerContainer: {
		backgroundColor: Colors.surface,
		borderWidth: 1,
		borderColor: Colors.border,
		borderRadius: BorderRadius.md,
		overflow: 'hidden',
	},
	pickerPlaceholder: {
		color: Colors.textSecondary,
		padding: Spacing.sm + 4,
		paddingHorizontal: Spacing.md,
		fontSize: FontSizes.md,
	},
	pickerItem: {
		padding: Spacing.sm + 2,
		paddingHorizontal: Spacing.md,
		borderBottomWidth: 1,
		borderBottomColor: Colors.divider,
	},
	pickerItemText: {
		fontSize: FontSizes.md,
		color: Colors.textPrimary,
	},
	pickerItemSelected: {
		backgroundColor: Colors.secondary,
	},
	pickerItemTextSelected: {
		color: Colors.primary,
		fontWeight: FontWeights.semibold,
	},
	datePickerButton: {
		backgroundColor: Colors.surface,
		borderWidth: 1,
		borderColor: Colors.border,
		borderRadius: BorderRadius.md,
		paddingHorizontal: Spacing.md,
		paddingVertical: Spacing.sm + 4,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	datePickerText: {
		fontSize: FontSizes.md,
		color: Colors.textPrimary,
	},
	datePickerPlaceholder: {
		fontSize: FontSizes.md,
		color: Colors.textSecondary,
	},
	datePickerIcon: {
		fontSize: FontSizes.lg,
		color: Colors.primary,
	},
	submitButton: {
		backgroundColor: Colors.primary,
		paddingVertical: Spacing.md,
		borderRadius: BorderRadius.md,
		alignItems: 'center',
		marginTop: Spacing.lg,
		...Shadows.md,
	},
	submitButtonDisabled: {
		backgroundColor: Colors.border,
		opacity: 0.6,
	},
	submitButtonText: {
		color: Colors.textLight,
		fontSize: FontSizes.lg,
		fontWeight: FontWeights.bold,
	},
	cancelButton: {
		backgroundColor: Colors.surface,
		paddingVertical: Spacing.md,
		borderRadius: BorderRadius.md,
		alignItems: 'center',
		marginTop: Spacing.md,
		borderWidth: 1,
		borderColor: Colors.border,
	},
	cancelButtonText: {
		color: Colors.textSecondary,
		fontSize: FontSizes.md,
		fontWeight: FontWeights.semibold,
	},
	helpText: {
		fontSize: FontSizes.sm,
		color: Colors.textSecondary,
		marginTop: Spacing.xs,
		fontStyle: 'italic',
	},
});
