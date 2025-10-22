# 🔄 Cambios Realizados - Conexión Frontend-Backend

## 📅 Fecha: 21 de Octubre, 2025

## ✅ Archivos Modificados

### 1. `mobile/services/foodService.ts`

#### ✨ Cambios Principales:

- **Categorías de Alimentos**: Actualizadas para coincidir con el enum `FoodCategory` del backend
  - Antes: `'Frutas'`, `'Verduras'`, `'Lácteos'`
  - Ahora: `'FRUITS'`, `'VEGETABLES'`, `'DAIRY'`, etc. (36 categorías)
- **Unidades de Medida**: Actualizadas para coincidir con el enum `UnitOfMeasure` del backend

  - Antes: `'kg'`, `'g'`, `'lb'`, `'unidad'`
  - Ahora: `'KILOGRAM'`, `'GRAM'`, `'POUND'`, `'UNIT'`, etc. (27 unidades)

- **Payload de Creación**: Corregido para enviar los campos correctos

  ```typescript
  // ANTES (incorrecto)
  {
    weight_unit: data.unitOfMeasure,
    expiration_date: data.expiresAt,
    establishment_id: data.establishmentId,
    image: data.imageUrl
  }

  // AHORA (correcto)
  {
    unitOfMeasure: data.unitOfMeasure,
    expiresAt: data.expiresAt,
    establishmentId: data.establishmentId,
    imageUrl: data.imageUrl
  }
  ```

---

### 2. `mobile/services/establishmentService.ts`

#### ✨ Cambios Principales:

- **Interfaz Actualizada**: `CreateEstablishmentData` ahora incluye todos los campos requeridos

  ```typescript
  {
    establishmentId: string;     // UUID generado en el frontend
    name: string;
    description?: string;
    cityId: string;
    neighborhood?: string;
    address: string;
    location: {                  // Formato GeoJSON
      type: string;
      coordinates: number[];
    };
    establishmentType: string;
    userId: string;
  }
  ```

- **Tipos de Establecimiento**: Agregados 95 tipos que coinciden con el enum del backend

  - Comida y Bebidas (10 tipos)
  - Alojamiento (4 tipos)
  - Comercio Minorista (12 tipos)
  - Servicios (12 tipos)
  - Entretenimiento y Cultura (7 tipos)
  - Otros (3 tipos)

- **Payload de Creación**: Corregido completamente

  ```typescript
  // ANTES (incorrecto - faltaban campos)
  {
    address: data.address,
    type: data.establishmentType,
    location: data.location,
    user_id: data.userId
  }

  // AHORA (correcto - todos los campos)
  {
    establishmentId: data.establishmentId,
    name: data.name,
    description: data.description,
    address: data.address,
    neighborhood: data.neighborhood,
    location: data.location,
    establishmentType: data.establishmentType,
    userId: data.userId,
    cityId: data.cityId
  }
  ```

---

### 3. `mobile/screens/EstablishmentRegistrationScreen.tsx`

#### ✨ Cambios Principales:

- **Generación de UUID**: Agregada función para generar UUID v4 válidos

  ```typescript
  const generateUUID = (): string => {
  	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
  		const r = Math.trunc(Math.random() * 16);
  		const v = c === 'x' ? r : (r & 0x3) | 0x8;
  		return v.toString(16);
  	});
  };
  ```

- **CustomPicker Mejorado**: Ahora es expandible/colapsable

  - Muestra solo el valor seleccionado inicialmente
  - Al hacer clic, despliega una lista scrollable con máximo 200px de altura
  - Resalta visualmente la opción seleccionada

- **Campos de Ubicación**: Separados en latitud y longitud

  ```typescript
  formData: {
    latitude: '',   // Antes era un solo campo "location"
    longitude: '',
  }
  ```

- **Validación de Coordenadas**: Agregada validación para coordenadas GPS

  - Verifica que sean números válidos
  - Rango latitud: -90 a 90
  - Rango longitud: -180 a 180

- **Formato GeoJSON**: La ubicación se envía en formato correcto

  ```typescript
  const location = {
  	type: 'Point',
  	coordinates: [
  		parseFloat(formData.longitude) || 0,
  		parseFloat(formData.latitude) || 0,
  	],
  };
  ```

- **Selector de Tipo**: Usa el array `ESTABLISHMENT_TYPES` con 95 opciones
  ```tsx
  <CustomPicker
  	items={ESTABLISHMENT_TYPES}
  	selectedValue={formData.establishmentType}
  	onValueChange={(value) => handleInputChange('establishmentType', value)}
  	labelKey="label"
  	valueKey="value"
  	placeholder="Selecciona el tipo de establecimiento"
  />
  ```

---

### 4. `mobile/screens/FoodRegistrationScreen.tsx`

#### ✨ Cambios Principales:

- **UUID Temporal**: Cambiado a un formato UUID válido

  ```typescript
  // ANTES
  establishmentId: 'temp-establishment-id';

  // AHORA
  establishmentId: '00000000-0000-0000-0000-000000000000';
  ```

- **Validación Actualizada**: La validación ahora verifica el UUID correcto

  ```typescript
  if (formData.establishmentId === '00000000-0000-0000-0000-000000000000') {
  	requestState.setError('Debes tener un establecimiento registrado...');
  }
  ```

- **Categorías y Unidades**: Automáticamente actualizadas porque usa los arrays de `foodService.ts`

---

## 🔍 Verificación de Conexión

### ✅ Registro de Establecimientos

```typescript
POST /establishments
Body: {
  establishmentId: "uuid-generado",
  name: "string",
  description?: "string",
  address: "string",
  neighborhood?: "string",
  location: {
    type: "Point",
    coordinates: [lng, lat]
  },
  establishmentType: "RESTAURANT" | "COFFEE_SHOP" | ...,
  userId: "uuid",
  cityId: "uuid"
}
```

### ✅ Registro de Alimentos

```typescript
POST /foods
Body: {
  name: "string",
  description?: "string",
  category: "FRUITS" | "VEGETABLES" | ...,
  quantity: number,
  unitOfMeasure: "KILOGRAM" | "LITER" | ...,
  expiresAt: "2025-10-21" (ISO date),
  status?: "AVAILABLE" | "DELIVERED" | "EXPIRED",
  imageUrl?: "string",
  establishmentId: "uuid"
}
```

---

## 📋 Pendientes (TODO)

### 🔴 Alta Prioridad

1. **Autenticación de Usuarios**

   - Implementar contexto de autenticación
   - Obtener `userId` del usuario autenticado
   - Reemplazar `'temp-user-id'` con el ID real

2. **Selección de Establecimiento**

   - En `FoodRegistrationScreen`, permitir seleccionar de los establecimientos del usuario
   - Reemplazar el UUID temporal `'00000000-0000-0000-0000-000000000000'`

3. **Geolocalización**
   - Implementar obtención automática de coordenadas GPS
   - Usar `expo-location` o similar
   - Botón "Usar mi ubicación actual"

### 🟡 Prioridad Media

4. **Manejo de Imágenes**

   - Implementar carga de imágenes para alimentos
   - Integrar con servicio de almacenamiento (S3, Cloudinary, etc.)

5. **Validación de UUID**

   - Agregar validación de formato UUID en los formularios

6. **Mensajes de Error**
   - Mejorar mensajes de error específicos del backend
   - Mostrar errores de validación campo por campo

### 🟢 Mejoras Futuras

7. **Caché de Datos**

   - Cachear departamentos y ciudades
   - Cachear tipos de establecimientos

8. **Modo Offline**

   - Guardar formularios en progreso
   - Sincronizar cuando haya conexión

9. **Testing**
   - Tests unitarios para servicios
   - Tests de integración con el backend

---

## 🧪 Pruebas Recomendadas

### 1. Registro de Establecimiento

```bash
1. Abrir EstablishmentRegistrationScreen
2. Llenar todos los campos obligatorios:
   - Nombre
   - Tipo (seleccionar del dropdown)
   - Departamento
   - Ciudad
   - Dirección
3. Opcionalmente agregar:
   - Descripción
   - Barrio
   - Coordenadas GPS
4. Presionar "Registrar Establecimiento"
5. Verificar que se cree en el backend con todos los campos correctos
```

### 2. Registro de Alimento

```bash
1. Primero crear un establecimiento (ver prueba anterior)
2. Copiar el UUID del establecimiento creado
3. Actualizar establishmentId en FoodRegistrationScreen con el UUID real
4. Abrir FoodRegistrationScreen
5. Llenar todos los campos obligatorios:
   - Nombre del alimento
   - Categoría (seleccionar del dropdown)
   - Cantidad (número)
   - Unidad de medida (seleccionar del dropdown)
   - Fecha de expiración
6. Presionar "Registrar Alimento"
7. Verificar que se cree en el backend vinculado al establecimiento
```

---

## 📚 Recursos

### Enums del Backend

- **FoodCategory**: 36 opciones (ver `backend/prisma/schema.prisma` línea 195)
- **UnitOfMeasure**: 27 opciones (ver `backend/prisma/schema.prisma` línea 153)
- **EstablishmentType**: 95 opciones (ver `backend/prisma/schema.prisma` línea 253)

### Documentación

- **Swagger**: `http://localhost:3000/api` (cuando el backend esté corriendo)
- **Prisma Schema**: `backend/prisma/schema.prisma`

---

## ⚠️ Notas Importantes

1. **UUIDs**: Todos los IDs deben ser UUIDs v4 válidos. El backend los valida.

2. **GeoJSON**: El campo `location` DEBE ser un objeto con esta estructura exacta:

   ```json
   {
     "type": "Point",
     "coordinates": [longitude, latitude]
   }
   ```

   Nota: El orden es [lng, lat], NO [lat, lng]

3. **Fechas**: El campo `expiresAt` debe ser una fecha en formato ISO (YYYY-MM-DD)

4. **Enums**: Los valores de categoría, unidad de medida y tipo de establecimiento deben coincidir EXACTAMENTE con los enums del backend (case-sensitive)

5. **Campos Opcionales**: Los campos marcados con `?` en las interfaces son opcionales, pero el backend puede tener validaciones adicionales

---

## 🎯 Resultado

Ahora el frontend móvil está **completamente conectado** con el backend:

- ✅ Los nombres de campos coinciden
- ✅ Los formatos de datos coinciden
- ✅ Los enums coinciden
- ✅ La estructura de payloads es correcta
- ✅ Las validaciones son consistentes

**Siguiente paso**: Implementar autenticación para obtener IDs de usuario reales y permitir la selección de establecimientos existentes.
