import axios from 'axios';
import { API_CONFIG } from '../config/app.config';

/**
 * Utilidad para debuggear la conexión con el backend
 */
export const testBackendConnection = async () => {
    console.log('🔍 Testing backend connection...');
    console.log('📍 Base URL:', API_CONFIG.BASE_URL);

    try {
        // Test 1: Probar si el backend está disponible
        const healthCheck = await axios.get(
            API_CONFIG.BASE_URL.replace('/api/v1', '') + '/api/v1/health',
            { timeout: 5000 }
        );
        console.log('✅ Backend is reachable:', healthCheck.status);
        console.log('📊 Health check response:', healthCheck.data);

        // Test 2: Probar el endpoint de registro con datos válidos
        try {
            const testEmail = `test${Date.now()}@example.com`;
            const registerResponse = await axios.post(
                `${API_CONFIG.BASE_URL}/auth/register`,
                {
                    email: testEmail,
                    password: 'TestPassword123',
                    confirmPassword: 'TestPassword123',
                },
                { timeout: 10000 }
            );
            console.log('✅ Registration endpoint working:', registerResponse.status);
            return true;
        } catch (registerError: any) {
            if (registerError.response) {
                console.log('📝 Registration endpoint responded with:', {
                    status: registerError.response.status,
                    data: registerError.response.data,
                });
                // Si responde, aunque sea con error, significa que el endpoint funciona
                return true;
            }
            throw registerError;
        }
    } catch (error: any) {
        console.error('❌ Backend connection failed:');
        if (error.response) {
            console.error('Response error:', {
                status: error.response.status,
                data: error.response.data,
            });
        } else if (error.request) {
            console.error('No response received. Backend might be down or unreachable.');
            console.error('Check if:');
            console.error('1. Backend is running on port 3001');
            console.error('2. BASE_URL is correct:', API_CONFIG.BASE_URL);
            console.error('3. You\'re using the right IP (10.0.2.2 for Android emulator)');
        } else {
            console.error('Error:', error.message);
        }
        return false;
    }
};

/**
 * Test para verificar si el problema es con la validación
 */
export const testRegisterValidation = async () => {
    console.log('🔍 Testing register validation...');

    const testCases = [
        {
            name: 'Valid data',
            data: {
                email: `test${Date.now()}@example.com`,
                password: 'Password123',
                confirmPassword: 'Password123',
            },
            shouldFail: false,
        },
        {
            name: 'Invalid email',
            data: {
                email: 'notanemail',
                password: 'Password123',
                confirmPassword: 'Password123',
            },
            shouldFail: true,
        },
        {
            name: 'Password too short',
            data: {
                email: `test${Date.now()}@example.com`,
                password: 'Pass1',
                confirmPassword: 'Pass1',
            },
            shouldFail: true,
        },
        {
            name: 'Passwords don\'t match',
            data: {
                email: `test${Date.now()}@example.com`,
                password: 'Password123',
                confirmPassword: 'Password456',
            },
            shouldFail: true,
        },
    ];

    for (const testCase of testCases) {
        try {
            console.log(`\n📝 Test: ${testCase.name}`);
            const response = await axios.post(
                `${API_CONFIG.BASE_URL}/auth/register`,
                testCase.data,
                { timeout: 10000 }
            );

            if (testCase.shouldFail) {
                console.log(`⚠️  Expected to fail but succeeded:`, response.status);
            } else {
                console.log(`✅ Success as expected:`, response.status);
            }
        } catch (error: any) {
            if (testCase.shouldFail) {
                console.log(`✅ Failed as expected:`, error.response?.status, error.response?.data);
            } else {
                console.log(`❌ Should have succeeded but failed:`, error.response?.status, error.response?.data);
            }
        }
    }
};
