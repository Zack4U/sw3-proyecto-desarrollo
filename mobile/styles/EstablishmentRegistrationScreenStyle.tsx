import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	header: {
		backgroundColor: '#2e7d32',
		padding: 30,
		paddingTop: 60,
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		color: 'white',
		marginBottom: 5,
	},
	subtitle: {
		fontSize: 16,
		color: '#e8f5e9',
	},
	form: {
		padding: 20,
		maxWidth: 500,
		width: '100%',
		alignSelf: 'center',
	},
	inputGroup: {
		marginBottom: 20,
	},
	label: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
		marginBottom: 8,
	},
	input: {
		backgroundColor: 'white',
		padding: 15,
		borderRadius: 8,
		fontSize: 16,
		borderWidth: 1,
		borderColor: '#ddd',
	},
	submitButton: {
		backgroundColor: '#2e7d32',
		padding: 18,
		borderRadius: 8,
		alignItems: 'center',
		marginTop: 10,
	},
	submitButtonDisabled: {
		backgroundColor: '#81c784',
		opacity: 0.6,
	},
	submitButtonText: {
		color: 'white',
		fontSize: 18,
		fontWeight: '600',
	},
	cancelButton: {
		backgroundColor: 'transparent',
		padding: 18,
		borderRadius: 8,
		alignItems: 'center',
		marginTop: 10,
	},
	cancelButtonText: {
		color: '#666',
		fontSize: 16,
	},
});
