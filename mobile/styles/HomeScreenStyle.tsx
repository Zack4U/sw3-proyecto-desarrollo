import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
		padding: 20,
		justifyContent: 'center',
	},
	title: {
		fontSize: 42,
		fontWeight: 'bold',
		color: '#2e7d32',
		textAlign: 'center',
		marginBottom: 10,
	},
	subtitle: {
		fontSize: 16,
		color: '#666',
		textAlign: 'center',
		marginBottom: 50,
	},
	menuContainer: {
		gap: 20,
	},
	menuButton: {
		backgroundColor: 'white',
		padding: 25,
		borderRadius: 15,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	establishmentButton: {
		borderLeftWidth: 5,
		borderLeftColor: '#2e7d32',
	},
	beneficiaryButton: {
		borderLeftWidth: 5,
		borderLeftColor: '#1976d2',
	},
	buttonIcon: {
		fontSize: 48,
		marginBottom: 10,
	},
	buttonText: {
		fontSize: 20,
		fontWeight: '600',
		color: '#333',
		marginBottom: 5,
	},
	buttonDescription: {
		fontSize: 14,
		color: '#666',
		textAlign: 'center',
	},
});
