# 🗺️ Departments Endpoints

Base URL: `/departments`

Documentación de endpoints para gestión de departamentos (estados/provincias).

---

## 📋 Tabla de Contenidos

- [Crear Departamento](#1-crear-departamento)
- [Listar Todos los Departamentos](#2-listar-todos-los-departamentos)
- [Obtener Departamento por ID](#3-obtener-departamento-por-id)
- [Actualizar Departamento](#4-actualizar-departamento)
- [Eliminar Departamento](#5-eliminar-departamento)
- [Jerarquía Geográfica](#-jerarquía-geográfica)
- [Departamentos de Colombia](#-departamentos-de-colombia)
- [Casos de Uso Comunes](#-casos-de-uso-comunes)
- [Permisos](#-permisos)

---

## 📋 Endpoints Disponibles

### 1. Crear Departamento

**`POST /departments`**

Crea un nuevo departamento.

**Headers:**

```http
Content-Type: application/json
```

**Body:**

```json
{
  "name": "Cundinamarca"
}
```

**Response (201):**

```json
{
  "departmentId": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Cundinamarca",
  "createdAt": "2024-01-25T10:00:00.000Z",
  "updatedAt": "2024-01-25T10:00:00.000Z"
}
```

**Errores:**

- `400` - Datos inválidos (nombre vacío)
- `409` - El departamento ya existe

**Notas:**

- El nombre del departamento debe ser único
- El nombre es case-sensitive

---

### 2. Listar Todos los Departamentos

**`GET /departments`**

Obtiene todos los departamentos con sus ciudades.

**Response (200):**

```json
[
  {
    "departmentId": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Cundinamarca",
    "createdAt": "2024-01-25T10:00:00.000Z",
    "updatedAt": "2024-01-25T10:00:00.000Z",
    "cities": [
      {
        "cityId": "456e7890-e89b-12d3-a456-426614174111",
        "name": "Bogotá",
        "departmentId": "123e4567-e89b-12d3-a456-426614174000"
      },
      {
        "cityId": "567e8901-e89b-12d3-a456-426614174666",
        "name": "Soacha",
        "departmentId": "123e4567-e89b-12d3-a456-426614174000"
      },
      {
        "cityId": "678e9012-e89b-12d3-a456-426614174777",
        "name": "Chía",
        "departmentId": "123e4567-e89b-12d3-a456-426614174000"
      }
    ]
  },
  {
    "departmentId": "234e5678-e89b-12d3-a456-426614174333",
    "name": "Antioquia",
    "createdAt": "2024-01-25T10:05:00.000Z",
    "updatedAt": "2024-01-25T10:05:00.000Z",
    "cities": [
      {
        "cityId": "789e1234-e89b-12d3-a456-426614174222",
        "name": "Medellín",
        "departmentId": "234e5678-e89b-12d3-a456-426614174333"
      }
    ]
  },
  {
    "departmentId": "345e6789-e89b-12d3-a456-426614174555",
    "name": "Valle del Cauca",
    "createdAt": "2024-01-25T10:10:00.000Z",
    "updatedAt": "2024-01-25T10:10:00.000Z",
    "cities": [
      {
        "cityId": "891e2345-e89b-12d3-a456-426614174444",
        "name": "Cali",
        "departmentId": "345e6789-e89b-12d3-a456-426614174555"
      }
    ]
  }
]
```

**Notas:**

- Incluye todas las ciudades de cada departamento
- Útil para construir selectores jerárquicos
- Ordenado alfabéticamente por nombre de departamento

---

### 3. Obtener Departamento por ID

**`GET /departments/:id`**

Obtiene la información de un departamento específico con todas sus ciudades.

**Parámetros URL:**

- `id` (string, required): UUID del departamento

**Ejemplo:**

```http
GET /departments/123e4567-e89b-12d3-a456-426614174000
```

**Response (200):**

```json
{
  "departmentId": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Cundinamarca",
  "createdAt": "2024-01-25T10:00:00.000Z",
  "updatedAt": "2024-01-25T10:00:00.000Z",
  "cities": [
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
    }
  ]
}
```

**Errores:**

- `404` - Departamento no encontrado

---

### 4. Actualizar Departamento

**`PUT /departments/:id`**

Actualiza la información de un departamento existente.

**Parámetros URL:**

- `id` (string, required): UUID del departamento

**Headers:**

```http
Content-Type: application/json
```

**Body:**

```json
{
  "name": "Cundinamarca (Actualizado)"
}
```

**Response (200):**

```json
{
  "departmentId": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Cundinamarca (Actualizado)",
  "createdAt": "2024-01-25T10:00:00.000Z",
  "updatedAt": "2024-01-25T16:30:00.000Z"
}
```

**Errores:**

- `400` - Datos inválidos (nombre vacío)
- `404` - Departamento no encontrado
- `409` - Ya existe un departamento con ese nombre

---

### 5. Eliminar Departamento

**`DELETE /departments/:id`**

Elimina un departamento del sistema.

**Parámetros URL:**

- `id` (string, required): UUID del departamento

**Ejemplo:**

```http
DELETE /departments/123e4567-e89b-12d3-a456-426614174000
```

**Response (200):**

```json
{
  "message": "Department deleted successfully",
  "departmentId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Errores:**

- `400` - No se puede eliminar: el departamento tiene ciudades asociadas
- `404` - Departamento no encontrado

**Notas:**

- ⚠️ **Operación crítica:** Solo se puede eliminar si no tiene ciudades
- En cascada: Si eliminas un departamento, también se eliminan sus ciudades y establecimientos
- Recomendado: Implementar soft delete en lugar de eliminación permanente

---

## 🗂️ Jerarquía Geográfica

```text
Colombia (País)
└── 🗺️ Departamento (Department)
    └── 🏙️ Ciudad (City)
        └── 🏢 Establecimiento (Establishment)
            └── 🍲 Comida (Food)
```

---

## 📍 Departamentos de Colombia

Colombia está dividida en **32 departamentos** + **1 distrito capital** (Bogotá D.C.):

### Principales Departamentos

| Código | Nombre | Capital | Región |
|--------|--------|---------|--------|
| 11 | Cundinamarca | Bogotá | Andina |
| 05 | Antioquia | Medellín | Andina |
| 76 | Valle del Cauca | Cali | Pacífica |
| 08 | Atlántico | Barranquilla | Caribe |
| 13 | Bolívar | Cartagena | Caribe |
| 68 | Santander | Bucaramanga | Andina |
| 66 | Risaralda | Pereira | Andina |
| 54 | Norte de Santander | Cúcuta | Andina |
| 17 | Caldas | Manizales | Andina |
| 63 | Quindío | Armenia | Andina |

### Regiones

- **Región Andina:** Cundinamarca, Antioquia, Santander, Boyacá, etc.
- **Región Caribe:** Atlántico, Bolívar, Magdalena, Cesar, etc.
- **Región Pacífica:** Valle del Cauca, Chocó, Cauca, Nariño
- **Región Orinoquía:** Meta, Casanare, Arauca, Vichada
- **Región Amazonía:** Amazonas, Caquetá, Putumayo, Guainía
- **Región Insular:** San Andrés y Providencia

---

## 💡 Casos de Uso Comunes

### Selector en Cascada (Departamento → Ciudad)

```javascript
// 1. Cargar todos los departamentos
const departments = await fetch('/departments');

// 2. Usuario selecciona departamento
const selectedDept = departments[0];

// 3. Obtener ciudades del departamento
const cities = await fetch(`/cities/department/${selectedDept.departmentId}`);

// 4. Usuario selecciona ciudad
const selectedCity = cities[0];
```

### Crear Estructura Geográfica Completa

```javascript
// 1. Crear departamento
const dept = await fetch('/departments', {
  method: 'POST',
  body: JSON.stringify({ name: 'Cundinamarca' })
});

// 2. Crear ciudades en ese departamento
const bogota = await fetch('/cities', {
  method: 'POST',
  body: JSON.stringify({
    name: 'Bogotá',
    departmentId: dept.departmentId
  })
});

const soacha = await fetch('/cities', {
  method: 'POST',
  body: JSON.stringify({
    name: 'Soacha',
    departmentId: dept.departmentId
  })
});
```

### Filtrar Establecimientos por Región

```javascript
// Obtener todos los establecimientos de Cundinamarca
const dept = await fetch('/departments/123...'); // Cundinamarca
const allEstablishments = [];

for (const city of dept.cities) {
  const cityEstabs = await fetch(`/establishments/city/${city.cityId}`);
  allEstablishments.push(...cityEstabs);
}
```

---

## 🔒 Permisos

| Endpoint | Autenticación | Rol | Notas |
|----------|--------------|-----|-------|
| POST /departments | ❌ | Público | ⚠️ Debería requerir ADMIN |
| GET /departments | ❌ | Público | Necesario para formularios |
| GET /departments/:id | ❌ | Público | Info pública |
| PUT /departments/:id | ❌ | Público | ⚠️ Debería requerir ADMIN |
| DELETE /departments/:id | ❌ | Público | ⚠️ Debería requerir ADMIN |

⚠️ **Recomendación de Seguridad:**

Los endpoints de escritura (POST, PUT, DELETE) deberían estar protegidos:

```typescript
@Post()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
create(@Body() dto: CreateDepartmentDto) {
  return this.departmentsService.create(dto);
}
```

---

## 🐛 Manejo de Errores

### Error 404 - Departamento no encontrado

```json
{
  "statusCode": 404,
  "message": "Department with ID 123e4567-e89b-12d3-a456-426614174000 not found",
  "error": "Not Found"
}
```

### Error 400 - No se puede eliminar

```json
{
  "statusCode": 400,
  "message": "Cannot delete department. It has 15 associated cities",
  "error": "Bad Request"
}
```

### Error 409 - Departamento duplicado

```json
{
  "statusCode": 409,
  "message": "A department with name 'Cundinamarca' already exists",
  "error": "Conflict"
}
```

---

## 📊 Estadísticas

### Distribución Poblacional (Estimada)

- **Cundinamarca + Bogotá:** ~11 millones
- **Antioquia:** ~6.5 millones
- **Valle del Cauca:** ~4.5 millones
- **Atlántico:** ~2.5 millones
- **Santander:** ~2 millones

Esto es relevante para priorizar la carga de datos y optimización de consultas.

---

## 🔗 Ver También

- [Cities Endpoints](./CITIES.md) - Gestión de ciudades
- [Establishments Endpoints](./ESTABLISHMENTS.md) - Filtrar por departamento
- [Database Schema](../../prisma/schema.prisma) - Modelo Department
- [DANE - Departamentos de Colombia](https://www.dane.gov.co/) - Fuente oficial

---

## 💡 Mejores Prácticas

### 1. Pre-cargar Datos Geográficos

```bash
# Script SQL para poblar departamentos y ciudades
npm run seed:geography
```

### 2. Cachear Lista de Departamentos

```javascript
// Frontend: Cachear en memoria ya que raramente cambian
const DEPARTMENTS_CACHE_TIME = 24 * 60 * 60 * 1000; // 24 horas
```

### 3. Validación en Cascada

```typescript
// Validar que la ciudad pertenece al departamento seleccionado
if (city.departmentId !== selectedDepartmentId) {
  throw new BadRequestException('City does not belong to selected department');
}
```

### 4. Soft Delete

```typescript
// Agregar campo isActive en lugar de eliminar
model Department {
  departmentId String   @id @default(uuid())
  name         String   @unique
  isActive     Boolean  @default(true)
  deletedAt    DateTime?
}
```

---

## 🔍 Búsqueda y Filtrado

### Buscar por Nombre (Futuro)

```http
GET /departments?search=cundi
```

```json
[
  {
    "departmentId": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Cundinamarca",
    "cities": [...]
  }
]
```

### Filtrar por Región (Futuro)

```http
GET /departments?region=ANDINA
```

```json
[
  { "name": "Cundinamarca", "region": "ANDINA" },
  { "name": "Antioquia", "region": "ANDINA" },
  { "name": "Santander", "region": "ANDINA" }
]
```

---

## 📝 Notas de Implementación

### Relaciones Prisma

```prisma
model Department {
  departmentId String   @id @default(uuid())
  name         String   @unique
  cities       City[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model City {
  cityId       String        @id @default(uuid())
  name         String
  departmentId String
  department   Department    @relation(fields: [departmentId], references: [departmentId])
  establishments Establishment[]
  
  @@unique([name, departmentId]) // Una ciudad por departamento
}
```

### Índices para Performance

```prisma
model Department {
  // ...
  @@index([name])
}

model City {
  // ...
  @@index([departmentId])
  @@index([name, departmentId])
}
```
