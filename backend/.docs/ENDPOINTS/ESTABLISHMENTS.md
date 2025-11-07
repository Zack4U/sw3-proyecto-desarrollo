# 🏪 Establishments Endpoints

Base URL: `/establishments`

Documentación de endpoints para gestión de establecimientos.

---

## 📋 Tabla de Contenidos

- [🏪 Establishments Endpoints](#-establishments-endpoints)
  - [📋 Tabla de Contenidos](#-tabla-de-contenidos)
  - [📋 Endpoints Disponibles](#-endpoints-disponibles)
    - [1. Crear Establecimiento](#1-crear-establecimiento)
    - [2. Listar Todos](#2-listar-todos)
    - [3. Establecimientos con Comida Disponible](#3-establecimientos-con-comida-disponible)
    - [4. Obtener por ID](#4-obtener-por-id)
    - [5. Actualizar Establecimiento](#5-actualizar-establecimiento)
    - [6. Eliminar Establecimiento](#6-eliminar-establecimiento)
    - [7. Por Ciudad](#7-por-ciudad)
    - [8. Por Departamento](#8-por-departamento)
    - [9. Por Barrio](#9-por-barrio)
  - [📊 Tipos de Establecimientos](#-tipos-de-establecimientos)
  - [🔒 Permisos](#-permisos)
  - [🔗 Ver También](#-ver-también)

---

## 📋 Endpoints Disponibles

### 1. Crear Establecimiento

**`POST /establishments`** 🔒

Crear un nuevo establecimiento (solo rol ESTABLISHMENT).

**Body:**
```json
{
  "establishmentId": "uuid",
  "name": "Restaurante Central",
  "description": "Comida colombiana tradicional",
  "cityId": "uuid-ciudad",
  "neighborhood": "Centro",
  "address": "Calle 123 #45-67",
  "location": {
    "type": "Point",
    "coordinates": [-74.0721, 4.7110]
  },
  "establishmentType": "RESTAURANT",
  "userId": "uuid-usuario"
}
```

**Response (201):** Establecimiento creado

---

### 2. Listar Todos

**`GET /establishments`**

Obtener lista paginada de establecimientos.

**Query params:**
- `page` (number, opcional): Número de página
- `limit` (number, opcional): Items por página

**Response (200):**
```json
{
  "data": [
    {
      "establishmentId": "uuid",
      "name": "Restaurante Central",
      "address": "Calle 123 #45-67",
      "establishmentType": "RESTAURANT",
      "city": {
        "name": "Bogotá",
        "department": {
          "name": "Cundinamarca"
        }
      }
    }
  ],
  "total": 25
}
```

---

### 3. Establecimientos con Comida Disponible

**`GET /establishments/available/food`**

Obtener establecimientos que tienen alimentos disponibles.

**Query params:**
- `page`, `limit`: Paginación
- `cityId` (uuid, opcional): Filtrar por ciudad
- `departmentId` (uuid, opcional): Filtrar por departamento
- `establishmentType` (enum, opcional): Filtrar por tipo

**Response (200):**
```json
[
  {
    "establishmentId": "uuid",
    "name": "Panadería Central",
    "address": "Calle 123",
    "location": {
      "type": "Point",
      "coordinates": [-74.0721, 4.7110]
    },
    "foodAvailable": 15,
    "city": {
      "name": "Bogotá"
    }
  }
]
```

---

### 4. Obtener por ID

**`GET /establishments/:id`**

Obtener información detallada de un establecimiento.

**Response (200):**
```json
{
  "establishmentId": "uuid",
  "name": "Restaurante Central",
  "description": "Comida colombiana",
  "address": "Calle 123 #45-67",
  "neighborhood": "Centro",
  "location": {
    "type": "Point",
    "coordinates": [-74.0721, 4.7110]
  },
  "establishmentType": "RESTAURANT",
  "userId": "uuid-usuario",
  "cityId": "uuid-ciudad",
  "city": {
    "cityId": "uuid",
    "name": "Bogotá",
    "department": {
      "name": "Cundinamarca"
    }
  },
  "foods": [
    {
      "foodId": "uuid",
      "name": "Bandeja paisa",
      "quantity": 10,
      "status": "AVAILABLE"
    }
  ],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

### 5. Actualizar Establecimiento

**`PUT /establishments/:id`** 🔒

Actualizar información del establecimiento (solo dueño).

**Body:** (todos opcionales)
```json
{
  "name": "Nuevo Nombre",
  "description": "Nueva descripción",
  "address": "Nueva dirección",
  "neighborhood": "Nuevo barrio",
  "location": {
    "type": "Point",
    "coordinates": [-74.0721, 4.7110]
  }
}
```

**Response (200):** Establecimiento actualizado

---

### 6. Eliminar Establecimiento

**`DELETE /establishments/:id`** 🔒

Eliminar establecimiento y todos sus alimentos (solo dueño).

**Response (200):**
```json
{
  "message": "Establishment deleted successfully"
}
```

---

### 7. Por Ciudad

**`GET /establishments/city/:cityId`**

Obtener establecimientos de una ciudad específica.

**Response (200):** Array de establecimientos

---

### 8. Por Departamento

**`GET /establishments/department/:departmentId`**

Obtener establecimientos de un departamento.

**Response (200):** Array de establecimientos

---

### 9. Por Barrio

**`GET /establishments/neighborhood/:neighborhood`**

Buscar establecimientos por barrio (case-insensitive).

**Response (200):** Array de establecimientos

---

## 📊 Tipos de Establecimientos

```
RESTAURANT, COFFEE_SHOP, BAR, NIGHTCLUB, BAKERY, SUPERMARKET,
GROCERY_STORE, FRUIT_SHOP, BUTCHER_SHOP, FOOD_TRUCK, HOTEL,
HOSTEL, MOTEL, APART_HOTEL, CLOTHING_STORE, SHOE_STORE,
JEWELRY_STORE, BOOKSTORE, STATIONERY_STORE, TOY_STORE,
ELECTRONICS_STORE, SPORTS_STORE, PHARMACY, HARDWARE_STORE,
PET_STORE, NURSERY, HAIR_SALON, BARBER_SHOP, BEAUTY_CENTER,
SPA, GYM, LAUNDRY, AUTO_REPAIR_SHOP, MEDICAL_OFFICE,
DENTAL_OFFICE, VETERINARY, CORPORATE_OFFICE, EDUCATIONAL_CENTER,
CINEMA, THEATER, MUSEUM, ART_GALLERY, EVENT_CENTER,
AMUSEMENT_PARK, BOWLING_ALLEY, SHOPPING_MALL, PARKING, OTHER
```

---

## 🔒 Permisos

| Endpoint | Autenticación | Rol |
|----------|--------------|-----|
| POST /establishments | ✅ | ESTABLISHMENT |
| GET /establishments | ❌ | Público |
| GET /establishments/available/food | ❌ | Público |
| GET /establishments/:id | ❌ | Público |
| PUT /establishments/:id | ✅ | ESTABLISHMENT (dueño) |
| DELETE /establishments/:id | ✅ | ESTABLISHMENT (dueño) |
| GET /establishments/city/:cityId | ❌ | Público |
| GET /establishments/department/:deptId | ❌ | Público |
| GET /establishments/neighborhood/:name | ❌ | Público |

---

## 🔗 Ver También

- [Foods Endpoints](./FOODS.md)
- [Cities Endpoints](./CITIES.md)
- [Departments Endpoints](./DEPARTMENTS.md)
