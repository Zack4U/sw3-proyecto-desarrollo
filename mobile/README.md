# ComeYa - Aplicación Móvil

Aplicación móvil de **ComeYa** desarrollada con React Native y Expo. Esta app permite a los restaurantes registrar alimentos que están por vencer o desperdiciar, y a los beneficiarios acceder a estos alimentos disponibles.

## 📋 Requisitos Previos

- **Node.js** (v16 o superior)
- **npm** o **yarn**
- **Expo Go** (app móvil para pruebas)

### 1. Instalar dependencias

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
│   ├── EstablishmentRegistrationScreen.tsx     # Registro de establecimientos
│   └── BeneficiaryRegistrationScreen.tsx       # Registro de beneficiarios
├── assets/               # Recursos (imágenes, iconos, etc.)
├── App.tsx              # Componente principal y navegación
├── app.json             # Configuración de Expo
├── package.json         # Dependencias del proyecto
└── tsconfig.json        # Configuración de TypeScript
```

## 🎨 Pantallas Disponibles

1. **Home Screen**: Pantalla principal con opciones de registro
2. **Registro de Establecimiento**: Formulario para restaurantes
3. **Registro de Beneficiario**: Formulario para usuarios

## 🌐 Conectar con el Backend

### Configurar la URL del Backend

Edita el archivo `config/app.config.ts` y cambia la `BASE_URL` según tu entorno:

**Para emulador Android:**

```typescript
BASE_URL: 'http://10.0.2.2:3000';
```

**Para emulador iOS o navegador web:**

```typescript
BASE_URL: 'http://localhost:3000';
```

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

## 📄 Licencia

Este proyecto es parte del desarrollo de software 3

---

**ComeYa** - Reduce el desperdicio de alimentos 🌱
