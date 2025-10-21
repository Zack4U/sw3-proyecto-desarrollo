import { StyleSheet } from 'react-native';

// Paleta de colores actualizada - ComiYa
export const Colors = {
	// Colores principales (Verdes)
	primary: '#3CA55C', // Verde medio - Color principal, botones, encabezados, elementos destacados
	secondary: '#A7D46F', // Verde claro - Fondos de tarjetas, hover o íconos secundarios

	// Degradados (para fondos especiales)
	gradientTop: '#B4EC51', // Degradado superior - Parte superior del fondo o splash screen
	gradientBottom: '#429321', // Degradado inferior - Parte inferior del fondo o áreas de profundidad

	// Acento cálido
	accent: '#F9A825', // Acento cálido - Íconos de alerta, resaltado de alimentos próximos a vencer

	// Textos
	textPrimary: '#2E2E2E', // Texto general
	textSecondary: '#6B6B6B', // Descripciones o texto menos relevante

	// Fondos
	background: '#F8FDF5', // Fondo claro - Fondo general de la aplicación
	surface: '#FFFFFF', // Blanco puro - Íconos, tarjetas, contraste con los verdes

	// Estados
	success: '#3CA55C', // Mismo que primary
	error: '#F44336', // Rojo para errores
	warning: '#F9A825', // Mismo que accent
	info: '#2196F3', // Azul para información

	// Bordes y divisores
	border: '#E0E0E0',
	divider: '#BDBDBD',

	// Sombras y overlays
	shadow: '#000000',
	overlay: 'rgba(0, 0, 0, 0.5)',

	// Alias adicionales para facilitar el uso
	textLight: '#FFFFFF', // Texto sobre fondos oscuros
};

// Espaciado consistente
export const Spacing = {
	xs: 4,
	sm: 8,
	md: 16,
	lg: 24,
	xl: 32,
	xxl: 48,
};

// Tamaños de fuente
export const FontSizes = {
	xs: 12,
	sm: 14,
	md: 16,
	lg: 18,
	xl: 24,
	xxl: 32,
	xxxl: 42,
};

// Pesos de fuente
export const FontWeights = {
	regular: '400' as const,
	medium: '500' as const,
	semibold: '600' as const,
	bold: '700' as const,
};

// Border radius
export const BorderRadius = {
	sm: 4,
	md: 8,
	lg: 12,
	xl: 16,
	round: 999,
};

// Sombras
export const Shadows = {
	sm: {
		shadowColor: Colors.shadow,
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	md: {
		shadowColor: Colors.shadow,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.15,
		shadowRadius: 4,
		elevation: 4,
	},
	lg: {
		shadowColor: Colors.shadow,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 8,
	},
};

// Estilos globales reutilizables
export const GlobalStyles = StyleSheet.create({
	// Contenedores
	container: {
		flex: 1,
		backgroundColor: Colors.background,
	},
	containerPadded: {
		flex: 1,
		backgroundColor: Colors.background,
		padding: Spacing.md,
	},
	scrollContainer: {
		flex: 1,
		backgroundColor: Colors.background,
	},

	// Cards y superficies
	card: {
		backgroundColor: Colors.surface,
		borderRadius: BorderRadius.lg,
		padding: Spacing.lg,
		...Shadows.md,
	},
	cardCompact: {
		backgroundColor: Colors.surface,
		borderRadius: BorderRadius.md,
		padding: Spacing.md,
		...Shadows.sm,
	},

	// Headers
	header: {
		backgroundColor: Colors.primary,
		padding: Spacing.xl,
		paddingTop: 60,
	},
	headerTitle: {
		fontSize: FontSizes.xxl,
		fontWeight: FontWeights.bold,
		color: Colors.textLight,
		marginBottom: Spacing.xs,
	},
	headerSubtitle: {
		fontSize: FontSizes.md,
		color: Colors.textLight,
		opacity: 0.9,
	},

	// Textos
	title: {
		fontSize: FontSizes.xxl,
		fontWeight: FontWeights.bold,
		color: Colors.textPrimary,
		marginBottom: Spacing.sm,
	},
	subtitle: {
		fontSize: FontSizes.lg,
		fontWeight: FontWeights.semibold,
		color: Colors.textPrimary,
		marginBottom: Spacing.sm,
	},
	body: {
		fontSize: FontSizes.md,
		color: Colors.textPrimary,
		lineHeight: 24,
	},
	caption: {
		fontSize: FontSizes.sm,
		color: Colors.textSecondary,
	},

	// Formularios
	form: {
		padding: Spacing.md,
		maxWidth: 500,
		width: '100%',
		alignSelf: 'center',
	},
	inputGroup: {
		marginBottom: Spacing.md,
	},
	label: {
		fontSize: FontSizes.md,
		fontWeight: FontWeights.semibold,
		color: Colors.textPrimary,
		marginBottom: Spacing.sm,
	},
	input: {
		backgroundColor: Colors.surface,
		padding: Spacing.md,
		borderRadius: BorderRadius.md,
		fontSize: FontSizes.md,
		borderWidth: 1,
		borderColor: Colors.border,
		color: Colors.textPrimary,
	},
	inputFocused: {
		borderColor: Colors.primary,
		borderWidth: 2,
	},
	inputError: {
		borderColor: Colors.error,
	},
	errorText: {
		fontSize: FontSizes.sm,
		color: Colors.error,
		marginTop: Spacing.xs,
	},

	// Botones
	buttonPrimary: {
		backgroundColor: Colors.primary,
		padding: Spacing.lg,
		borderRadius: BorderRadius.md,
		alignItems: 'center',
		justifyContent: 'center',
		...Shadows.sm,
	},
	buttonSecondary: {
		backgroundColor: Colors.secondary,
		padding: Spacing.lg,
		borderRadius: BorderRadius.md,
		alignItems: 'center',
		justifyContent: 'center',
		...Shadows.sm,
	},
	buttonAccent: {
		backgroundColor: Colors.accent,
		padding: Spacing.lg,
		borderRadius: BorderRadius.md,
		alignItems: 'center',
		justifyContent: 'center',
		...Shadows.sm,
	},
	buttonOutline: {
		backgroundColor: 'transparent',
		padding: Spacing.lg,
		borderRadius: BorderRadius.md,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 2,
		borderColor: Colors.primary,
	},
	buttonText: {
		backgroundColor: 'transparent',
		padding: Spacing.lg,
		borderRadius: BorderRadius.md,
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonDisabled: {
		opacity: 0.5,
	},
	buttonTextPrimary: {
		color: Colors.textLight,
		fontSize: FontSizes.lg,
		fontWeight: FontWeights.semibold,
	},
	buttonTextSecondary: {
		color: Colors.textLight,
		fontSize: FontSizes.lg,
		fontWeight: FontWeights.semibold,
	},
	buttonTextOutline: {
		color: Colors.primary,
		fontSize: FontSizes.lg,
		fontWeight: FontWeights.semibold,
	},
	buttonTextAccent: {
		color: Colors.textLight,
		fontSize: FontSizes.lg,
		fontWeight: FontWeights.semibold,
	},
	buttonTextGhost: {
		color: Colors.textSecondary,
		fontSize: FontSizes.md,
	},

	// Centrado y alineación
	centerContent: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	rowSpaceBetween: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	rowCenter: {
		flexDirection: 'row',
		alignItems: 'center',
	},

	// Espaciado
	mb_xs: { marginBottom: Spacing.xs },
	mb_sm: { marginBottom: Spacing.sm },
	mb_md: { marginBottom: Spacing.md },
	mb_lg: { marginBottom: Spacing.lg },
	mb_xl: { marginBottom: Spacing.xl },

	mt_xs: { marginTop: Spacing.xs },
	mt_sm: { marginTop: Spacing.sm },
	mt_md: { marginTop: Spacing.md },
	mt_lg: { marginTop: Spacing.lg },
	mt_xl: { marginTop: Spacing.xl },

	// Divider
	divider: {
		height: 1,
		backgroundColor: Colors.divider,
		marginVertical: Spacing.md,
	},
});
