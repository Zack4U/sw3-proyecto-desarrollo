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
    list: {
        paddingBottom: Spacing.lg,
    },
    card: {
        marginBottom: 24, // o Spacing.lg si usas tu sistema de espaciado
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        // Sombra ligera
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    name: {
        ...GlobalStyles.headerTitle,
        fontSize: 18,
        marginBottom: Spacing.xs,
        color: Colors.primary,
    },
    address: {
        ...GlobalStyles.label,
        color: Colors.textSecondary,
        marginBottom: Spacing.xs,
    },
    type: {
        ...GlobalStyles.label,
        color: Colors.secondary,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginTop: 12,
    },
    icon: {
        fontSize: 28,
        marginBottom: 8,
    },
});