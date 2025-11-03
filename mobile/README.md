# ComiYa - Aplicación Móvil

Aplicación móvil de **ComiYa** desarrollada con React Native y Expo. Esta app permite a los restaurantes registrar alimentos que están por vencer o desperdiciar, y a los beneficiarios acceder a estos alimentos disponibles.

## 📋 Requisitos Previos

- **Node.js** (v16 o superior)
- **npm** o **yarn**
- **Expo Go** (app móvil para pruebas)
- **Google Maps API Key** (para funcionalidad de mapas)

## ⚙️ Configuración Inicial

### 1. Configurar app.json

El archivo `app.json` contiene la configuración de Expo y las API keys necesarias. Por seguridad, este archivo **no se sube a GitHub**.

1. Copia el archivo de ejemplo:
```bash
cp app.json.example app.json
```

2. Edita `app.json` y reemplaza los valores de ejemplo:
   - `android.config.googleMaps.apiKey`: Tu Google Maps API Key
   - `plugins[1][1].androidGoogleMapsApiKey`: La misma Google Maps API Key
   - `extra.eas.projectId`: Tu Expo EAS Project ID (si usas EAS)

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
    ]
  }
}
```

> **⚠️ Importante**: Nunca compartas tu `app.json` con API keys reales. El archivo está en `.gitignore` para evitar que se suba accidentalmente a GitHub.

### 2. Instalar dependencias

```bash
npm install
```

### 3. Instalar dependencias adicionales de Expo

```bash
npx expo install react-native-screens react-native-safe-area-context
```

```bash
npm install axios
```

```bash
npm install @react-navigation/native @react-navigation/native-stack
```

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

- **🖥️ Emulador Android**:

## 📦 Dependencias Principales

```json
{
	"@react-navigation/native": "^7.1.18",
	"@react-navigation/native-stack": "^7.3.28",
	"expo": "~54.0.12",
	"expo-status-bar": "~3.0.8",
	"react": "19.1.0",
	"react-native": "0.81.4",
	"react-native-safe-area-context": "~5.6.0",
	"react-native-screens": "~4.16.0"
}
```

## 🗂️ Estructura del Proyecto

```
mobile/
├── screens/               # Pantallas de la aplicación
│   ├── HomeScreen.tsx                          # Pantalla principal
│   ├── EstablishmentRegistrationScreen.tsx     # Registro de establecimientos (con feedback)
│   └── BeneficiaryRegistrationScreen.tsx       # Registro de beneficiarios (con feedback)
├── components/           # Componentes reutilizables
│   ├── Button.tsx                              # Botón con variantes
│   ├── Card.tsx                                # Contenedor con sombra
│   ├── Input.tsx                               # Campo de entrada
│   ├── FeedbackMessage.tsx                     # Componente de mensajes (success/error/loading)
│   ├── index.ts                                # Exportaciones
│   └── README.md                               # Documentación de componentes
├── hooks/                # Custom hooks
│   └── useRequestState.ts                      # Hook para gestión de estados (loading/success/error)
├── styles/               # Estilos globales y por pantalla
│   ├── global.tsx                              # Paleta de colores, estilos globales
│   ├── HomeScreenStyle.tsx                     # Estilos de Home
│   ├── BeneficiaryRegistrationScreenStyle.tsx  # Estilos de Beneficiarios
│   ├── EstablishmentRegistrationScreenStyle.tsx # Estilos de Establecimientos
│   ├── FoodRegistrationScreenStyle.tsx         # Estilos de Alimentos
│   └── README.md                               # Guía de estilos
├── services/             # Servicios de API
│   ├── api.ts                                  # Configuración de Axios
│   ├── beneficiaryService.ts                   # Servicio de beneficiarios (con manejo de errores)
│   ├── establishmentService.ts                 # Servicio de establecimientos (con manejo de errores)
│   ├── foodService.ts                          # Servicio de alimentos (con manejo de errores)
│   └── locationService.ts                      # Servicio de ubicaciones
├── config/               # Configuración de la app
│   └── app.config.ts                           # Configuración de API
├── assets/               # Recursos (imágenes, iconos, etc.)
├── App.tsx              # Componente principal y navegación
├── app.json             # Configuración de Expo
├── package.json         # Dependencias del proyecto
├── tsconfig.json        # Configuración de TypeScript
└── RESUMEN_CONSOLIDADO.md  # Documentación de implementación de estados
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

## 📱 Pantallas Disponibles

1. **Home Screen**: Pantalla principal con opciones de registro
2. **Registro de Establecimiento**: Formulario para restaurantes con gestión de estados y feedback
3. **Registro de Beneficiario**: Formulario para usuarios con gestión de estados y feedback
4. **Registro de Alimentos**: Formulario para registrar alimentos disponibles con gestión de estados y feedback

### ✨ Características de las Pantallas de Registro

Todas las pantallas de registro incluyen:

- ✅ **Gestión de estados**: Loading, éxito y error
- ✅ **Feedback visual**: Mensajes claros con colores distintivos
- ✅ **Validaciones**: Campos obligatorios y formatos específicos
- ✅ **Manejo de errores**: Mensajes específicos según el tipo de error
- ✅ **Auto-redirección**: Navegación automática tras registro exitoso
- ✅ **Auto-reset**: Mensajes se limpian al editar campos

#### Documentación Específica:

- 📄 [Establecimientos y Beneficiarios - Resumen Consolidado](./RESUMEN_CONSOLIDADO.md)
- 📄 [Registro de Alimentos - Implementación](./FOOD_REGISTRATION_IMPLEMENTACION.md)

## 🌐 Conectar con el Backend

### Configurar la URL del Backend

Edita el archivo `config/app.config.ts` y cambia la `BASE_URL` según tu entorno:

**Para emulador Android:**

```typescript
BASE_URL: 'http://10.0.2.2:3000';
```

**Para emulador iOS o navegador web:** 3. **Registro de Alimentos**: Formulario para donación de alimentos con gestión de estados y feedback 4. **Registro de Beneficiario**: Formulario para usuarios con gestión de estados y feedback

```typescript
BASE_URL: 'http://localhost:3000';
```

Todas las pantallas de registro incluyen:
**Para dispositivo físico:**

```typescript
BASE_URL: 'http://192.168.1.X:3000'; // Reemplaza X con la IP de tu computadora
```

### Cómo encontrar la IP de tu computadora

**Windows:**

```bash
ipconfig
# Busca "Dirección IPv4" en la conexión WiFi/Ethernet
```

**macOS/Linux:**

```bash
ifconfig
# Busca "inet" en la conexión activa
```

### Verificar que el backend está corriendo

Antes de probar la app, asegúrate de que el backend esté corriendo en `http://localhost:3000` (o la URL configurada).

## 🎯 Gestión de Estados y Feedback

La aplicación incluye un sistema robusto de gestión de estados y feedback visual para mejorar la experiencia del usuario.

### Hook `useRequestState`

Hook personalizado para gestionar el ciclo de vida de peticiones HTTP:

```typescript
import { useRequestState } from './hooks/useRequestState';

const MyComponent = () => {
	const requestState = useRequestState();

	const handleSubmit = async () => {
		// Iniciar carga
		requestState.setLoading();

		try {
			await api.post('/endpoint', data);
			// Marcar como exitoso
			requestState.setSuccess();
			// Redireccionar después de 2 segundos
			setTimeout(() => navigation.navigate('Home'), 2000);
		} catch (error) {
			// Mostrar error
			requestState.setError(error.message);
		}
		### 📡 Estado de Conexión con Backend

		| Pantalla | Estado | Notas |
		|----------|--------|-------|
		| Establecimientos | ✅ Funcional | Solo guarda: address, type, location, user_id |
		| Alimentos | ✅ Funcional | Todos los campos se guardan correctamente |
		| Beneficiarios | ⚠️ No disponible | Endpoint `/users` no existe en backend |

		Ver documentación completa:
		- **Implementación de estados**: [`RESUMEN_CONSOLIDADO.md`](./RESUMEN_CONSOLIDADO.md)
		- **Alimentos**: [`FOOD_REGISTRATION_IMPLEMENTACION.md`](./FOOD_REGISTRATION_IMPLEMENTACION.md)
		- **Estado de conexión**: [`ESTADO_CONEXION_BACKEND.md`](./ESTADO_CONEXION_BACKEND.md)
		- **Guía de pruebas**: [`GUIA_PRUEBAS_CONEXION.md`](./GUIA_PRUEBAS_CONEXION.md)

	return (
		<View>
			{requestState.loading && <FeedbackMessage type="loading" message="Procesando..." />}
			{requestState.success && <FeedbackMessage type="success" message="¡Éxito!" />}
			{requestState.error && (
				<FeedbackMessage type="error" message={requestState.error} />
			)}

			<Button onPress={handleSubmit} disabled={requestState.loading} />
		</View>
	);
};
```

### Componente `FeedbackMessage`

Muestra mensajes visuales al usuario con colores distintivos:

```typescript
import { FeedbackMessage } from './components';

<FeedbackMessage
	type="success" // 'success' | 'error' | 'loading' | 'info'
	message="¡Registro exitoso!"
	visible={true}
/>;
```

**Tipos de mensaje:**

- 🟢 **success**: Operaciones exitosas (verde #3CA55C)
- 🔴 **error**: Errores y validaciones (rojo #F44336)
- 🔵 **loading**: Operaciones en proceso (azul #2196F3)
- 🔵 **info**: Información general (azul #2196F3)

### Manejo de Errores HTTP

Los servicios incluyen manejo automático de errores con mensajes específicos:

| Código HTTP | Mensaje                                                                 |
| ----------- | ----------------------------------------------------------------------- |
| 400         | "Datos inválidos. Por favor verifica la información ingresada."         |
| 401         | "No autorizado. Por favor inicia sesión nuevamente."                    |
| 403         | "No tienes permisos para realizar esta acción."                         |
| 404         | "Recurso no encontrado."                                                |
| 409         | "Ya existe un registro con estos datos."                                |
| 500         | "Error del servidor. Por favor intenta nuevamente más tarde."           |
| Red         | "No se pudo conectar con el servidor. Verifica tu conexión a internet." |

## 🔧 Comandos Útiles

### Ver logs en tiempo real

```bash
npx expo start --clear
```

### Limpiar caché

```bash
npx expo start -c
```

### Instalar nueva dependencia

```bash
npx expo install nombre-del-paquete
```

### Verificar compatibilidad de dependencias

```bash
npx expo-doctor
```

### ✨ Gestión de Estados

- Sistema robusto de manejo de estados (loading, success, error)
- Componente reutilizable de feedback visual
- Hook personalizado `useRequestState` para cualquier pantalla
- Auto-redirección tras operaciones exitosas
- Auto-reset de mensajes al editar formularios

### 🛡️ Validaciones

- Validación de campos obligatorios
- Validación de formato de email con regex
- Mensajes de error específicos y claros
- Prevención de envíos duplicados

### 🎨 Diseño

- Paleta de colores "ComiYa" (verde ecológico)
- Sistema de componentes reutilizables
- Estilos consistentes en toda la app
- Feedback visual con colores distintivos

### 🌐 Conectividad

- Manejo robusto de errores HTTP
- Detección de errores de red
- Mensajes contextualizados según el error
- Reintentos automáticos (próximamente)

## 🔧 Desarrollo

### Agregar Nueva Pantalla con Gestión de Estados

1. **Crear el screen** en `screens/MiNuevaPantalla.tsx`
2. **Importar los hooks y componentes:**

```typescript
import { FeedbackMessage } from '../components';
import { useRequestState } from '../hooks/useRequestState';
```

3. **Inicializar el hook:**

```typescript
const requestState = useRequestState();
```

4. **Implementar la lógica:**

```typescript
const handleSubmit = async () => {
	// Validar
	if (!datos) {
		requestState.setError('Mensaje de validación');
		return;
	}

	// Cargar
	requestState.setLoading();

	try {
		await miServicio.crear(datos);
		requestState.setSuccess();
		setTimeout(() => navigation.navigate('Home'), 2000);
	} catch (error) {
		requestState.setError(error.message);
	}
};
```

5. **Renderizar el feedback:**

```tsx
{
	requestState.loading && <FeedbackMessage type="loading" message="..." />;
}
{
	requestState.success && <FeedbackMessage type="success" message="..." />;
}
{
	requestState.error && <FeedbackMessage type="error" message={requestState.error} />;
}
```
