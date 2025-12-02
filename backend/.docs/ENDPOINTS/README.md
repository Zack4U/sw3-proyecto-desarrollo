# 📡 API Endpoints Documentation

Documentación completa de todos los endpoints disponibles en la API de **ComiYa Business**.

## 📚 Índice de Servicios

### 🔐 [Authentication (AUTH)](./AUTH.md)

Gestión de autenticación, registro y sesiones.

- **13 endpoints** documentados
- Registro básico, beneficiario y establecimiento
- Login local y Google OAuth
- Gestión de tokens JWT
- Perfil y cambio de contraseña

**Endpoints principales:**

- `POST /auth/register` - Registro básico
- `POST /auth/login` - Login con email/documento
- `POST /auth/google/login` - Login con Google
- `GET /auth/profile` - Obtener perfil
- `POST /auth/refresh` - Refrescar token

---

### 🍲 [Foods (FOODS)](./FOODS.md)

Gestión de alimentos publicados por establecimientos.

- **7 endpoints** + filtros avanzados
- CRUD completo
- Búsqueda por categoría, nombre, establecimiento
- **36 categorías** de alimentos
- **28 unidades** de medida
- **3 estados** (AVAILABLE, RESERVED, EXPIRED)

**Endpoints principales:**

- `POST /foods` - Crear alimento 🔒
- `GET /foods` - Listar todos
- `GET /foods/category/:category` - Filtrar por categoría
- `PUT /foods/:id` - Actualizar (solo dueño) 🔒
- `DELETE /foods/:id` - Eliminar (solo dueño) 🔒

---

### 🏢 [Establishments (ESTABLISHMENTS)](./ESTABLISHMENTS.md)

Gestión de establecimientos donantes.

- **9 endpoints** documentados
- CRUD + filtros avanzados
- Búsqueda por ciudad, departamento, barrio
- Paginación y disponibilidad de alimentos
- **50 tipos** de establecimientos

**Endpoints principales:**

- `POST /establishments` - Crear establecimiento 🔒
- `GET /establishments` - Listar con paginación
- `GET /establishments/available/food` - Con alimentos disponibles
- `GET /establishments/city/:cityId` - Por ciudad
- `PUT /establishments/:id` - Actualizar (solo dueño) 🔒

---

### 👤 [Users (USERS)](./USERS.md)

Gestión de perfiles de usuario.

- **3 endpoints** documentados
- Obtener y actualizar perfil
- Actualizar perfil de establecimiento
- Soporte para BENEFICIARY y ESTABLISHMENT

**Endpoints principales:**

- `GET /users/profile` - Obtener perfil completo 🔒
- `PUT /users/profile` - Actualizar perfil 🔒
- `PUT /users/establishment/profile` - Actualizar establecimiento 🔒

---

### 🏙️ [Cities (CITIES)](./CITIES.md)

Gestión de ciudades.

- **6 endpoints** documentados
- CRUD completo
- Filtrar por departamento
- Relación con establecimientos

**Endpoints principales:**

- `POST /cities` - Crear ciudad
- `GET /cities` - Listar todas
- `GET /cities/department/:departmentId` - Por departamento
- `PUT /cities/:id` - Actualizar
- `DELETE /cities/:id` - Eliminar

---

### 🗺️ [Departments (DEPARTMENTS)](./DEPARTMENTS.md)

Gestión de departamentos (estados/provincias).

- **5 endpoints** documentados
- CRUD completo
- Lista con ciudades incluidas
- 32 departamentos de Colombia

**Endpoints principales:**

- `POST /departments` - Crear departamento
- `GET /departments` - Listar todos con ciudades
- `GET /departments/:id` - Obtener uno
- `PUT /departments/:id` - Actualizar
- `DELETE /departments/:id` - Eliminar

---

### 🌍 [Geolocation (GEOLOCATION)](./GEOLOCATION.md)

Verificación de direcciones y coordenadas con Google Maps.

- **2 endpoints** documentados
- Verificar direcciones
- Verificar coordenadas (reverse geocoding)
- Formato GeoJSON Point

**Endpoints principales:**

- `POST /geolocation/verify-address` - Validar dirección 🔒
- `POST /geolocation/verify-coordinates` - Validar coordenadas 🔒

---

## 📊 Resumen General

| Servicio | Endpoints | Autenticación | Descripción |
|----------|-----------|---------------|-------------|
| **Auth** | 13 | Mixto | Registro, login, sesiones |
| **Foods** | 7 | Parcial | Gestión de alimentos |
| **Establishments** | 9 | Parcial | Gestión de establecimientos |
| **Users** | 3 | ✅ | Perfiles de usuario |
| **Cities** | 6 | ❌ | Gestión de ciudades |
| **Departments** | 5 | ❌ | Gestión de departamentos |
| **Geolocation** | 2 | ✅ | Verificación Google Maps |
| **TOTAL** | **45** | - | - |

---

## 🔒 Autenticación

La mayoría de endpoints requieren autenticación JWT. Los endpoints protegidos están marcados con 🔒.

### Obtener Token

```bash
# 1. Login
POST /auth/login
{
  "identifier": "usuario@example.com",
  "password": "password123"
}

# 2. Usar token en requests
Authorization: Bearer {accessToken}
```

### Refrescar Token

```bash
POST /auth/refresh
{
  "refreshToken": "..."
}
```

---

## 🌐 Base URL

### Desarrollo

```bash
http://localhost:3000
```

### Producción

```bash
https://api.comiya.com
```

---

## 📖 Swagger Documentation

Documentación interactiva disponible en:

```bash
http://localhost:3000/api/v1/docs
```

### Características de Swagger

- ✅ Probar endpoints directamente
- ✅ Ver modelos y esquemas
- ✅ Autenticación JWT integrada
- ✅ Ejemplos de request/response
- ✅ Códigos de error documentados

---

## 🔑 Roles de Usuario

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **BENEFICIARY** | Usuario que recibe alimentos | Ver alimentos, reservar |
| **ESTABLISHMENT** | Establecimiento donante | Publicar alimentos, gestionar establecimiento |
| **ADMIN** | Administrador del sistema | Acceso completo (futuro) |

---

## 📝 Convenciones

### Códigos de Estado HTTP

- `200` - OK (operación exitosa)
- `201` - Created (recurso creado)
- `400` - Bad Request (datos inválidos)
- `401` - Unauthorized (no autenticado)
- `403` - Forbidden (sin permisos)
- `404` - Not Found (recurso no encontrado)
- `409` - Conflict (conflicto de datos)
- `500` - Internal Server Error (error del servidor)

### Formato de Respuestas

#### Éxito

```json
{
  "data": { ... },
  "message": "Success"
}
```

#### Error

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### Paginación

```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

### Formato de Fechas

Todas las fechas están en formato ISO 8601:

```json
"createdAt": "2024-01-25T10:30:00.000Z"
```

### Coordenadas (GeoJSON Point)

```json
{
  "type": "Point",
  "coordinates": [longitude, latitude]
}
```

⚠️ **Nota:** El orden es `[longitud, latitud]`, no al revés.

---

## 🔍 Filtros y Búsqueda

### Query Parameters Comunes

```bash
# Paginación
?page=1&limit=10

# Ordenamiento
?sortBy=createdAt&order=desc

# Búsqueda
?search=pizza

# Filtros
?category=PANADERIA&status=AVAILABLE
```

---

## 🐛 Manejo de Errores

### Estructura de Error

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Errores Comunes

| Código | Mensaje | Solución |
|--------|---------|----------|
| 400 | Invalid data | Revisar formato de datos |
| 401 | Unauthorized | Incluir token válido |
| 403 | Forbidden | Verificar permisos |
| 404 | Not found | Verificar ID del recurso |
| 409 | Already exists | Usar datos únicos |
| 500 | Server error | Contactar soporte |

---

## 💡 Mejores Prácticas

### 1. Siempre Incluir Headers

```http
Content-Type: application/json
Authorization: Bearer {token}
```

### 2. Validar Antes de Enviar

- Verificar formato de email
- Validar longitud de contraseña
- Verificar UUIDs válidos

### 3. Manejar Errores

```javascript
try {
  const response = await fetch('/api/foods', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(foodData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    console.error('Error:', error.message);
  }
} catch (error) {
  console.error('Network error:', error);
}
```

### 4. Cachear Datos Estáticos

- Lista de departamentos
- Lista de ciudades
- Categorías de alimentos

### 5. Usar Paginación

```javascript
// No cargar todos los items de una vez
GET /establishments?page=1&limit=20
```

---

## 🔗 Enlaces Útiles

- [Swagger UI](http://localhost:3000/api) - Documentación interactiva
- [Prisma Schema](../../prisma/schema.prisma) - Modelos de base de datos
- [Backend README](../../README.md) - Setup y configuración
- [GitHub Repository](https://github.com/Zack4U/sw3-proyecto-desarrollo)

---

## 📞 Soporte

¿Problemas con la API?

1. Revisa la documentación específica del endpoint
2. Verifica Swagger UI para ejemplos
3. Revisa logs del servidor
4. Contacta al equipo de desarrollo

---

## 📄 Licencia

Este proyecto es parte de ComiYa Business - Software 3 Universidad.

---

**Última actualización:** Enero 2024

**Versión API:** 1.0.0
