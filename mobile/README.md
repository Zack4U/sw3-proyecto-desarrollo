# ComiYa - Aplicación Móvil

Aplicación móvil de **ComiYa** desarrollada con React Native y Expo. Esta app conecta restaurantes que tienen alimentos por vencer con beneficiarios que necesitan alimentos, reduciendo el desperdicio alimentario y ayudando a la comunidad.

## 🌟 Características Principales

- 🔐 **Autenticación Completa**: Login, registro, Google Sign-In con persistencia de sesión
- 🍽️ **Gestión de Establecimientos**: Registro, edición de perfil y gestión de alimentos
- 👥 **Gestión de Beneficiarios**: Registro, perfil y visualización de alimentos disponibles
- 🗺️ **Mapas Interactivos**: Visualización de establecimientos con React Native Maps
- 🔔 **Notificaciones Push**: Sistema de notificaciones en tiempo real con Expo Notifications
- 📍 **Verificación de Direcciones**: Validación de direcciones con ubicación GPS
- 🎨 **UI/UX Moderna**: Sistema de diseño consistente con componentes reutilizables

## 📋 Requisitos Previos

- **Node.js** (v18 o superior)
- **npm** o **yarn**
- **Expo Go** (app móvil para pruebas en iOS/Android)
- **Google Maps API Key** (para funcionalidad de mapas)
- **Google OAuth Client ID** (para autenticación con Google)
- **Android Studio** (para simulacion de dispositivo Android o similar)

## ⚙️ Configuración Inicial

### 1. Configurar Variables de Entorno

El proyecto usa `.env` para configuración sensible. **Este archivo NO se sube a GitHub**.

1. Copia el archivo de ejemplo:
```bash
cp .env.example .env.local
```

2. Edita `.env` y agrega tus credenciales:
```bash
# Ejemplo de archivo de configuración de entorno
# Copia este archivo como .env y ajusta los valores según tu entorno

# URL del backend
# Para desarrollo local (emulador iOS o web)
API_BASE_URL=http://localhost:3000

# Para emulador Android
# API_BASE_URL=http://10.0.2.2:3000

# Para dispositivo físico (reemplaza con tu IP)
# API_BASE_URL=http://192.168.1.X:3000

# Timeout de peticiones (en milisegundos)
API_TIMEOUT=10000

# Google Maps API Key
# Obtén la clave de: https://console.cloud.google.com
# Habilita: Geocoding API, Maps JavaScript API, Places API
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Google OAuth 2.0 Client IDs
# Obtén las credenciales de: https://console.cloud.google.com
# Para web
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-google-web-client-id.apps.googleusercontent.com
# Para iOS
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-google-ios-client-id.apps.googleusercontent.com
# Para Android
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your-google-android-client-id.apps.googleusercontent.com

```

### 2. Configurar app.json

El archivo `app.json` contiene la configuración de Expo. Por seguridad, **no se sube a GitHub**.

1. Copia el archivo de ejemplo:
```bash
cp app.json.example app.json
```

2. Edita `app.json` y reemplaza los valores de ejemplo:
```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "TU_GOOGLE_MAPS_API_KEY_AQUI"
        }
      }
    },
    "plugins": [
      [
        "react-native-maps",
        {
          "androidGoogleMapsApiKey": "TU_GOOGLE_MAPS_API_KEY_AQUI"
        }
      ]
    ],
    "extra": {
      "eas": {
        "projectId": "tu-eas-project-id"
      }
    }
  }
}
```

> **⚠️ Importante**: Los archivos `.env.local` y `app.json` están en `.gitignore` para proteger tus credenciales.

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Configurar Backend

Asegúrate de que el backend esté corriendo. Actualiza la URL en `.env.local`:

```bash
# Para emulador Android
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000

# Para emulador iOS o web
EXPO_PUBLIC_API_URL=http://localhost:3000

# Para dispositivo físico (reemplaza con tu IP)
EXPO_PUBLIC_API_URL=http://192.168.1.X:3000
```

**Encontrar tu IP:**
- Windows: `ipconfig` (busca "Dirección IPv4")
- macOS/Linux: `ifconfig` (busca "inet")

## 🏃‍♂️ Ejecutar la Aplicación

### Iniciar el servidor de desarrollo

```bash
npm start
```

O usando npx:

```bash
npx expo start
```

### Opciones de ejecución

Una vez iniciado el servidor, verás un código QR en la terminal. Puedes:

- **📱 Dispositivo físico**: Escanea el código QR con la app **Expo Go**

  - En iOS: Usa la cámara del iPhone
  - En Android: Usa la app Expo Go

- **🖥️ Emulador Android**: Presiona `a` en la terminal
- **🖥️ Emulador iOS** (solo macOS): Presiona `i` en la terminal
- **🌐 Navegador Web**: Presiona `w` en la terminal

## 📲 Crear Build de Desarrollo (Development Build)

Expo ofrece dos formas de ejecutar tu aplicación: con **Expo Go** (más rápido para desarrollo) o con **Development Build** (necesario para módulos nativos personalizados).

### ¿Cuándo usar Development Build?

Usa Development Build si:
- ✅ Necesitas módulos nativos que no soporta Expo Go
- ✅ Quieres usar plugins nativos personalizados
- ✅ Necesitas capacidades específicas de la plataforma
- ✅ Quieres un build más cercano a producción

**⚠️ Importante**: Siempre crear una Development Build si:
-  Actualiza o modifica las dependencias o librerias
-  Actualiza o modifica las variables de entorno (.env)
-  Actualiza o modifica Manifest de Expo (app.json | eas.json)

### Requisitos Previos

1. **Cuenta de Expo**:
```bash
npx expo login
```

2. **EAS CLI** (Expo Application Services):
```bash
npm install -g eas-cli
```

3. **Configurar proyecto EAS**:
```bash
eas build:configure
```

Esto creará el archivo `eas.json` con la configuración de builds. **Omitir si ya existe eas.json**

### Crear Development Build

#### Para Android

1. **Build APK para desarrollo**:
```bash
npx eas build --profile development --platform android
```

2. **Instalar en tu dispositivo**:
   - Una vez completado, recibirás un link de descarga
   - Descarga el APK en tu dispositivo Android
   - Instala el APK (habilita "Instalación de fuentes desconocidas")

#### Para iOS (requiere macOS)

1. **Build para simulador**:
```bash
npx eas build --profile development --platform ios --local
```

2. **Build para dispositivo físico**:
```bash
npx eas build --profile development --platform ios
```
   - Necesitarás una cuenta de Apple Developer
   - Registra tu dispositivo en la Apple Developer Console

3. **Instalar**:
   - Simulador: El build se instalará automáticamente
   - Dispositivo: Usa TestFlight o instalación ad-hoc

### Configuración de eas.json

Ejemplo de configuración para Development Builds:

```json
{
  "cli": {
    "version": ">= 5.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### Ventajas del Development Build

- ✅ **Módulos nativos personalizados**: Usa cualquier módulo nativo
- ✅ **Hot reload**: Actualización en tiempo real del código JS
- ✅ **Debugging mejorado**: Más cercano a la app de producción
- ✅ **Testing completo**: Prueba todas las funcionalidades nativas
- ✅ **Configuración nativa**: Personaliza AndroidManifest.xml, Info.plist, etc.

### Diferencias entre Expo Go y Development Build

| Característica | Expo Go | Development Build |
|----------------|---------|-------------------|
| **Instalación** | Descarga de tiendas | Build personalizado |
| **Módulos nativos** | Solo los incluidos | Cualquiera |
| **Tiempo de setup** | Instantáneo | ~15-20 min (primera vez) |
| **Actualización** | Automática | Manual |
| **Depuración** | Limitada | Completa |
| **Producción** | No | Similar |

### Comandos Útiles

```bash
# Ver builds anteriores
eas build:list

# Cancelar build en progreso
eas build:cancel

# Ver detalles de un build
eas build:view [BUILD_ID]

# Construir localmente (más rápido, requiere Android Studio/Xcode)
eas build --platform android --profile development --local

# Limpiar caché de EAS
eas build:configure --clear-cache
```

### Troubleshooting

#### Error: "Build failed"
```bash
# Ver logs completos
eas build:view [BUILD_ID]

# Limpiar caché y reintentar
npx expo prebuild --clean
eas build --platform android --profile development --clear-cache
```

#### Error: "Could not connect to development server"
- Asegúrate de que tu dispositivo y computadora estén en la misma red
- Verifica que el firewall no bloquee las conexiones
- Usa `npx expo start --dev-client --tunnel` para crear un túnel

#### Build muy lento
- Usa `--local` para construir en tu máquina
- Verifica que tengas Android Studio/Xcode configurado
- Considera usar caché de dependencias

### Recursos

- 📄 [Documentación oficial de EAS Build](https://docs.expo.dev/build/introduction/)
- 📄 [Development Builds](https://docs.expo.dev/development/introduction/)
- 📄 [Migrar de Expo Go a Development Build](https://docs.expo.dev/develop/development-builds/introduction/)

## 📦 Dependencias Principales

### Core
- **React** `19.1.0` - Framework principal
- **React Native** `0.81.4` - Framework móvil nativo
- **Expo** `~54.0.13` - Plataforma de desarrollo

### Navegación
- **@react-navigation/native** `^7.1.18` - Sistema de navegación
- **@react-navigation/native-stack** `^7.3.28` - Navegación tipo stack

### UI/UX
- **react-native-screens** `~4.16.0` - Optimización de pantallas
- **react-native-safe-area-context** `~5.6.0` - Manejo de áreas seguras
- **expo-status-bar** `~3.0.8` - Barra de estado

### Mapas y Ubicación
- **react-native-maps** `^1.26.18` - Mapas interactivos
- **expo-location** `^19.0.7` - Geolocalización

### Autenticación
- **@react-native-google-signin/google-signin** `^16.0.0` - Google Sign-In
- **expo-secure-store** `^15.0.7` - Almacenamiento seguro de tokens
- **jwt-decode** `^4.0.0` - Decodificación de JWT

### Notificaciones
- **expo-notifications** `~0.32.12` - Notificaciones push
- **expo-device** `~8.0.9` - Información del dispositivo

### Red y API
- **axios** `^1.12.2` - Cliente HTTP
- **expo-constants** `~18.0.10` - Constantes de configuración

### Web Support
- **react-dom** `19.1.0` - Soporte para web
- **react-native-web** `^0.21.0` - Componentes web

## 🗂️ Estructura del Proyecto

```
mobile/
├── .docs/                      # Documentación técnica
│   ├── AUTH_IMPLEMENTATION.md              # Sistema de autenticación
│   ├── ESTADO_CONEXION_BACKEND.md          # Estado de endpoints
│   ├── GUIA_PRUEBAS_CONEXION.md            # Guía de testing
│   └── ...
├── screens/                    # Pantallas de la aplicación
│   ├── WelcomeScreen.tsx                   # Pantalla de bienvenida
│   ├── SplashScreen.tsx                    # Splash con verificación de sesión
│   ├── LoginScreen.tsx                     # Inicio de sesión
│   ├── RegisterOptionsScreen.tsx           # Selección de tipo de registro
│   ├── BasicRegistrationScreen.tsx         # Registro básico (Paso 1)
│   ├── CompleteProfileScreen.tsx           # Completar perfil (Paso 2)
│   ├── BeneficiaryRegistrationScreen.tsx   # Registro de beneficiarios
│   ├── EstablishmentRegistrationScreen.tsx # Registro de establecimientos
│   ├── HomeScreen.tsx                      # Home (deprecated)
│   ├── BeneficiaryHomeScreen.tsx           # Home de beneficiarios
│   ├── EstablishmentListScreen.tsx         # Lista de establecimientos con mapa
│   ├── EditEstablishmentProfileScreen.tsx  # Editar perfil de establecimiento
│   ├── FoodRegistrationScreen.tsx          # Registro de alimentos
│   ├── FoodManagementScreen.tsx            # Gestión de alimentos
│   ├── FoodEditScreen.tsx                  # Edición de alimentos
│   └── NotificationSettingsScreen.tsx      # Configuración de notificaciones
├── components/                 # Componentes reutilizables
│   ├── Button.tsx                          # Botón con variantes
│   ├── Card.tsx                            # Contenedor con sombra
│   ├── Input.tsx                           # Campo de entrada
│   ├── FeedbackMessage.tsx                 # Mensajes de feedback
│   ├── GoogleSignInButton.tsx              # Botón de Google Sign-In
│   ├── AddressVerificationModal.tsx        # Modal de verificación de dirección
│   ├── ProfileModal.tsx                    # Modal de perfil de usuario
│   ├── index.ts                            # Exportaciones
│   └── README.md                           # Documentación
├── contexts/                   # Contextos de React
│   ├── AuthContext.tsx                     # Gestión de autenticación global
│   └── NotificationContext.tsx             # Gestión de notificaciones
├── hooks/                      # Custom hooks
│   ├── useRequestState.ts                  # Estados de requests HTTP
│   ├── useAuth.ts                          # Hook de autenticación
│   ├── useGoogleSignIn.ts                  # Hook de Google Sign-In
│   ├── useNotifications.ts                 # Hook de notificaciones
│   └── useAddressVerification.ts           # Hook de verificación de dirección
├── services/                   # Servicios de API
│   ├── api.ts                              # Cliente Axios con interceptores JWT
│   ├── authService.ts                      # Autenticación y registro
│   ├── profileService.ts                   # Gestión de perfiles
│   ├── beneficiaryService.ts               # API de beneficiarios
│   ├── establishmentService.ts             # API de establecimientos
│   ├── foodService.ts                      # API de alimentos
│   ├── locationService.ts                  # Geolocalización
│   ├── notificationService.ts              # Notificaciones push
│   └── addressVerificationService.ts       # Verificación de direcciones
├── styles/                     # Estilos globales y por pantalla
│   ├── global.tsx                          # Paleta de colores y estilos globales
│   ├── docs/                               # Documentación de estilos
│   │   ├── COLOR_PALETTE.md                # Paleta de colores
│   │   └── STYLE_MIGRATION_GUIDE.md        # Guía de migración
│   └── [Screen]Style.tsx                   # Estilos por pantalla
├── types/                      # Tipos TypeScript
│   ├── auth.types.ts                       # Tipos de autenticación
│   └── notification.types.ts               # Tipos de notificaciones
├── utils/                      # Utilidades
│   ├── establishmentTypeTranslations.ts    # Traducciones de tipos
│   └── networkDebug.ts                     # Debug de red
├── config/                     # Configuración
│   └── app.config.ts                       # Configuración de API
├── assets/                     # Recursos estáticos
│   ├── icon.png                            # Icono de la app
│   ├── splash-icon.png                     # Splash screen
│   └── adaptive-icon.png                   # Icono adaptativo Android
├── .env                        # Variables de entorno (NO en Git)
├── .env.example                # Ejemplo de variables de entorno
├── app.json                    # Configuración de Expo (NO en Git)
├── app.json.example            # Ejemplo de configuración
├── App.tsx                     # Componente principal
├── index.ts                    # Entry point
├── package.json                # Dependencias
├── tsconfig.json               # Configuración TypeScript
└── README.md                   # Este archivo
```

## 🎨 Sistema de Diseño

### Paleta de Colores "Clean Green"

La aplicación utiliza una paleta moderna tipo startup con enfoque ecológico:

- **Primary** (`#00BFA6`): Botones principales, acentos
- **Secondary** (`#009688`): Elementos destacados
- **Accent** (`#FF7043`): Alertas, botones secundarios
- **Background** (`#FAFAFA`): Fondo general
- **Surface** (`#FFFFFF`): Tarjetas y superficies

Ver documentación completa en [`styles/README.md`](./styles/README.md)

### Componentes Reutilizables

La app incluye componentes pre-construidos que usan los estilos globales:

```tsx
import { Button, Card, Input, FeedbackMessage } from './components';
import { useRequestState } from './hooks/useRequestState';

// Botón primario
<Button title="Enviar" onPress={handleSubmit} variant="primary" />

// Card con contenido
<Card>
  <Text>Contenido del card</Text>
</Card>

// Input con validación
<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  error={emailError}
  required
/>

// Mensajes de feedback (nuevo)
<FeedbackMessage
  type="success" // 'success' | 'error' | 'loading' | 'info'
  message="¡Operación exitosa!"
  visible={true}
/>

// Hook de gestión de estados (nuevo)
const requestState = useRequestState();
requestState.setLoading();
requestState.setSuccess();
requestState.setError('Mensaje de error');
```

Ver documentación de componentes en [`components/README.md`](./components/README.md)

## 📱 Pantallas y Flujos

### 🔐 Flujo de Autenticación

1. **WelcomeScreen**: Primera pantalla con opciones de login/registro
2. **SplashScreen**: Verificación automática de sesión al iniciar
3. **LoginScreen**: Login con email/usuario/documento + contraseña o Google
4. **RegisterOptionsScreen**: Selección entre beneficiario o establecimiento
5. **BasicRegistrationScreen**: Registro básico (Paso 1) - nombre, email, contraseña
6. **CompleteProfileScreen**: Completar perfil (Paso 2) - documento, teléfono, etc.

### 👥 Flujo de Beneficiario

1. **BeneficiaryHomeScreen**: Home con alimentos disponibles y mapa
2. **EstablishmentListScreen**: Lista de establecimientos con ubicación en mapa
3. **NotificationSettingsScreen**: Configuración de notificaciones push

### 🍽️ Flujo de Establecimiento

1. **BeneficiaryHomeScreen**: Home con gestión de alimentos (reutilizada)
2. **EditEstablishmentProfileScreen**: Editar perfil con verificación de dirección
3. **FoodRegistrationScreen**: Registrar nuevo alimento
4. **FoodManagementScreen**: Ver y gestionar alimentos propios
5. **FoodEditScreen**: Editar alimento existente
6. **NotificationSettingsScreen**: Configuración de notificaciones

### ✨ Características Principales

#### 🔐 Autenticación
- ✅ Login con email/usuario/documento
- ✅ Google Sign-In OAuth 2.0
- ✅ Registro en 2 pasos (básico → completar perfil)
- ✅ Persistencia de sesión con SecureStore
- ✅ Refresh automático de tokens JWT
- ✅ Verificación automática de sesión en splash

#### 📍 Geolocalización
- ✅ Verificación de direcciones con Google Maps API
- ✅ Obtención automática de ubicación GPS
- ✅ Visualización de establecimientos en mapa interactivo
- ✅ Cálculo de distancias

#### 🔔 Notificaciones
- ✅ Notificaciones push con Expo Notifications
- ✅ Permisos y registro de token
- ✅ Configuración de preferencias de notificaciones
- ✅ Manejo de notificaciones en foreground/background

#### 🎨 UI/UX
- ✅ Sistema de diseño consistente ("Clean Green")
- ✅ Componentes reutilizables (Button, Card, Input, etc.)
- ✅ Feedback visual (loading, success, error)
- ✅ Validaciones en tiempo real
- ✅ Modales para flujos complejos

#### Documentación Técnica:

- 📄 [Sistema de Autenticación](./.docs/AUTH_IMPLEMENTATION.md)
- 📄 [Estado de Conexión Backend](./.docs/ESTADO_CONEXION_BACKEND.md)
- 📄 [Guía de Pruebas](./.docs/GUIA_PRUEBAS_CONEXION.md)

## 🌐 Integración con Backend

### Configuración de API

La configuración se gestiona mediante variables de entorno (`.env`):

```bash
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_API_TIMEOUT=10000
```

El cliente HTTP (`services/api.ts`) incluye:

- ✅ **Interceptores JWT**: Agrega automáticamente Authorization header
- ✅ **Refresh automático**: Renueva tokens cuando expiran (401)
- ✅ **Reintentos**: Reintenta requests fallidas por expiración
- ✅ **Manejo de errores**: Mensajes específicos según código HTTP

### Endpoints Implementados

#### Autenticación (`authService.ts`)
- `POST /auth/login` - Inicio de sesión
- `POST /auth/register` - Registro de usuarios
- `POST /auth/refresh` - Renovar tokens
- `GET /auth/me` - Información del usuario actual

#### Perfiles (`profileService.ts`)
- `GET /profile` - Obtener perfil del usuario
- `PATCH /profile` - Actualizar perfil
- `POST /profile/complete` - Completar perfil (paso 2)

#### Establecimientos (`establishmentService.ts`)
- `POST /establishments` - Crear establecimiento
- `GET /establishments` - Listar establecimientos
- `GET /establishments/:id` - Obtener establecimiento
- `PATCH /establishments/:id` - Actualizar establecimiento
- `GET /establishments/city/:cityId` - Por ciudad
- `GET /establishments/department/:deptId` - Por departamento

#### Alimentos (`foodService.ts`)
- `POST /foods` - Crear alimento
- `GET /foods` - Listar alimentos
- `GET /foods/:id` - Obtener alimento
- `PATCH /foods/:id` - Actualizar alimento
- `DELETE /foods/:id` - Eliminar alimento
- `GET /foods/establishment/:id` - Por establecimiento

#### Ubicación (`locationService.ts`)
- `POST /locations/verify-address` - Verificar dirección

#### Notificaciones (`notificationService.ts`)
- `POST /notifications/register-token` - Registrar token push
- `PATCH /notifications/preferences` - Actualizar preferencias

## 🎯 Contextos y Hooks Personalizados

### Contextos de React

#### `AuthContext`
Gestión global de autenticación con persistencia:

```typescript
import { useAuth } from './hooks/useAuth';

const MyComponent = () => {
  const { user, isAuthenticated, login, logout, register } = useAuth();

  const handleLogin = async () => {
    await login({ email, password });
  };

  return <Text>{user?.name}</Text>;
};
```

**Funcionalidades:**
- ✅ Persistencia de sesión con SecureStore
- ✅ Refresh automático de tokens
- ✅ Estado global de usuario
- ✅ Métodos: `login()`, `register()`, `logout()`, `refreshToken()`

#### `NotificationContext`
Gestión de notificaciones push:

```typescript
import { useNotifications } from './hooks/useNotifications';

const MyComponent = () => {
  const { registerForPushNotifications, notification } = useNotifications();

  useEffect(() => {
    registerForPushNotifications();
  }, []);
};
```

### Hooks Personalizados

#### `useRequestState`
Gestión de estados de peticiones HTTP:

```typescript
const requestState = useRequestState();

const handleSubmit = async () => {
  requestState.setLoading();
  try {
    await api.post('/endpoint', data);
    requestState.setSuccess();
  } catch (error) {
    requestState.setError(error.message);
  }
};
```

#### `useAuth`
Wrapper del AuthContext con funcionalidades adicionales:

```typescript
const { user, isAuthenticated, login, logout } = useAuth();
```

#### `useGoogleSignIn`
Autenticación con Google OAuth:

```typescript
const { signIn, loading, error } = useGoogleSignIn();

const handleGoogleSignIn = async () => {
  const result = await signIn();
  if (result.success) {
    navigation.navigate('Home');
  }
};
```

#### `useNotifications`
Gestión de notificaciones push:

```typescript
const { registerForPushNotifications, notification } = useNotifications();
```

#### `useAddressVerification`
Verificación de direcciones con ubicación GPS:

```typescript
const { verifyAddress, loading, error } = useAddressVerification();

const handleVerify = async () => {
  const result = await verifyAddress(address);
  if (result.valid) {
    // Dirección verificada
  }
};
```

## 🎨 Sistema de Diseño "Clean Green"

### Paleta de Colores

```typescript
// Colores principales
primary: '#00BFA6'      // Verde agua - Botones principales
secondary: '#009688'    // Verde azulado - Elementos destacados
accent: '#FF7043'       // Naranja coral - Alertas, CTA secundarios

// Colores de fondo
background: '#FAFAFA'   // Gris muy claro - Fondo general
surface: '#FFFFFF'      // Blanco - Cards, modales

// Colores de texto
textPrimary: '#212121'  // Negro - Texto principal
textSecondary: '#757575' // Gris - Texto secundario
textDisabled: '#BDBDBD' // Gris claro - Texto deshabilitado

// Estados
success: '#4CAF50'      // Verde - Éxito
error: '#F44336'        // Rojo - Error
warning: '#FFC107'      // Amarillo - Advertencia
info: '#2196F3'         // Azul - Información
```

### Componentes Reutilizables

#### Button
```typescript
<Button 
  title="Guardar"
  onPress={handlePress}
  variant="primary" // 'primary' | 'secondary' | 'outline' | 'text'
  disabled={loading}
  loading={loading}
/>
```

#### Input
```typescript
<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  error={emailError}
  required
  keyboardType="email-address"
/>
```

#### Card
```typescript
<Card>
  <Text>Contenido del card</Text>
</Card>
```

#### FeedbackMessage
```typescript
<FeedbackMessage
  type="success" // 'success' | 'error' | 'loading' | 'info'
  message="Operación exitosa"
  visible={true}
/>
```

Ver documentación completa en:
- 📄 [Paleta de Colores](./styles/docs/COLOR_PALETTE.md)
- 📄 [Guía de Estilos](./styles/docs/README.md)
- 📄 [Componentes](./components/README.md)

## 🔧 Comandos y Scripts

### Desarrollo
```bash
npm start              # Iniciar servidor de desarrollo
npm run android        # Ejecutar en Android
npm run ios            # Ejecutar en iOS (solo macOS)
npm run web            # Ejecutar en navegador web
```

### Utilidades
```bash
npx expo start --clear # Limpiar caché y iniciar
npx expo start -c      # Alias de --clear
npx expo-doctor        # Verificar compatibilidad de dependencias
npx expo install       # Instalar dependencias compatibles
```

### Gestión de Caché
```bash
# Limpiar caché de Metro
npx expo start -c

# Limpiar node_modules y reinstalar
rm -rf node_modules
npm install
```

## 🧪 Testing y Debug

### Probar Autenticación
1. Iniciar backend en `http://localhost:3000`
2. Verificar que `.env` tenga la URL correcta
3. Probar login/registro en la app
4. Verificar tokens en SecureStore (usar Expo Dev Tools)

### Probar Notificaciones
1. Usar dispositivo físico (no funciona en emulador iOS)
2. Aceptar permisos de notificaciones
3. Verificar token en backend
4. Enviar notificación de prueba desde backend

### Debug de Red
```typescript
import { networkDebug } from './utils/networkDebug';

// Ver requests/responses en consola
networkDebug.enable();
```

### Ver Logs
- **Expo Go**: Aparecen en la terminal donde ejecutaste `npm start`
- **Desarrollo**: Usa `console.log()` y `console.error()`
- **Production**: Implementar servicio de logging (Sentry, etc.)

## 📚 Documentación Técnica

### Arquitectura
- [Sistema de Autenticación](./.docs/AUTH_IMPLEMENTATION.md)
- [Estado de Conexión Backend](./.docs/ESTADO_CONEXION_BACKEND.md)
- [Guía de Pruebas](./.docs/GUIA_PRUEBAS_CONEXION.md)

### Diseño
- [Paleta de Colores](./styles/docs/COLOR_PALETTE.md)
- [Guía de Estilos](./styles/docs/README.md)
- [Guía de Migración de Estilos](./styles/docs/STYLE_MIGRATION_GUIDE.md)

### Componentes
- [Documentación de Componentes](./components/README.md)

## 🚀 Despliegue

### Build para Android
```bash
# Crear APK
npx eas build --platform android --profile preview

# Crear AAB para Google Play
npx eas build --platform android --profile production
```

### Build para iOS
```bash
# Crear IPA para TestFlight
npx eas build --platform ios --profile production
```

### Configuración EAS
Asegúrate de tener configurado `eas.json` con tus perfiles de build.

## 🤝 Contribución

### Flujo de Trabajo
1. Crear branch desde `develop`
2. Implementar feature
3. Probar localmente
4. Crear Pull Request a `develop`
5. Code review
6. Merge

### Convenciones
- **Commits**: Conventional Commits (`feat:`, `fix:`, `docs:`, etc.)
- **Branches**: `feature/nombre`, `fix/nombre`, `refactor/nombre`
- **TypeScript**: Tipado fuerte en todos los archivos
- **Estilos**: Usar sistema de diseño global

## 📄 Licencia

[Definir licencia del proyecto]

## 👥 Equipo

[Información del equipo de desarrollo]

## 📞 Soporte

Para reportar bugs o solicitar features, crear un issue en GitHub.
