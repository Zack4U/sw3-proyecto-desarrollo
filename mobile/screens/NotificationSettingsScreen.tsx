import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNotificationContext } from '../contexts/NotificationContext';

export const NotificationSettingsScreen = () => {
    const { expoPushToken, sendTestNotification } = useNotificationContext();

    const handleTestNotification = async () => {
        try {
            await sendTestNotification();
            Alert.alert('✅ Éxito', 'Notificación de prueba enviada');
        } catch (error) {
            Alert.alert('❌ Error', 'No se pudo enviar la notificación');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Configuración de Notificaciones</Text>

            <View style={styles.section}>
                <Text style={styles.label}>Estado del Token:</Text>
                <Text style={styles.value}>
                    {expoPushToken ? '✅ Registrado' : '❌ No registrado'}
                </Text>
            </View>

            {expoPushToken && (
                <View style={styles.section}>
                    <Text style={styles.label}>Token:</Text>
                    <Text style={styles.tokenText} numberOfLines={2}>
                        {expoPushToken}
                    </Text>
                </View>
            )}

            <TouchableOpacity style={styles.button} onPress={handleTestNotification}>
                <Text style={styles.buttonText}>Enviar Notificación de Prueba</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    section: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },
    value: {
        fontSize: 16,
        color: '#666',
    },
    tokenText: {
        fontSize: 12,
        color: '#999',
        fontFamily: 'monospace',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});