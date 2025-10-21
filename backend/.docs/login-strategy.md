# 🔐 Autenticación - Backend

Este documento describe la implementación del sistema de autenticación usando **Passport.js** en NestJS.

## 📋 Características

✅ **Autenticación Local**: Login con username/email/documentNumber + password  
✅ **Autenticación JWT**: Token-based authentication  
✅ **OAuth 2.0 Google**: Login con Google  
✅ **Refresh Tokens**: Renovación de access tokens  
✅ **Password Hashing**: Bcrypt para seguridad  
✅ **Guards**: Protección de rutas con JWT

## 🗂️ Estructura de Carpetas

```
src/auth/
├── auth.module.ts          # Módulo de autenticación
├── auth.service.ts         # Lógica de autenticación
├── auth.controller.ts      # Endpoints de autenticación
├── strategies/
│   ├── local.strategy.ts    # Estrategia local (username/email/documentNumber)
│   ├── jwt.strategy.ts      # Estrategia JWT
│   └── google.strategy.ts   # Estrategia Google OAuth
├── guards/
│   ├── jwt-auth.guard.ts    # Guard para JWT
│   ├── local-auth.guard.ts  # Guard para estrategia local
│   └── google-auth.guard.ts # Guard para Google OAuth
└── index.ts                 # Exportaciones

src/dtos/Auth/
├── login.dto.ts             # DTO para login local
├── register.dto.ts          # DTO para registro
├── google-auth.dto.ts       # DTO para Google
└── auth-response.dto.ts     # DTO de respuesta
```

## 🚀 Endpoints API

### 1. **Registro de Usuario**

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "john_doe",
  "documentNumber": "1234567890",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}
```

**Respuesta (201):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com"
}
```

---

### 2. **Login Local (Username/Email/DocumentNumber + Password)**

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "identifier": "john_doe",  // o "user@example.com" o "1234567890"
  "password": "SecurePass123!"
}
```

**Respuesta (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com"
}
```

---

### 3. **Login con Google**

```http
POST /api/v1/auth/google
Content-Type: application/json

{
  "token": "ya29.a0AfH6SMBx...",  // Google access token del frontend
  "email": "user@gmail.com",
  "name": "John Doe"
}
```

**Respuesta (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@gmail.com"
}
```

---

### 4. **Refrescar Access Token**

```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Respuesta (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com"
}
```

---

### 5. **Obtener Perfil del Usuario**

```http
GET /api/v1/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuesta (200):**
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "username": "john_doe",
  "email": "user@example.com",
  "documentNumber": "1234567890",
  "role": "BENEFICIARY",
  "picture": null,
  "createdAt": "2024-01-15T10:30:00Z",
  "isActive": true
}
```

---

### 6. **Logout**

```http
POST /api/v1/auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuesta (200):**
```json
{
  "message": "Successfully logged out. Please discard the token client-side."
}
```

---

## 🔧 Configuración de Variables de Entorno

Copia el archivo `.env.example` a `.env` y actualiza los valores:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/database"

# JWT Secret Keys
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRATION=3600  # 1 hora en segundos
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production"
JWT_REFRESH_EXPIRATION=604800  # 7 días en segundos

# Google OAuth (obtén estos valores de Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3001/api/v1/auth/google/callback"

# Application
PORT=3001
API_VERSION=v1
NODE_ENV=development
```

## 🔐 Configurar Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un nuevo proyecto
3. Habilita la API "Google+ API"
4. Ve a "Credenciales" → "Crear credenciales" → "ID de cliente de OAuth"
5. Selecciona "Aplicación web"
6. Añade URIs autorizados:
   - `http://localhost:3001/api/v1/auth/google/callback` (desarrollo)
   - Tu URL de producción
7. Copia el Client ID y Client Secret a tu `.env`

## 💻 Uso en Controladores

### Proteger una ruta con JWT

```typescript
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards';

@Controller('protected')
export class ProtectedController {
  @Get('data')
  @UseGuards(JwtAuthGuard)
  getData(@Request() req: any) {
    // req.user contiene: { userId, email, username }
    return { message: `Hello ${req.user.email}` };
  }
}
```

### Obtener datos del usuario autenticado

```typescript
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards';

@Controller('users')
export class UsersController {
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Request() req: any) {
    const userId = req.user.userId;
    const email = req.user.email;
    // Usar userId y email según necesites
    return { userId, email };
  }
}
```

## 🔄 Flujo de Autenticación

### Login Local
```
Usuario envía credenciales → Validación → Hash comparado → JWT generado → Token retornado
```

### Google OAuth
```
Usuario usa Google → Credenciales enviadas → Usuario encontrado o creado → JWT generado → Token retornado
```

### Refresh Token
```
Cliente envía refresh token → Token validado → Nuevo access token generado → Token retornado
```

## 🛡️ Seguridad

✅ **Contraseñas hasheadas** con bcrypt (salt rounds: 10)  
✅ **JWT firmados** con secreto seguro  
✅ **Refresh tokens** separados con expiración más larga  
✅ **CORS configurado** en producción  
✅ **HTTPS recomendado** en producción  
✅ **Validación de entrada** con class-validator  

## 📝 Notas Importantes

- **Los tokens no se almacenan en la BD**: Son JWT auto-contenidos
- **Logout**: Se maneja del lado del cliente (descartar el token)
- **Expiración**: Configure tiempos según su política de seguridad
- **Cambio de secretos**: Si cambias los secretos JWT, todos los tokens se invalidarán
- **Google OAuth**: Requiere configuración en Google Cloud Console

## 🧪 Testing

```bash
# Ejecutar tests
npm run test

# Con coverage
npm run test:cov
```

## 📚 Referencias

- [Passport.js Documentation](http://www.passportjs.org/)
- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
