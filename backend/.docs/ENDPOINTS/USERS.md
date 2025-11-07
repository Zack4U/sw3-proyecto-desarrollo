# 👤 Users Endpoints

Base URL: `/users`

Documentación de endpoints para gestión de perfiles de usuario.

---

## 📋 Tabla de Contenidos

- [Obtener Perfil del Usuario Autenticado](#1-obtener-perfil-del-usuario-autenticado)
- [Actualizar Perfil del Usuario](#2-actualizar-perfil-del-usuario)
- [Actualizar Perfil de Establecimiento](#3-actualizar-perfil-de-establecimiento)
- [Enumeraciones](#-enumeraciones)
- [Permisos](#-permisos)
- [Relaciones](#-relaciones)
- [Casos de Uso](#-casos-de-uso)

---

## 📋 Endpoints Disponibles

### 1. Obtener Perfil del Usuario Autenticado

**`GET /users/profile`** 🔒

Obtiene la información completa del usuario autenticado. Si el usuario es de tipo ESTABLISHMENT, también incluye la información del establecimiento.

**Headers:**

```http
Authorization: Bearer {token}
```

**Response (200) - Usuario BENEFICIARY:**

```json
{
  "user": {
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "email": "usuario@example.com",
    "role": "BENEFICIARY",
    "isEmailVerified": true,
    "isProfileComplete": true,
    "phone": "+57 300 123 4567",
    "documentType": "CC",
    "documentNumber": "1234567890",
    "firstName": "Juan",
    "lastName": "Pérez",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-20T14:25:00.000Z"
  },
  "establishment": null
}
```

**Response (200) - Usuario ESTABLISHMENT:**

```json
{
  "user": {
    "userId": "456e7890-e89b-12d3-a456-426614174111",
    "email": "restaurante@example.com",
    "role": "ESTABLISHMENT",
    "isEmailVerified": true,
    "isProfileComplete": true,
    "phone": "+57 300 987 6543",
    "documentType": "NIT",
    "documentNumber": "900123456-7",
    "firstName": "Restaurante",
    "lastName": "El Buen Sabor",
    "createdAt": "2024-01-10T08:15:00.000Z",
    "updatedAt": "2024-01-22T16:45:00.000Z"
  },
  "establishment": {
    "establishmentId": "789e1234-e89b-12d3-a456-426614174222",
    "userId": "456e7890-e89b-12d3-a456-426614174111",
    "name": "Restaurante El Buen Sabor",
    "type": "RESTAURANTE",
    "description": "Restaurante de comida colombiana",
    "address": "Calle 123 #45-67, Bogotá",
    "neighborhood": "Chapinero",
    "cityId": "city-uuid-123",
    "location": {
      "type": "Point",
      "coordinates": [-74.0721, 4.7110]
    },
    "email": "contacto@elbuensabor.com",
    "phone": "+57 1 234 5678",
    "photoUrl": "https://example.com/photos/establecimiento.jpg",
    "isActive": true,
    "createdAt": "2024-01-10T08:30:00.000Z",
    "updatedAt": "2024-01-22T16:45:00.000Z"
  }
}
```

**Errores:**

- `401` - No autenticado
- `404` - Usuario no encontrado

---

### 2. Actualizar Perfil del Usuario

**`PUT /users/profile`** 🔒

Actualiza la información del perfil del usuario autenticado (nombre, email, teléfono, documento).

**Headers:**

```http
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**

```json
{
  "email": "nuevo@example.com",
  "phone": "+57 300 999 8888",
  "documentType": "CC",
  "documentNumber": "9876543210",
  "firstName": "Carlos",
  "lastName": "Gómez"
}
```

**Campos opcionales:**

- `email` (string): Nuevo email (debe ser único)
- `phone` (string): Nuevo teléfono
- `documentType` (enum): CC | TI | CE | RC | PAS | PPT | NIT
- `documentNumber` (string): Nuevo número de documento (debe ser único)
- `firstName` (string): Nuevo nombre
- `lastName` (string): Nuevo apellido

**Response (200):**

```json
{
  "user": {
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "email": "nuevo@example.com",
    "role": "BENEFICIARY",
    "isEmailVerified": true,
    "isProfileComplete": true,
    "phone": "+57 300 999 8888",
    "documentType": "CC",
    "documentNumber": "9876543210",
    "firstName": "Carlos",
    "lastName": "Gómez",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-25T09:15:00.000Z"
  }
}
```

**Errores:**

- `400` - Datos inválidos
- `401` - No autenticado
- `409` - Email o documento ya está en uso

---

### 3. Actualizar Perfil de Establecimiento

**`PUT /users/establishment/profile`** 🔒

Actualiza tanto el perfil del usuario como la información del establecimiento. Solo disponible para usuarios con rol ESTABLISHMENT.

**Headers:**

```http
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**

```json
{
  "email": "nuevo@restaurante.com",
  "phone": "+57 300 888 7777",
  "name": "Restaurante El Buen Sabor - Sede Norte",
  "type": "RESTAURANTE",
  "description": "Especialidad en comida colombiana casera",
  "address": "Calle 456 #78-90, Bogotá",
  "neighborhood": "Usaquén",
  "cityId": "city-uuid-456",
  "location": {
    "type": "Point",
    "coordinates": [-74.0321, 4.7310]
  },
  "photoUrl": "https://example.com/new-photo.jpg"
}
```

**Campos opcionales - Usuario:**

- `email` (string): Nuevo email
- `phone` (string): Nuevo teléfono

**Campos opcionales - Establecimiento:**

- `name` (string): Nuevo nombre del establecimiento
- `type` (enum): Tipo de establecimiento (ver [ESTABLISHMENTS.md](./ESTABLISHMENTS.md))
- `description` (string): Nueva descripción
- `address` (string): Nueva dirección
- `neighborhood` (string): Nuevo barrio
- `cityId` (string): Nueva ciudad (UUID)
- `location` (object): Nueva ubicación GeoJSON Point
- `photoUrl` (string): Nueva URL de foto

**Response (200):**

```json
{
  "user": {
    "userId": "456e7890-e89b-12d3-a456-426614174111",
    "email": "nuevo@restaurante.com",
    "role": "ESTABLISHMENT",
    "phone": "+57 300 888 7777",
    "updatedAt": "2024-01-25T10:20:00.000Z"
  },
  "establishment": {
    "establishmentId": "789e1234-e89b-12d3-a456-426614174222",
    "name": "Restaurante El Buen Sabor - Sede Norte",
    "type": "RESTAURANTE",
    "description": "Especialidad en comida colombiana casera",
    "address": "Calle 456 #78-90, Bogotá",
    "neighborhood": "Usaquén",
    "cityId": "city-uuid-456",
    "location": {
      "type": "Point",
      "coordinates": [-74.0321, 4.7310]
    },
    "photoUrl": "https://example.com/new-photo.jpg",
    "updatedAt": "2024-01-25T10:20:00.000Z"
  }
}
```

**Errores:**

- `400` - Solo usuarios con rol ESTABLISHMENT pueden usar este endpoint
- `401` - No autenticado
- `404` - Establecimiento no encontrado
- `409` - Email ya está en uso

**Notas:**

- Este endpoint usa transacciones para actualizar ambas entidades atómicamente
- Si falla alguna actualización, se revierten todos los cambios
- La ubicación debe estar en formato GeoJSON Point

---

## 📝 Enumeraciones

### DocumentType

Tipos de documento soportados:

```typescript
enum DocumentType {
  CC = 'CC',      // Cédula de Ciudadanía (Colombia)
  TI = 'TI',      // Tarjeta de Identidad
  CE = 'CE',      // Cédula de Extranjería
  RC = 'RC',      // Registro Civil
  PAS = 'PAS',    // Pasaporte
  PPT = 'PPT',    // Permiso por Protección Temporal
  NIT = 'NIT'     // NIT (Para establecimientos)
}
```

### Role

Roles de usuario:

```typescript
enum Role {
  BENEFICIARY = 'BENEFICIARY',       // Usuario beneficiario
  ESTABLISHMENT = 'ESTABLISHMENT',   // Usuario establecimiento
  ADMIN = 'ADMIN'                    // Administrador (futuro)
}
```

---

## 🔒 Permisos

| Endpoint | Autenticación | Rol | Restricciones |
|----------|--------------|-----|---------------|
| GET /users/profile | ✅ | Cualquiera | Solo su propio perfil |
| PUT /users/profile | ✅ | Cualquiera | Solo su propio perfil |
| PUT /users/establishment/profile | ✅ | ESTABLISHMENT | Solo su propio establecimiento |

---

## 🔄 Relaciones

- **User → Beneficiary:** Un usuario BENEFICIARY puede tener 0 o 1 beneficiario
- **User → Establishment:** Un usuario ESTABLISHMENT debe tener exactamente 1 establecimiento
- **Establishment → City:** Un establecimiento pertenece a una ciudad
- **City → Department:** Una ciudad pertenece a un departamento

---

## 💡 Casos de Uso

### Actualizar Solo Email

```json
PUT /users/profile
{
  "email": "nuevoemail@example.com"
}
```

### Completar Perfil Después del Registro

```json
PUT /users/profile
{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "firstName": "María",
  "lastName": "López",
  "phone": "+57 300 123 4567"
}
```

### Actualizar Ubicación del Establecimiento

```json
PUT /users/establishment/profile
{
  "address": "Nueva dirección 123",
  "neighborhood": "Nuevo barrio",
  "location": {
    "type": "Point",
    "coordinates": [-74.0500, 4.7000]
  }
}
```

---

## 🐛 Manejo de Errores

### Error 400 - Solo ESTABLISHMENT

```json
{
  "statusCode": 400,
  "message": "Only ESTABLISHMENT users can update establishment profile",
  "error": "Bad Request"
}
```

### Error 409 - Email duplicado

```json
{
  "statusCode": 409,
  "message": "Email already in use",
  "error": "Conflict"
}
```

### Error 409 - Documento duplicado

```json
{
  "statusCode": 409,
  "message": "Document number already in use",
  "error": "Conflict"
}
```

---

## 🔗 Ver También

- [Auth Endpoints](./AUTH.md) - Para registro y autenticación
- [Establishments Endpoints](./ESTABLISHMENTS.md) - Para gestión completa de establecimientos
- [Geolocation Endpoints](./GEOLOCATION.md) - Para verificar direcciones
