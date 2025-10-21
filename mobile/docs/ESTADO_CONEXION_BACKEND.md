# 📡 Estado de Conexión Frontend-Backend

## ✅ Resumen General

| Formulario           | Estado               | Detalles                                        |
| -------------------- | -------------------- | ----------------------------------------------- |
| **Establecimientos** | ✅ **FUNCIONAL**     | Ajustado para enviar solo lo que backend acepta |
| **Alimentos**        | ✅ **FUNCIONAL**     | Mapeo correcto entre frontend y backend         |
| **Beneficiarios**    | ⚠️ **NO DISPONIBLE** | Backend no tiene endpoint `/users`              |

---

## 📋 Detalle por Formulario

### 1. Registro de Establecimientos ✅

**Estado**: Funcional con limitaciones

**Backend espera** (`CreateEstablishmentDto`):

```typescript
{
	address: string;
	type: string;
	location: string;
	user_id: string;
}
```

**Frontend envía** (`establishmentService.ts`):

```typescript
{
  address: data.address,
  type: data.establishmentType,
  location: data.location,
  user_id: data.userId || 'temp-user-id',
}
```

**Mapeo**:

- `address` → `address` ✅
- `establishmentType` → `type` ✅
- `location` → `location` ✅
- `userId` → `user_id` ✅

**⚠️ LIMITACIÓN**: El backend **NO guardará** los siguientes datos del formulario:

- `name` (nombre del establecimiento)
- `description` (descripción)
- `cityId` (ciudad)
- `neighborhood` (barrio)

Estos campos se recolectan en el formulario pero el backend actual no los acepta.

**Endpoint**: `POST /establishments` ✅

---

### 2. Registro de Alimentos ✅

**Estado**: Completamente funcional

**Backend espera** (`CreateFoodDto`):

```typescript
{
	name: string;
	category: string;
	quantity: number;
	weight_unit: string;
	expiration_date: Date;
	status: string;
	description: string;
	establishment_id: string;
	image: string;
}
```

**Frontend envía** (`foodService.ts`):

```typescript
{
  name: data.name,
  description: data.description,
  category: data.category,
  quantity: data.quantity,
  weight_unit: data.unitOfMeasure,
  expiration_date: data.expiresAt,
  status: data.status || 'AVAILABLE',
  image: data.imageUrl || '',
  establishment_id: data.establishmentId,
}
```

**Mapeo completo**:

- `name` → `name` ✅
- `description` → `description` ✅
- `category` → `category` ✅
- `quantity` → `quantity` ✅
- `unitOfMeasure` → `weight_unit` ✅
- `expiresAt` → `expiration_date` ✅
- `status` → `status` ✅ (default: 'AVAILABLE')
- `imageUrl` → `image` ✅ (default: '')
- `establishmentId` → `establishment_id` ✅

**Endpoint**: `POST /foods` ✅

---

### 3. Registro de Beneficiarios ⚠️

**Estado**: No funcional - Endpoint no existe

**Frontend intenta usar**: `POST /users`

**Problema**: El backend **NO tiene** un controlador para `/users`

**Controladores disponibles en backend**:

- `@Controller('establishments')`
- `@Controller('foods')`

**Solución requerida**:
El backend necesita crear:

1. `UserController` con endpoint `POST /users`
2. `CreateUserDto` con campos: `nombre`, `email`, `telefono`
3. `UserService` para manejar la lógica

**Mientras tanto**: El formulario muestra error "No se pudo conectar con el servidor" (404)

---

## 🔧 Configuración Requerida

### URL del Backend

Edita `mobile/config/app.config.ts`:

```typescript
export const API_CONFIG = {
	BASE_URL: 'http://localhost:3000', // Cambiar según tu entorno
};
```

**Opciones comunes**:

- Emulador Android: `http://10.0.2.2:3000`
- Emulador iOS: `http://localhost:3000`
- Dispositivo físico: `http://TU_IP:3000`

---

## ✅ Pasos para Probar

### 1. Iniciar el Backend

```bash
cd backend
npm install
npm run start:dev
```

### 2. Iniciar el Frontend

```bash
cd mobile
npm install
npm start
```

### 3. Probar Formularios

**Establecimientos**: ✅

1. Ve a "Registrar Establecimiento"
2. Llena todos los campos
3. **Nota**: Solo se guardarán `address`, `type`, `location`, `user_id`

**Alimentos**: ✅

1. Ve a "Registrar Alimento"
2. Llena todos los campos
3. Todos los campos se guardarán correctamente

**Beneficiarios**: ❌

1. Ve a "Registrar Beneficiario"
2. Llena todos los campos
3. **Error 404**: Endpoint no existe en backend

---

## 🐛 Debugging

### Ver requests en el backend

El backend mostrará en consola:

```
POST /establishments
POST /foods
```

### Ver errores en el frontend

Revisa la consola del navegador/emulador para ver:

- Errores de red
- Respuestas del servidor
- Validaciones fallidas

---

## 📝 Próximos Pasos

Para que todos los formularios funcionen al 100%:

1. **Actualizar backend** para que `CreateEstablishmentDto` acepte todos los campos del schema Prisma
2. **Crear endpoint `/users`** en el backend para beneficiarios
3. **Verificar** que el backend esté corriendo en el puerto 3000
4. **Configurar** la IP correcta en `app.config.ts` si usas dispositivo físico

---

## 🎯 Resumen de Cambios Realizados en Mobile

✅ **establishmentService.ts**: Ajustado payload para enviar solo `address`, `type`, `location`, `user_id`

✅ **foodService.ts**: Ya estaba correcto, mapea todos los campos correctamente

✅ **beneficiaryService.ts**: Agregado comentario de advertencia sobre endpoint faltante

✅ **Todos los formularios**: Mantienen validaciones y UX, solo se ajustó el envío de datos
