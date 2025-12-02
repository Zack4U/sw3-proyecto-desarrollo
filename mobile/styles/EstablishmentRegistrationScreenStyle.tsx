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
	form: {
		...GlobalStyles.form,
	},
	inputGroup: {
		...GlobalStyles.inputGroup,
	},
	label: {
		...GlobalStyles.label,
	},
	input: {
		...GlobalStyles.input,
	},
	submitButton: {
		...GlobalStyles.buttonPrimary,
		marginTop: Spacing.sm,
	},
	submitButtonDisabled: {
		...GlobalStyles.buttonDisabled,
	},
	submitButtonText: {
		...GlobalStyles.buttonTextPrimary,
	},
	cancelButton: {
		...GlobalStyles.buttonText,
		marginTop: Spacing.sm,
	},
	cancelButtonText: {
		...GlobalStyles.buttonTextGhost,
	},
});
