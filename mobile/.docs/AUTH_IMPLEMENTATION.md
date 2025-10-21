# 🔐 Sistema de Autenticación Completo - Implementación

Este documento describe cómo se ha implementado el sistema de autenticación completo en tu app mobile ComiYa.

## ✅ Lo que se implementó

### 1. **Persistencia de Tokens** 
- ✅ `expo-secure-store`: Almacenamiento seguro de tokens JWT
- Tokens guardados en el dispositivo de forma segura
- Información del usuario persistida

### 2. **Contexto de Autenticación Global** (`contexts/AuthContext.tsx`)
- ✅ Gestión centralizada del estado de autenticación
- ✅ Persistencia automática de sesión
- ✅ Refresh automático de tokens
- ✅ Métodos: `login()`, `register()`, `logout()`, `refreshTokens()`

### 3. **Interceptores JWT** (`services/api.ts`)
- ✅ Agregación automática de Authorization header
- ✅ Refresh automático cuando recibe 401
- ✅ Reintento automático de requests fallidas por expiración
- ✅ Manejo de errores de red y servidor

### 4. **Pantallas Implementadas**
- ✅ **LoginScreen**: Login con email/usuario/documento y contraseña
- ✅ **BeneficiaryRegistrationScreen**: Registro de beneficiarios
- ✅ **EstablishmentRegistrationScreen**: Registro de establecimientos
- ✅ **SplashScreen**: Validación de sesión al iniciar la app

### 5. **Google Sign-In** (`hooks/useGoogleSignIn.ts`)
- ✅ Hook para manejar autenticación con Google
- Usa `expo-auth-session` y `@react-native-google-signin/google-signin`
- Obtiene información del usuario automáticamente

### 6. **Navegación Condicional** (`App.tsx`)
- ✅ Mostrá Login si no hay sesión
- ✅ Mostrá Home si hay sesión válida
- ✅ Persistencia de sesión entre reinicios de app

## 🔧 Configuración Necesaria

### 1. Configurar Google Sign-In

Necesitas agregar tus credenciales de Google en `.env`:

```bash
EXPO_PUBLIC_GOOGLE_CLIENT_ID=tu-google-client-id.apps.googleusercontent.com
```

Obtén las credenciales en: https://console.cloud.google.com

En `app.json`, agrega:

```json
{
  "plugins": [
    [
      "@react-native-google-signin/google-signin",
      {
        "disableAutoAuth": false
      }
    ]
  ]
}
```

### 2. Configurar la URL del Backend

En `config/app.config.ts`:

```typescript
export const API_CONFIG = {
    // Para desarrollo local (emulador Android)
    BASE_URL: 'http://10.0.2.2:3000',
    // Para dispositivo físico
    // BASE_URL: 'http://192.168.1.X:3000',
    TIMEOUT: 10000,
};
```

## 🔑 Cómo Usar

### Login Simple

```typescript
import { useAuth } from '../hooks/useAuth';

export default function MyComponent() {
  const { login, error, isLoading } = useAuth();

  const handleLogin = async () => {
    try {
      await login({
        identifier: 'user@email.com',
        password: 'password123'
      });
      // Automáticamente se navega a Home
    } catch (e) {
      console.error('Error:', e);
    }
  };

  return (
    <Button 
      onPress={handleLogin} 
      disabled={isLoading}
      title="Iniciar Sesión"
    />
  );
}
```

### Registro de Beneficiario

```typescript
const { registerBeneficiary } = useAuth();

await registerBeneficiary({
  email: 'user@email.com',
  username: 'username',
  password: 'SecurePassword123!',
  confirmPassword: 'SecurePassword123!'
});
```

### Registro de Establecimiento

```typescript
const { registerEstablishment } = useAuth();

await registerEstablishment({
  email: 'establishment@email.com',
  establishmentName: 'Mi Restaurante',
  password: 'SecurePassword123!',
  confirmPassword: 'SecurePassword123!'
});
```

### Login con Google

```typescript
import { useGoogleSignIn } from '../hooks/useGoogleSignIn';
import { useAuth } from '../hooks/useAuth';

export default function GoogleLoginButton() {
  const { googleUser, signIn } = useGoogleSignIn();
  const { loginWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    signIn();
    if (googleUser) {
      await loginWithGoogle(googleUser, 'beneficiary');
    }
  };

  return <Button onPress={handleGoogleSignIn} title="Login con Google" />;
}
```

### Logout

```typescript
const { logout } = useAuth();

const handleLogout = async () => {
  await logout();
  // Automáticamente se navega a Login
};
```

### Acceder a Datos del Usuario

```typescript
const { user, accessToken, isAuthenticated } = useAuth();

if (isAuthenticated && user) {
  console.log('Usuario:', user.email);
  console.log('Rol:', user.role);
}
```

## 🛠️ Flujos de Funcionamiento

### Primer acceso a la app

```
1. App inicia
2. SplashScreen valida token almacenado
3. Si token válido → Navigate to Home
4. Si token inválido/no existe → Navigate to Login
```

### Login exitoso

```
1. Usuario ingresa credentials
2. API devuelve accessToken + refreshToken
3. Tokens se guardan en SecureStore
4. Usuario se guarda en SecureStore
5. Contexto se actualiza
6. App navega a Home automáticamente
```

### Request con token expirado

```
1. Request falla con 401
2. Interceptor detecta 401
3. Interceptor intenta refresh con refreshToken
4. Si refresh exitoso → reintentar request original
5. Si refresh falla → logout automático
```

### Sesión persiste 7 días

```
- refreshToken tiene validez de 7 días
- Si usuario no abre app en 7 días → logout automático
- Si usuario abre app dentro de 7 días → sesión restaurada
```

## 📦 Estructura de Carpetas Creadas

```
mobile/
├── contexts/
│   └── AuthContext.tsx           ← Contexto global de auth
├── types/
│   └── auth.types.ts              ← Interfaces y tipos
├── services/
│   ├── api.ts                     ← Cliente HTTP con interceptores
│   └── authService.ts             ← Métodos de autenticación
├── hooks/
│   ├── useAuth.ts                 ← Hook del contexto
│   └── useGoogleSignIn.ts         ← Hook de Google Sign-In
└── screens/
    ├── SplashScreen.tsx           ← Validación de sesión
    ├── LoginScreen.tsx            ← Login mejorado
    ├── BeneficiaryRegistrationScreen.tsx
    └── EstablishmentRegistrationScreen.tsx
```

## 🔒 Seguridad

- ✅ Tokens almacenados en `SecureStore` (no en localStorage)
- ✅ Access tokens cortos (1 hora)
- ✅ Refresh tokens más largos (7 días)
- ✅ Refresh automático antes de expiración
- ✅ Interceptores manejan errores 401
- ✅ Logout automático si refresh falla

## 🚀 Siguientes pasos

1. **Agregar Google Sign-In completamente:**
   - Configurar credenciales de Google
   - Integrar botón de Google en LoginScreen y RegisterOptionsScreen

2. **Agregar más funcionalidades:**
   - Cambiar contraseña
   - Recuperar contraseña (reset)
   - Actualizar perfil
   - Verificación de email

3. **Testing:**
   - Pruebas de login/register
   - Pruebas de refresh token
   - Pruebas de persistencia

## 📝 Notas Importantes

- El `isInitializing` se usa para mostrar SplashScreen mientras se valida la sesión
- El refresh automático ocurre en background, sin molestar al usuario
- Los tokens se limpian automáticamente al hacer logout
- Los errores de autenticación se muestran en pantalla mediante `FeedbackMessage`

¡Tu sistema de autenticación está listo! 🎉
