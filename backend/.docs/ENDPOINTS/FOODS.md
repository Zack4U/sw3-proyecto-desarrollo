# 🍽️ Foods Endpoints

Base URL: `/foods`

Documentación de endpoints para gestión de alimentos.

---

## 📋 Índice

- [Crear Alimento](#crear-alimento)
- [Listar Alimentos](#listar-alimentos)
- [Obtener Alimento](#obtener-alimento)
- [Actualizar Alimento](#actualizar-alimento)
- [Eliminar Alimento](#eliminar-alimento)
- [Búsquedas y Filtros](#búsquedas-y-filtros)

---

## 🆕 Crear Alimento

Registrar un nuevo alimento disponible.

**Endpoint:** `POST /foods`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Pan integral",
  "description": "Pan integral recién horneado",
  "category": "BAKERY",
  "quantity": 20,
  "unitOfMeasure": "UNIT",
  "status": "AVAILABLE",
  "imageUrl": "https://example.com/image.jpg",
  "expiresAt": "2024-12-31",
  "establishmentId": "uuid-establecimiento"
}
```

**Campos:**
- `name` (string, requerido): Nombre del alimento
- `description` (string, opcional): Descripción detallada
- `category` (enum, requerido): Categoría del alimento
- `quantity` (number, requerido): Cantidad disponible
- `unitOfMeasure` (enum, requerido): Unidad de medida
- `status` (enum, opcional): Estado (default: AVAILABLE)
- `imageUrl` (string, opcional): URL de la imagen
- `expiresAt` (date, requerido): Fecha de vencimiento
- `establishmentId` (uuid, requerido): ID del establecimiento

**Response (201):**
```json
{
  "foodId": "uuid",
  "name": "Pan integral",
  "description": "Pan integral recién horneado",
  "category": "BAKERY",
  "quantity": 20,
  "unitOfMeasure": "UNIT",
  "status": "AVAILABLE",
  "imageUrl": "https://example.com/image.jpg",
  "expiresAt": "2024-12-31T00:00:00.000Z",
  "establishmentId": "uuid-establecimiento",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Errores:**
- `400` - Datos inválidos
- `401` - No autenticado
- `403` - No tiene permisos (solo ESTABLISHMENT)
- `404` - Establecimiento no encontrado

---

## 📜 Listar Alimentos

Obtener todos los alimentos registrados.

**Endpoint:** `GET /foods`

**Response (200):**
```json
[
  {
    "foodId": "uuid-1",
    "name": "Pan integral",
    "category": "BAKERY",
    "quantity": 20,
    "unitOfMeasure": "UNIT",
    "status": "AVAILABLE",
    "expiresAt": "2024-12-31T00:00:00.000Z",
    "establishmentId": "uuid-establecimiento",
    "establishment": {
      "name": "Panadería Central",
      "address": "Calle 123"
    }
  },
  {
    "foodId": "uuid-2",
    "name": "Frutas varias",
    "category": "FRUITS",
    "quantity": 10,
    "unitOfMeasure": "KILOGRAM",
    "status": "AVAILABLE",
    "expiresAt": "2024-01-20T00:00:00.000Z",
    "establishmentId": "uuid-establecimiento-2",
    "establishment": {
      "name": "Supermercado Norte",
      "address": "Av. Principal"
    }
  }
]
```

---

## 🔍 Obtener Alimento

Obtener información detallada de un alimento específico.

**Endpoint:** `GET /foods/:id`

**Parámetros:**
- `id` (uuid): ID del alimento

**Response (200):**
```json
{
  "foodId": "uuid",
  "name": "Pan integral",
  "description": "Pan integral recién horneado",
  "category": "BAKERY",
  "quantity": 20,
  "unitOfMeasure": "UNIT",
  "status": "AVAILABLE",
  "imageUrl": "https://example.com/image.jpg",
  "expiresAt": "2024-12-31T00:00:00.000Z",
  "establishmentId": "uuid-establecimiento",
  "establishment": {
    "establishmentId": "uuid-establecimiento",
    "name": "Panadería Central",
    "address": "Calle 123 #45-67",
    "neighborhood": "Centro",
    "establishmentType": "BAKERY",
    "location": {
      "type": "Point",
      "coordinates": [-74.0721, 4.7110]
    },
    "cityId": "uuid-ciudad",
    "city": {
      "name": "Bogotá"
    }
  },
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Errores:**
- `404` - Alimento no encontrado

---

## ✏️ Actualizar Alimento

Actualizar información de un alimento existente.

**Endpoint:** `PUT /foods/:id`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
- `id` (uuid): ID del alimento

**Body:** (todos los campos son opcionales)
```json
{
  "name": "Pan integral orgánico",
  "description": "Actualizado",
  "quantity": 15,
  "status": "AVAILABLE",
  "imageUrl": "https://example.com/new-image.jpg"
}
```

**Response (200):**
```json
{
  "foodId": "uuid",
  "name": "Pan integral orgánico",
  "description": "Actualizado",
  "category": "BAKERY",
  "quantity": 15,
  "unitOfMeasure": "UNIT",
  "status": "AVAILABLE",
  "imageUrl": "https://example.com/new-image.jpg",
  "expiresAt": "2024-12-31T00:00:00.000Z",
  "establishmentId": "uuid-establecimiento",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-16T14:20:00.000Z"
}
```

**Errores:**
- `400` - Datos inválidos
- `401` - No autenticado
- `403` - No es el dueño del alimento
- `404` - Alimento no encontrado

---

## 🗑️ Eliminar Alimento

Eliminar un alimento del sistema.

**Endpoint:** `DELETE /foods/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Parámetros:**
- `id` (uuid): ID del alimento

**Response (200):**
```json
{
  "message": "Food deleted successfully",
  "foodId": "uuid"
}
```

**Errores:**
- `401` - No autenticado
- `403` - No es el dueño del alimento
- `404` - Alimento no encontrado

---

## 🔍 Búsquedas y Filtros

### 1. Alimentos por Establecimiento

Obtener todos los alimentos de un establecimiento específico.

**Endpoint:** `GET /foods/establishment/:establishmentId`

**Parámetros:**
- `establishmentId` (uuid): ID del establecimiento

**Response (200):**
```json
[
  {
    "foodId": "uuid-1",
    "name": "Pan integral",
    "category": "BAKERY",
    "quantity": 20,
    "status": "AVAILABLE",
    "expiresAt": "2024-12-31T00:00:00.000Z"
  },
  {
    "foodId": "uuid-2",
    "name": "Pan francés",
    "category": "BAKERY",
    "quantity": 30,
    "status": "AVAILABLE",
    "expiresAt": "2024-12-25T00:00:00.000Z"
  }
]
```

---

### 2. Alimentos por Categoría

Filtrar alimentos por categoría.

**Endpoint:** `GET /foods/category/:category`

**Parámetros:**
- `category` (enum): Categoría del alimento

**Categorías disponibles:**
- `FRUITS`, `VEGETABLES`, `GREENS`, `LEGUMES`, `TUBERS`
- `RED_MEAT`, `POULTRY`, `FISH`, `SEAFOOD`, `COLD_CUTS`
- `DAIRY`, `CHEESE`, `YOGURT`, `EGGS`
- `CEREALS`, `GRAINS`, `PASTA`, `BAKERY`, `FLOUR`
- `CANNED`, `PRESERVES`, `SAUCES_AND_CONDIMENTS`, `OILS_AND_VINEGARS`
- `SPICES_AND_HERBS`, `SOUPS_AND_CREAMS`
- `SALTY_SNACKS`, `SWEETS_AND_CHOCOLATES`, `COOKIES_AND_DESSERTS`, `NUTS`
- `NON_ALCOHOLIC_BEVERAGES`, `JUICES`, `COFFEE_AND_TEA`, `ALCOHOLIC_BEVERAGES`
- `FROZEN`, `PREPARED_FOOD`, `OTHERS`

**Ejemplo:** `GET /foods/category/BAKERY`

**Response (200):**
```json
[
  {
    "foodId": "uuid-1",
    "name": "Pan integral",
    "category": "BAKERY",
    "quantity": 20,
    "establishmentId": "uuid-1",
    "establishment": {
      "name": "Panadería Central"
    }
  },
  {
    "foodId": "uuid-2",
    "name": "Croissant",
    "category": "BAKERY",
    "quantity": 15,
    "establishmentId": "uuid-2",
    "establishment": {
      "name": "Panadería Francia"
    }
  }
]
```

---

### 3. Buscar por Nombre

Buscar alimentos por nombre (búsqueda parcial, case-insensitive).

**Endpoint:** `GET /foods/name/:name`

**Parámetros:**
- `name` (string): Texto a buscar en el nombre

**Ejemplo:** `GET /foods/name/pan`

**Response (200):**
```json
[
  {
    "foodId": "uuid-1",
    "name": "Pan integral",
    "category": "BAKERY"
  },
  {
    "foodId": "uuid-2",
    "name": "Pan francés",
    "category": "BAKERY"
  },
  {
    "foodId": "uuid-3",
    "name": "Empanadas",
    "category": "PREPARED_FOOD"
  }
]
```

---

## 📊 Enums

### FoodCategory
```
FRUITS, VEGETABLES, GREENS, LEGUMES, TUBERS, RED_MEAT, POULTRY, 
FISH, SEAFOOD, COLD_CUTS, DAIRY, CHEESE, YOGURT, EGGS, CEREALS, 
GRAINS, PASTA, BAKERY, FLOUR, CANNED, PRESERVES, 
SAUCES_AND_CONDIMENTS, OILS_AND_VINEGARS, SPICES_AND_HERBS, 
SOUPS_AND_CREAMS, SALTY_SNACKS, SWEETS_AND_CHOCOLATES, 
COOKIES_AND_DESSERTS, NUTS, NON_ALCOHOLIC_BEVERAGES, JUICES, 
COFFEE_AND_TEA, ALCOHOLIC_BEVERAGES, FROZEN, PREPARED_FOOD, OTHERS
```

### UnitOfMeasure
```
UNIT, DOZEN, PACKAGE, BOX, CAN, BOTTLE, BAG, ROLL, JAR, TUBE,
GRAM, KILOGRAM, MILLIGRAM, LITER, MILLILITER, CUBIC_CENTIMETER,
OUNCE, POUND, FLUID_OUNCE, PINT, QUART, GALLON,
TEASPOON, TABLESPOON, CUP, PINCH, CLOVE, BRANCH
```

### FoodStatus
```
AVAILABLE, DELIVERED, EXPIRED
```

---

## 🔒 Permisos

| Endpoint | Autenticación | Rol Requerido |
|----------|--------------|---------------|
| POST /foods | ✅ | ESTABLISHMENT |
| GET /foods | ❌ | Público |
| GET /foods/:id | ❌ | Público |
| GET /foods/establishment/:id | ❌ | Público |
| GET /foods/category/:category | ❌ | Público |
| GET /foods/name/:name | ❌ | Público |
| PUT /foods/:id | ✅ | ESTABLISHMENT (dueño) |
| DELETE /foods/:id | ✅ | ESTABLISHMENT (dueño) |

---

## 🐛 Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Datos inválidos o campos requeridos faltantes |
| 401 | No autenticado |
| 403 | No tiene permisos o no es el dueño |
| 404 | Alimento o establecimiento no encontrado |
| 500 | Error interno del servidor |

---

## 📝 Notas

- Los alimentos con estado `EXPIRED` no aparecen en búsquedas públicas
- La cantidad debe ser mayor a 0
- La fecha de vencimiento debe ser futura
- Solo el establecimiento dueño puede modificar/eliminar sus alimentos
- Las imágenes deben ser URLs válidas (http/https)

---

## 🔗 Ver También

- [Establishments Endpoints](./ESTABLISHMENTS.md)
- [Database Schema](../database-quick-guide.md)
- [Swagger Documentation](http://localhost:3000/api)
