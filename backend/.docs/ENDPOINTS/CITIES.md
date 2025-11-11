# 🏙️ Cities Endpoints

Base URL: `/cities`

Documentación de endpoints para gestión de ciudades.

---

## 📋 Tabla de Contenidos

- [🏙️ Cities Endpoints](#%EF%B8%8F-cities-endpoints)
  - [📋 Tabla de Contenidos](#-tabla-de-contenidos)
  - [📋 Endpoints Disponibles](#-endpoints-disponibles)
    - [1. Crear Ciudad](#1-crear-ciudad)
    - [2. Listar Todas las Ciudades](#2-listar-todas-las-ciudades)
    - [3. Obtener Ciudad por ID](#3-obtener-ciudad-por-id)
    - [4. Obtener Ciudades por Departamento](#4-obtener-ciudades-por-departamento)
    - [5. Actualizar Ciudad](#5-actualizar-ciudad)
    - [6. Eliminar Ciudad](#6-eliminar-ciudad)
  - [🗂️ Jerarquía Geográfica](#%EF%B8%8F-jerarquía-geográfica)
  - [💡 Casos de Uso Comunes](#-casos-de-uso-comunes)
  - [🔒 Permisos](#-permisos)
  - [📊 Principales Ciudades de Colombia](#-principales-ciudades-de-colombia)
  - [🐛 Manejo de Errores](#-manejo-de-errores)
  - [🔗 Ver También](#-ver-también)

---

## 📋 Endpoints Disponibles

### 1. Crear Ciudad

**`POST /cities`**

Crea una nueva ciudad asociada a un departamento.

**Headers:**

```http
Content-Type: application/json
```

**Body:**

```json
{
  "name": "Bogotá",
  "departmentId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Response (201):**

```json
{
  "cityId": "456e7890-e89b-12d3-a456-426614174111",
  "name": "Bogotá",
  "departmentId": "123e4567-e89b-12d3-a456-426614174000",
  "createdAt": "2024-01-25T10:30:00.000Z",
  "updatedAt": "2024-01-25T10:30:00.000Z",
  "department": {
    "departmentId": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Cundinamarca",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errores:**

- `400` - Datos inválidos (nombre vacío, departmentId inválido)
- `404` - Departamento no encontrado
- `409` - La ciudad ya existe en ese departamento

**Notas:**

- El nombre de la ciudad debe ser único dentro de cada departamento
- Dos departamentos pueden tener ciudades con el mismo nombre
- El `departmentId` debe ser un UUID válido de un departamento existente

---

### 2. Listar Todas las Ciudades

**`GET /cities`**

Obtiene todas las ciudades con sus departamentos.

**Response (200):**

```json
[
  {
    "cityId": "456e7890-e89b-12d3-a456-426614174111",
    "name": "Bogotá",
    "departmentId": "123e4567-e89b-12d3-a456-426614174000",
    "createdAt": "2024-01-25T10:30:00.000Z",
    "updatedAt": "2024-01-25T10:30:00.000Z",
    "department": {
      "departmentId": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Cundinamarca"
    }
  },
  {
    "cityId": "789e1234-e89b-12d3-a456-426614174222",
    "name": "Medellín",
    "departmentId": "234e5678-e89b-12d3-a456-426614174333",
    "department": {
      "departmentId": "234e5678-e89b-12d3-a456-426614174333",
      "name": "Antioquia"
    }
  },
  {
    "cityId": "891e2345-e89b-12d3-a456-426614174444",
    "name": "Cali",
    "departmentId": "345e6789-e89b-12d3-a456-426614174555",
    "department": {
      "departmentId": "345e6789-e89b-12d3-a456-426614174555",
      "name": "Valle del Cauca"
    }
  }
]
```

**Notas:**

- Retorna todas las ciudades ordenadas alfabéticamente
- Incluye información básica del departamento asociado
- Útil para poblar selectores en formularios

---

### 3. Obtener Ciudad por ID

**`GET /cities/:id`**

Obtiene la información de una ciudad específica con su departamento y establecimientos.

**Parámetros URL:**

- `id` (string, required): UUID de la ciudad

**Ejemplo:**

```http
GET /cities/456e7890-e89b-12d3-a456-426614174111
```

**Response (200):**

```json
{
  "cityId": "456e7890-e89b-12d3-a456-426614174111",
  "name": "Bogotá",
  "departmentId": "123e4567-e89b-12d3-a456-426614174000",
  "createdAt": "2024-01-25T10:30:00.000Z",
  "updatedAt": "2024-01-25T10:30:00.000Z",
  "department": {
    "departmentId": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Cundinamarca",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "establishments": [
    {
      "establishmentId": "est-uuid-123",
      "name": "Restaurante El Buen Sabor",
      "type": "RESTAURANTE",
      "address": "Calle 123 #45-67",
      "neighborhood": "Chapinero"
    },
    {
      "establishmentId": "est-uuid-456",
      "name": "Panadería La Esmeralda",
      "type": "PANADERIA",
      "address": "Carrera 45 #67-89",
      "neighborhood": "Usaquén"
    }
  ]
}
```

**Errores:**

- `404` - Ciudad no encontrada

---

### 4. Obtener Ciudades por Departamento

**`GET /cities/department/:departmentId`**

Obtiene todas las ciudades que pertenecen a un departamento específico.

**Parámetros URL:**

- `departmentId` (string, required): UUID del departamento

**Ejemplo:**

```http
GET /cities/department/123e4567-e89b-12d3-a456-426614174000
```

**Response (200):**

```json
[
  {
    "cityId": "456e7890-e89b-12d3-a456-426614174111",
    "name": "Bogotá",
    "departmentId": "123e4567-e89b-12d3-a456-426614174000",
    "createdAt": "2024-01-25T10:30:00.000Z",
    "updatedAt": "2024-01-25T10:30:00.000Z"
  },
  {
    "cityId": "567e8901-e89b-12d3-a456-426614174666",
    "name": "Soacha",
    "departmentId": "123e4567-e89b-12d3-a456-426614174000",
    "createdAt": "2024-01-25T11:00:00.000Z",
    "updatedAt": "2024-01-25T11:00:00.000Z"
  },
  {
    "cityId": "678e9012-e89b-12d3-a456-426614174777",
    "name": "Chía",
    "departmentId": "123e4567-e89b-12d3-a456-426614174000",
    "createdAt": "2024-01-25T11:15:00.000Z",
    "updatedAt": "2024-01-25T11:15:00.000Z"
  }
]
```

**Errores:**

- `404` - Departamento no encontrado

**Notas:**

- Retorna array vacío si el departamento no tiene ciudades
- Útil para selectores dependientes (primero departamento, luego ciudad)

---

### 5. Actualizar Ciudad

**`PUT /cities/:id`**

Actualiza la información de una ciudad existente.

**Parámetros URL:**

- `id` (string, required): UUID de la ciudad

**Headers:**

```http
Content-Type: application/json
```

**Body:**

```json
{
  "name": "Bogotá D.C.",
  "departmentId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Campos opcionales:**

- `name` (string): Nuevo nombre de la ciudad
- `departmentId` (string): Nuevo departamento al que pertenece

**Response (200):**

```json
{
  "cityId": "456e7890-e89b-12d3-a456-426614174111",
  "name": "Bogotá D.C.",
  "departmentId": "123e4567-e89b-12d3-a456-426614174000",
  "createdAt": "2024-01-25T10:30:00.000Z",
  "updatedAt": "2024-01-25T15:45:00.000Z",
  "department": {
    "departmentId": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Cundinamarca"
  }
}
```

**Errores:**

- `400` - Datos inválidos
- `404` - Ciudad o departamento no encontrado
- `409` - Ya existe una ciudad con ese nombre en el departamento

---

### 6. Eliminar Ciudad

**`DELETE /cities/:id`**

Elimina una ciudad del sistema.

**Parámetros URL:**

- `id` (string, required): UUID de la ciudad

**Ejemplo:**

```http
DELETE /cities/456e7890-e89b-12d3-a456-426614174111
```

**Response (200):**

```json
{
  "message": "City deleted successfully",
  "cityId": "456e7890-e89b-12d3-a456-426614174111"
}
```

**Errores:**

- `400` - No se puede eliminar: la ciudad tiene establecimientos asociados
- `404` - Ciudad no encontrada

**Notas:**

- ⚠️ **Operación crítica:** Solo se puede eliminar si no tiene establecimientos
- Considerar desactivación (soft delete) en lugar de eliminación permanente

---

## 🗂️ Jerarquía Geográfica

```
Colombia (País)
└── Departamento (Department)
    └── Ciudad (City)
        └── Establecimiento (Establishment)
            └── Comida (Food)
```

---

## 💡 Casos de Uso Comunes

### Selector Departamento → Ciudad

```javascript
// 1. Usuario selecciona departamento
const departmentId = "123e4567-e89b-12d3-a456-426614174000";

// 2. Frontend carga ciudades del departamento
const cities = await fetch(`/cities/department/${departmentId}`);

// 3. Usuario selecciona ciudad
const cityId = cities[0].cityId;
```

### Crear Establecimiento

```javascript
// Necesitas el cityId para crear un establecimiento
POST /establishments
{
  "name": "Mi Restaurante",
  "cityId": "456e7890-e89b-12d3-a456-426614174111",
  ...
}
```

### Buscar Establecimientos por Ciudad

```javascript
// Ver establecimientos de una ciudad específica
GET /establishments/city/456e7890-e89b-12d3-a456-426614174111
```

---

## 🔒 Permisos

| Endpoint | Autenticación | Rol | Notas |
|----------|--------------|-----|-------|
| POST /cities | ❌ | Público | Considerar proteger en producción |
| GET /cities | ❌ | Público | Necesario para formularios |
| GET /cities/:id | ❌ | Público | Info pública |
| GET /cities/department/:departmentId | ❌ | Público | Necesario para selectores |
| PUT /cities/:id | ❌ | Público | ⚠️ Debería requerir ADMIN |
| DELETE /cities/:id | ❌ | Público | ⚠️ Debería requerir ADMIN |

⚠️ **Recomendación:** Los endpoints de escritura (POST, PUT, DELETE) deberían estar protegidos con autenticación y rol ADMIN en producción.

---

## 📊 Principales Ciudades de Colombia

Algunas ciudades importantes:

- **Bogotá** (Cundinamarca)
- **Medellín** (Antioquia)
- **Cali** (Valle del Cauca)
- **Barranquilla** (Atlántico)
- **Cartagena** (Bolívar)
- **Bucaramanga** (Santander)
- **Pereira** (Risaralda)
- **Cúcuta** (Norte de Santander)
- **Manizales** (Caldas)
- **Armenia** (Quindío)

---

## 🐛 Manejo de Errores

### Error 404 - Ciudad no encontrada

```json
{
  "statusCode": 404,
  "message": "City with ID 456e7890-e89b-12d3-a456-426614174111 not found",
  "error": "Not Found"
}
```

### Error 400 - No se puede eliminar

```json
{
  "statusCode": 400,
  "message": "Cannot delete city. It has 5 associated establishments",
  "error": "Bad Request"
}
```

### Error 409 - Ciudad duplicada

```json
{
  "statusCode": 409,
  "message": "A city with name 'Bogotá' already exists in department 'Cundinamarca'",
  "error": "Conflict"
}
```

---

## 🔗 Ver También

- [Departments Endpoints](./DEPARTMENTS.md) - Gestión de departamentos
- [Establishments Endpoints](./ESTABLISHMENTS.md) - Filtrar por ciudad
- [Database Schema](../../prisma/schema.prisma) - Modelo City
