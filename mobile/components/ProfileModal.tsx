import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image, ScrollView } from 'react-native';
import { User } from '../types/auth.types';
import { styles as homeStyles } from '../styles/HomeScreenStyle';

interface ProfileModalProps {
	visible: boolean;
	user: User | null;
	onClose: () => void;
}

export default function ProfileModal({
	visible,
	user,
	onClose,
}: Readonly<ProfileModalProps>) {
	if (!user) return null;

	const getRoleBadgeColor = (role: string) => {
		return role === 'ESTABLISHMENT' ? '#FF6B6B' : '#4CAF50';
	};

	const getRoleLabel = (role: string) => {
		return role === 'ESTABLISHMENT' ? 'Establecimiento' : 'Beneficiario';
	};

	return (
		<Modal
			visible={visible}
			animationType="slide"
			transparent={true}
			onRequestClose={onClose}
		>
			<View style={styles.overlay}>
				<View style={styles.modalContainer}>
					{/* Header */}
					<View style={styles.modalHeader}>
						<Text style={styles.modalTitle}>Mi Perfil</Text>
						<TouchableOpacity onPress={onClose} style={styles.closeButton}>
							<Text style={styles.closeButtonText}>✕</Text>
						</TouchableOpacity>
					</View>

					{/* Content */}
					<ScrollView style={styles.modalContent}>
						{/* Profile Picture */}
						<View style={styles.profilePictureContainer}>
							{user.picture ? (
								<Image source={{ uri: user.picture }} style={styles.profilePicture} />
							) : (
								<View style={styles.profilePictureDefault}>
									<Text style={styles.profilePictureDefaultText}>
										{user.email?.charAt(0).toUpperCase()}
									</Text>
								</View>
							)}
						</View>

						{/* User Info */}
						<View style={styles.infoSection}>
							<Text style={styles.infoLabel}>Email</Text>
							<Text style={styles.infoValue}>{user.email}</Text>
						</View>

						{user.username && (
							<View style={styles.infoSection}>
								<Text style={styles.infoLabel}>Usuario</Text>
								<Text style={styles.infoValue}>{user.username}</Text>
							</View>
						)}

						{user.documentNumber && (
							<View style={styles.infoSection}>
								<Text style={styles.infoLabel}>Documento</Text>
								<Text style={styles.infoValue}>{user.documentNumber}</Text>
							</View>
						)}

						{/* Role Badge */}
						<View style={styles.infoSection}>
							<Text style={styles.infoLabel}>Rol</Text>
							<View
								style={[
									styles.roleBadge,
									{
										backgroundColor: getRoleBadgeColor(user.role),
									},
								]}
							>
								<Text style={styles.roleBadgeText}>{getRoleLabel(user.role)}</Text>
							</View>
						</View>

						{/* Status */}
						<View style={styles.infoSection}>
							<Text style={styles.infoLabel}>Estado</Text>
							<View
								style={[
									styles.statusBadge,
									{
										backgroundColor: user.isActive ? '#4CAF50' : '#FFC107',
									},
								]}
							>
								<Text style={styles.statusBadgeText}>
									{user.isActive ? 'Activo' : 'Inactivo'}
								</Text>
							</View>
						</View>

						{/* Verification Status */}
						<View style={styles.infoSection}>
							<Text style={styles.infoLabel}>Verificación</Text>
							<View
								style={[
									styles.statusBadge,
									{
										backgroundColor: user.isVerified ? '#4CAF50' : '#FFC107',
									},
								]}
							>
								<Text style={styles.statusBadgeText}>
									{user.isVerified ? 'Verificado' : 'No verificado'}
								</Text>
							</View>
						</View>

						{/* User ID */}
						<View style={styles.infoSection}>
							<Text style={styles.infoLabel}>ID de Usuario</Text>
							<Text style={styles.userIdValue}>{user.userId}</Text>
						</View>
					</ScrollView>
				</View>
			</View>
		</Modal>
	);
}

const styles = {
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'flex-end' as const,
	},
	modalContainer: {
		backgroundColor: '#fff',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		flex: 0.9,
	},
	modalHeader: {
		flexDirection: 'row' as const,
		justifyContent: 'space-between' as const,
		alignItems: 'center' as const,
		paddingHorizontal: 20,
		paddingVertical: 15,
		borderBottomWidth: 1,
		borderBottomColor: '#e0e0e0',
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: 'bold' as const,
		color: '#333',
	},
	closeButton: {
		padding: 10,
	},
	closeButtonText: {
		fontSize: 24,
		color: '#999',
	},
	modalContent: {
		flex: 1,
		paddingHorizontal: 20,
		paddingVertical: 20,
	},
	profilePictureContainer: {
		alignItems: 'center' as const,
		marginBottom: 30,
	},
	profilePicture: {
		width: 100,
		height: 100,
		borderRadius: 50,
	},
	profilePictureDefault: {
		width: 100,
		height: 100,
		borderRadius: 50,
		backgroundColor: '#4CAF50',
		justifyContent: 'center' as const,
		alignItems: 'center' as const,
	},
	profilePictureDefaultText: {
		fontSize: 40,
		fontWeight: 'bold' as const,
		color: '#fff',
	},
	infoSection: {
		marginBottom: 20,
	},
	infoLabel: {
		fontSize: 12,
		fontWeight: '600' as const,
		color: '#999',
		marginBottom: 5,
		textTransform: 'uppercase' as const,
	},
	infoValue: {
		fontSize: 16,
		color: '#333',
		fontWeight: '500' as const,
	},
	userIdValue: {
		fontSize: 13,
		color: '#666',
		fontWeight: '400' as const,
		fontFamily: 'monospace',
	},
	roleBadge: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 20,
		alignSelf: 'flex-start' as const,
	},
	roleBadgeText: {
		color: '#fff',
		fontSize: 13,
		fontWeight: '600' as const,
	},
	statusBadge: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 20,
		alignSelf: 'flex-start' as const,
	},
	statusBadgeText: {
		color: '#fff',
		fontSize: 13,
		fontWeight: '600' as const,
	},
	modalFooter: {
		paddingHorizontal: 20,
		paddingVertical: 15,
		borderTopWidth: 1,
		borderTopColor: '#e0e0e0',
	},
	closeModalButton: {
		backgroundColor: '#4CAF50',
		paddingVertical: 12,
		borderRadius: 8,
		alignItems: 'center' as const,
	},
	closeModalButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600' as const,
	},
};
