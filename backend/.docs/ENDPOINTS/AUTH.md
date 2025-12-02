# 🔐 Authentication Endpoints

Base URL: `/auth`

Documentación completa de todos los endpoints de autenticación del sistema ComiYa.

---

## 📋 Tabla de Contenidos

- [🔐 Authentication Endpoints](#-authentication-endpoints)
  - [📋 Tabla de Contenidos](#-tabla-de-contenidos)
  - [🆕 Registro](#-registro)
    - [1. Registro Básico](#1-registro-básico)
    - [2. Registro de Beneficiario (Legacy)](#2-registro-de-beneficiario-legacy)
    - [3. Registro de Establecimiento (Legacy)](#3-registro-de-establecimiento-legacy)
    - [4. Completar Perfil](#4-completar-perfil)
  - [🔑 Login](#-login)
    - [1. Login Local](#1-login-local)
  - [🔄 Google OAuth](#-google-oauth)
    - [1. Google Login (Común)](#1-google-login-común)
    - [2. Google Login Beneficiario (Legacy)](#2-google-login-beneficiario-legacy)
    - [3. Google Login Establecimiento (Legacy)](#3-google-login-establecimiento-legacy)
  - [🔄 Gestión de Sesión](#-gestión-de-sesión)
    - [1. Refresh Token](#1-refresh-token)
    - [2. Logout](#2-logout)
    - [3. Validar Token](#3-validar-token)
  - [👤 Perfil](#-perfil)
    - [1. Obtener Perfil](#1-obtener-perfil)
    - [2. Cambiar Contraseña](#2-cambiar-contraseña)
  - [🔐 Recuperación de Contraseña](#-recuperación-de-contraseña)
    - [1. Solicitar Reset de Contraseña](#1-solicitar-reset-de-contraseña)
    - [2. Validar Token de Reset](#2-validar-token-de-reset)
    - [3. Resetear Contraseña](#3-resetear-contraseña)
  - [🔒 Autenticación](#-autenticación)
  - [📝 Notas](#-notas)
  - [🐛 Códigos de Error Comunes](#-códigos-de-error-comunes)
  - [🔗 Ver También](#-ver-también)

---

## 🆕 Registro

### 1. Registro Básico

Registro inicial con email y contraseña. El usuario debe completar su perfil después.

**Endpoint:** `POST /auth/register`

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "Password123!",
  "confirmPassword": "Password123!"
}
```

**Response (201):**
```json
{
  "user": {
    "userId": "uuid",
    "email": "usuario@ejemplo.com",
    "role": "BENEFICIARY",
    "isVerified": false,
    "isActive": false
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900
}
```

**Errores:**
- `400` - Datos inválidos o contraseñas no coinciden
- `409` - Email ya registrado

---

### 2. Registro de Beneficiario (Legacy)

Registro completo de beneficiario en un solo paso.

**Endpoint:** `POST /auth/beneficiary/register`

**Body:**
```json
{
  "email": "beneficiario@ejemplo.com",
  "password": "Password123!",
  "confirmPassword": "Password123!",
  "name": "Juan",
  "lastName": "Pérez",
  "documentType": "CC",
  "documentNumber": "1234567890",
  "phone": "+57 300 1234567"
}
```

**Response (201):** Similar al registro básico
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyODljNzAtMjJjc-c2E1N-xxxxxxxxxxxxxx",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyODljNzAtMjJjYzhjY",
  "user": {
    "userId": "289c70-22cc-70-22cc-4510-939f-466c46770d82",
    "email": "test.recovery@example.com"
  }
}
```

---

### 3. Registro de Establecimiento (Legacy)

Registro completo de establecimiento en un solo paso.

**Endpoint:** `POST /auth/establishment/register`

**Body:**
```json
{
  "email": "restaurante@ejemplo.com",
  "password": "Password123!",
  "confirmPassword": "Password123!",
  "username": "restaurante_central",
  "documentType": "NIT",
  "documentNumber": "900123456",
  "phone": "+57 300 9876543",
  "name": "Restaurante Central",
  "description": "Restaurante de comida colombiana",
  "address": "Calle 123 #45-67",
  "neighborhood": "Centro",
  "cityId": "uuid-ciudad",
  "establishmentType": "RESTAURANT",
  "location": {
    "type": "Point",
    "coordinates": [-74.0721, 4.7110]
  }
}
```

**Response (201):** Similar al registro básico con información del establecimiento

---

### 4. Completar Perfil

Completar información después del registro básico.

**Endpoint:** `POST /auth/profile/complete`

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "role": "BENEFICIARY",
  "documentType": "CC",
  "documentNumber": "1234567890",
  "phone": "+57 300 1234567",
  "username": "juanperez",
  "name": "Juan",
  "lastName": "Pérez"
}
```

**Response (200):**
```json
{
  "user": {
    "userId": "uuid",
    "email": "usuario@ejemplo.com",
    "username": "juanperez",
    "role": "BENEFICIARY",
    "documentType": "CC",
    "documentNumber": "1234567890",
    "phone": "+57 300 1234567",
    "isActive": true,
    "isVerified": true
  },
  "accessToken": "new-token...",
  "refreshToken": "new-refresh-token...",
  "expiresIn": 900
}
```

---

## 🔑 Login

### 1. Login Local

Login con email/username/documento y contraseña.

**Endpoint:** `POST /auth/login`

**Body:**
```json
{
  "identifier": "usuario@ejemplo.com",
  "password": "Password123!"
}
```

El `identifier` puede ser:
- Email
- Username
- Número de documento

**Response (200):**
```json
{
  "user": {
    "userId": "uuid",
    "email": "usuario@ejemplo.com",
    "username": "juanperez",
    "role": "BENEFICIARY",
    "isActive": true,
    "isVerified": true
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900
}
```

**Errores:**
- `401` - Credenciales inválidas
- `404` - Usuario no encontrado

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": "289c70-22cc-8ca2-3156-4b70-c3dcb37-501e",
    "email": "test@example.com",
    "role": "BENEFICIARY"
  }
}
```

---

## 🔄 Google OAuth

### 1. Google Login (Común)

Login con Google OAuth 2.0.

**Endpoint:** `POST /auth/google/login`

**Body:**
```json
{
  "idToken": "google-id-token-from-frontend",
  "role": "BENEFICIARY"
}
```

**Response (200):**
```json
{
  "user": {
    "userId": "uuid",
    "email": "usuario@gmail.com",
    "googleId": "google-user-id",
    "role": "BENEFICIARY",
    "picture": "https://lh3.googleusercontent.com/...",
    "isVerified": true,
    "isActive": true
  },
  "accessToken": "token...",
  "refreshToken": "refresh-token...",
  "expiresIn": 900
}
```

**Errores:**
- `400` - Token de Google inválido
- `401` - No autorizado

---

### 2. Google Login Beneficiario (Legacy)

**Endpoint:** `POST /auth/beneficiary/google`

**Body:**
```json
{
  "idToken": "google-id-token",
  "name": "Juan",
  "lastName": "Pérez"
}
```

---

### 3. Google Login Establecimiento (Legacy)

**Endpoint:** `POST /auth/establishment/google`

**Body:**
```json
{
  "idToken": "google-id-token",
  "username": "restaurante_central",
  "name": "Restaurante Central",
  "description": "Descripción del establecimiento",
  "address": "Calle 123 #45-67",
  "neighborhood": "Centro",
  "cityId": "uuid-ciudad",
  "establishmentType": "RESTAURANT",
  "location": {
    "type": "Point",
    "coordinates": [-74.0721, 4.7110]
  }
}
```

---

## 🔄 Gestión de Sesión

### 1. Refresh Token

Renovar access token usando refresh token.

**Endpoint:** `POST /auth/refresh`

**Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "accessToken": "new-access-token...",
  "refreshToken": "new-refresh-token...",
  "expiresIn": 900
}
```

**Errores:**
- `401` - Refresh token inválido o expirado

---

### 2. Logout

Cerrar sesión (invalida refresh token).

**Endpoint:** `POST /auth/logout`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

### 3. Validar Token

Verificar si un token es válido.

**Endpoint:** `POST /auth/validate-token`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "valid": true,
  "user": {
    "userId": "uuid",
    "email": "usuario@ejemplo.com",
    "role": "BENEFICIARY"
  }
}
```

**Errores:**
- `401` - Token inválido o expirado

---

## 👤 Perfil

### 1. Obtener Perfil

Obtener información del usuario autenticado.

**Endpoint:** `GET /auth/profile`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "userId": "uuid",
  "email": "usuario@ejemplo.com",
  "username": "juanperez",
  "documentType": "CC",
  "documentNumber": "1234567890",
  "phone": "+57 300 1234567",
  "role": "BENEFICIARY",
  "picture": "url-imagen",
  "isVerified": true,
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

### 2. Cambiar Contraseña

Cambiar contraseña del usuario autenticado.

**Endpoint:** `POST /auth/change-password`

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
```

**Response (200):**
```json
{
  "message": "Password changed successfully"
}
```

**Errores:**
- `400` - Contraseña actual incorrecta
- `400` - Nuevas contraseñas no coinciden
- `400` - Nueva contraseña no cumple requisitos

---

## 🔐 Recuperación de Contraseña

### 1. Solicitar Reset de Contraseña

Solicitar un token de reset de contraseña para un email registrado.

**Endpoint:** `POST /auth/forgot-password`

**Body:**
```json
{
  "email": "test.recovery@example.com"
}
```

**Response (200):**
```json
{
  "message": "Si el correo electrónico está registrado, recibirá instrucciones para recuperar tu contraseña",
  "token": "78Qc80db-d8b3-40ab-b996-c93beeca5ce6"
}
```

---

### 2. Validar Token de Reset

Verificar si un token de reset de contraseña es válido y no ha expirado.

**Endpoint:** `GET /auth/validate-reset-token/{token}`

**Parameters:**
```
token (string, required) - Token de reset recibido por correo
```

**Response (200):**
```json
{
  "valid": true,
  "message": "Token válido"
}
```

---

### 3. Resetear Contraseña

Resetear la contraseña usando un token válido.

**Endpoint:** `POST /auth/reset-password`

**Body:**
```json
{
  "token": "78Qc80db-d8b3-40ab-b996-c93beeca5ce6",
  "newPassword": "MySecurePassword123!"
}
```

**Response (200):**
```json
{
  "message": "Contraseña actualizada exitosamente"
}
```

**Errores:**
- `400` - Token inválido o expirado
- `400` - La contraseña no cumple los requisitos
- `400` - El token ha expirado

---

## 🔒 Autenticación

Todos los endpoints marcados con 🔐 requieren autenticación JWT:

**Header requerido:**
```
Authorization: Bearer {access_token}
```

---

## 📝 Notas

### Formato de Contraseñas

Las contraseñas deben cumplir:
- Mínimo 8 caracteres
- Al menos una letra mayúscula
- Al menos una letra minúscula
- Al menos un número
- Al menos un carácter especial (!@#$%^&*)

### Tokens

- **Access Token**: Expira en 15 minutos
- **Refresh Token**: Expira en 7 días
- **Reset Token**: Expira en 1 hora

### Roles de Usuario

- `ADMIN`: Administrador del sistema
- `ESTABLISHMENT`: Establecimiento/restaurante
- `BENEFICIARY`: Beneficiario/usuario final

### Google OAuth

Para obtener el `idToken`:
1. Usar Google Sign-In en el frontend
2. Obtener el token ID de la respuesta
3. Enviar el token al backend

---

## 🐛 Códigos de Error Comunes

| Código | Descripción |
|--------|-------------|
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - Token inválido o credenciales incorrectas |
| 403 | Forbidden - No tiene permisos |
| 404 | Not Found - Usuario no encontrado |
| 409 | Conflict - Email/username/documento ya existe |
| 500 | Internal Server Error |

---

## 🔗 Ver También

- [Guards Usage Guide](../GUARDS_USAGE.md)
- [Login Strategy](../login-strategy.md)
- [Swagger Documentation](http://localhost:3000/api)
