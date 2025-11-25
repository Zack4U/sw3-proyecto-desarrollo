import { BaseToastProps } from 'react-native-toast-message';
import { Colors } from '../styles/global';

/**
 * Configuración personalizada de estilos para los toasts
 * Define el aspecto visual de cada tipo de toast
 */
export const toastConfig = {
	success: (props: BaseToastProps) => ({
		style: {
			borderLeftColor: Colors.success || '#10B981',
			borderLeftWidth: 5,
			backgroundColor: '#FFFFFF',
			paddingVertical: 12,
			paddingHorizontal: 16,
			borderRadius: 8,
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.25,
			shadowRadius: 3.84,
			elevation: 5,
		},
		text1Style: {
			fontSize: 16,
			fontWeight: '600',
			color: '#1F2937',
		},
		text2Style: {
			fontSize: 14,
			color: '#6B7280',
			marginTop: 4,
		},
	}),

	error: (props: BaseToastProps) => ({
		style: {
			borderLeftColor: Colors.error || '#EF4444',
			borderLeftWidth: 5,
			backgroundColor: '#FFFFFF',
			paddingVertical: 12,
			paddingHorizontal: 16,
			borderRadius: 8,
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.25,
			shadowRadius: 3.84,
			elevation: 5,
		},
		text1Style: {
			fontSize: 16,
			fontWeight: '600',
			color: '#1F2937',
		},
		text2Style: {
			fontSize: 14,
			color: '#6B7280',
			marginTop: 4,
		},
	}),

	info: (props: BaseToastProps) => ({
		style: {
			borderLeftColor: Colors.primary || '#3B82F6',
			borderLeftWidth: 5,
			backgroundColor: '#FFFFFF',
			paddingVertical: 12,
			paddingHorizontal: 16,
			borderRadius: 8,
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.25,
			shadowRadius: 3.84,
			elevation: 5,
		},
		text1Style: {
			fontSize: 16,
			fontWeight: '600',
			color: '#1F2937',
		},
		text2Style: {
			fontSize: 14,
			color: '#6B7280',
			marginTop: 4,
		},
	}),
};
