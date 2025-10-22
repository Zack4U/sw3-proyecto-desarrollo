# Guía de Debugging para Error 500 en Registro

## Problema

Error 500 al intentar registrar usuario desde la app móvil.

## Cambios Realizados

### 1. Backend (`backend/src/main.ts`)

✅ Agregado `ValidationPipe` global para validar DTOs
✅ Habilitado CORS
✅ Configuración de transformación automática

### 2. Backend (`backend/src/dtos/Auth/register-basic.dto.ts`)

✅ Corregida validación problemática con `ValidateIf`
✅ Agregado `@MinLength(8)` a `confirmPassword`

### 3. Backend (`backend/src/auth/auth.controller.ts`)

✅ Agregado logging detallado en el controlador

### 4. Mobile (`mobile/services/authService.ts`)

✅ Mejorado manejo de errores con mensajes específicos

### 5. Mobile (`mobile/services/api.ts`)

✅ Agregado logging detallado en interceptores de request y response

### 6. Mobile (`mobile/screens/BasicRegistrationScreen.tsx`)

✅ Agregado test de conexión antes del registro

### 7. Mobile (`mobile/utils/networkDebug.ts`)

✅ Creada utilidad para debuggear conexión con backend

## Pasos para Resolver

### Paso 1: Verificar que el Backend Está Corriendo

```bash
# En la terminal del backend (C:/Users/leon5/Downloads/OurFood/sw3-proyecto-desarrollo/backend)
# Si el backend está corriendo en el puerto 3001, primero deténlo:
# Presiona Ctrl+C en la terminal donde está corriendo

# Luego reinicia el backend:
npm run start:dev

# Deberías ver:
# =================================================================
# 🏔️  Environment: development
# 🌐 Application is running on: http://localhost:3001
# ⭐ API is running on: http://localhost:3001/api/v1
# 📄 Documentation available at: http://localhost:3001/api/v1/docs
# =================================================================
```

### Paso 2: Verificar la Conexión desde el Navegador

Abre tu navegador y ve a:

```
http://localhost:3001/api/v1/health
```

Deberías ver una respuesta JSON similar a:

```json
{
	"status": "ok",
	"timestamp": "..."
}
```

### Paso 3: Probar el Endpoint de Registro con curl

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123","confirmPassword":"Password123"}'
```

Si esto funciona, el problema está en la conexión móvil → backend.

### Paso 4: Verificar la Configuración de la App Móvil

Revisa `mobile/config/app.config.ts`:

**Para Emulador Android:**

```typescript
BASE_URL: 'http://10.0.2.2:3001/api/v1';
```

**Para Emulador iOS:**

```typescript
BASE_URL: 'http://localhost:3001/api/v1';
```

**Para Dispositivo Físico:**

```typescript
BASE_URL: 'http://[TU_IP_LOCAL]:3001/api/v1';
```

Para obtener tu IP local:

- Windows: `ipconfig` (busca "IPv4 Address")
- Mac/Linux: `ifconfig` o `ip addr`

### Paso 5: Reiniciar la App Móvil

```bash
# En la terminal del móvil (C:/Users/leon5/Downloads/OurFood/sw3-proyecto-desarrollo/mobile)
# Presiona Ctrl+C para detener Expo
# Luego reinicia:
npx expo start --clear
```

### Paso 6: Limpiar Caché si es Necesario

```bash
# En mobile/
rm -rf node_modules
npm install
npx expo start --clear
```

## Logs a Revisar

### En el Backend (Terminal)

Cuando intentes registrar, deberías ver:

```
[Nest] 9916  - 21/10/2025, 7:27:11 p. m.     LOG [AuthController] 📝 Register basic attempt: tu@email.com
```

Si ves errores aquí, el problema está en el backend.

### En la App Móvil (Terminal de Expo)

Cuando intentes registrar, deberías ver:

```
📤 Request: POST /auth/register
📤 Base URL: http://10.0.2.2:3001/api/v1
📤 Data: { email: '...', password: '...', confirmPassword: '...' }
🔍 Probando conexión con backend...
✅ Backend is reachable: 200
📝 Intentando registrar usuario...
```

Si no ves el "Backend is reachable", el problema es de conectividad.

## Problemas Comunes

### Error: "No se pudo conectar con el servidor"

- ✅ Verifica que el backend esté corriendo
- ✅ Verifica la URL en `app.config.ts`
- ✅ Si usas dispositivo físico, asegúrate de estar en la misma red WiFi

### Error: "Internal server error" con código 500

- ✅ Revisa los logs del backend para ver el error exacto
- ✅ Verifica que la base de datos esté corriendo
- ✅ Verifica la conexión a la base de datos en `backend/.env`

### Error: "User with this email already exists"

- ✅ Usa otro email para probar
- ✅ O elimina el usuario de la base de datos

### El registro funciona pero no navega a la siguiente pantalla

- ✅ Verifica que `isActive` del usuario se esté estableciendo correctamente
- ✅ Revisa la lógica de navegación en `App.tsx`

## Testing Manual Rápido

1. **Backend funcionando?** → http://localhost:3001/api/v1/health
2. **Endpoint de registro funciona?** → curl al endpoint (ver Paso 3)
3. **App puede conectar?** → Revisar logs cuando registres
4. **Base de datos funciona?** → Verificar DATABASE_URL en backend/.env

## Contacto

Si el problema persiste después de estos pasos, captura:

1. Los logs completos del backend
2. Los logs completos de la app móvil (consola de Expo)
3. La configuración de `mobile/config/app.config.ts`
4. El contenido de `backend/.env` (sin las credenciales sensibles)
