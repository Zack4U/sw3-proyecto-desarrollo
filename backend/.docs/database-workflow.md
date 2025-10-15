# 🔄 Flujo de Actualización de Base de Datos con Prisma

## Escenarios Comunes

### Escenario 1: Agregar un nuevo campo a una tabla existente

**Ejemplo: Agregar campo `phone` a la tabla Establishment**

#### 1. Modificar el schema.prisma
```prisma
model Establishment {
    establishment_id   String   @id @db.Uuid
    address            String
    location           Json
    establishment_type String?
    phone              String?  // ← NUEVO CAMPO
    createdAt          DateTime @default(now())
    updatedAt          DateTime @updatedAt
    
    user_id String @db.Uuid
    foods   Food[]
}
```

#### 2. Aplicar los cambios

**Opción A: Desarrollo rápido (sin migración)**
```bash
npx prisma db push
npx prisma generate
```

**Opción B: Con migración (recomendado para producción)**
```bash
npx prisma migrate dev --name add_phone_to_establishment
npx prisma generate
```

---

### Escenario 2: Crear una nueva tabla

**Ejemplo: Agregar tabla `Reservation`**

#### 1. Agregar modelo en schema.prisma
```prisma
model Reservation {
    reservation_id String   @id @default(uuid()) @db.Uuid
    user_id        String   @db.Uuid
    food_id        String   @db.Uuid
    quantity       Float
    status         ReservationStatus @default(PENDING)
    createdAt      DateTime @default(now())
    updatedAt      DateTime @updatedAt
    
    // Relación con Food
    food Food @relation(fields: [food_id], references: [food_id], onDelete: Cascade)
}

enum ReservationStatus {
    PENDING
    CONFIRMED
    CANCELLED
    COMPLETED
}
```

#### 2. Actualizar modelo relacionado (Food)
```prisma
model Food {
    food_id       String     @id @default(uuid()) @db.Uuid
    name          String
    // ... otros campos
    
    establishment    Establishment @relation(fields: [establishment_id], references: [establishment_id])
    establishment_id String        @db.Uuid
    
    // Nueva relación
    reservations Reservation[] // ← AGREGAR ESTO
}
```

#### 3. Aplicar cambios
```bash
npx prisma migrate dev --name add_reservation_table
npx prisma generate
```

---

### Escenario 3: Modificar un campo existente

**Ejemplo: Cambiar `quantity` de Float a Int**

#### 1. Modificar schema.prisma
```prisma
model Food {
    quantity Int  // Cambió de Float a Int
}
```

#### 2. Aplicar cambios (Prisma detectará el cambio de tipo)
```bash
npx prisma migrate dev --name change_quantity_to_int
```

⚠️ **Advertencia**: Cambios de tipo pueden causar pérdida de datos. Prisma te advertirá.

---

### Escenario 4: Renombrar un campo

**Ejemplo: Renombrar `establishment_type` a `type`**

#### 1. Modificar schema.prisma con mapeo
```prisma
model Establishment {
    type String? @map("establishment_type") // Mapea al nombre anterior
}
```

**O sin mapeo (renombrar la columna)**:
```prisma
model Establishment {
    type String? // Prisma detectará que es un renombre
}
```

#### 2. Aplicar cambios
```bash
npx prisma migrate dev --name rename_establishment_type_to_type
```

Prisma preguntará: **"¿Es esto un renombre?"** - Responde `y` (yes)

---

### Escenario 5: Eliminar un campo

**Ejemplo: Eliminar campo `imageUrl` de Food**

#### 1. Eliminar del schema.prisma
```prisma
model Food {
    food_id       String     @id @default(uuid()) @db.Uuid
    name          String
    // imageUrl eliminado ❌
}
```

#### 2. Aplicar cambios
```bash
npx prisma migrate dev --name remove_image_url_from_food
```

⚠️ **Advertencia**: Esto eliminará la columna y todos sus datos.

---

### Escenario 6: Agregar índices para optimizar consultas

**Ejemplo: Índice en `status` de Food**

#### 1. Agregar índices en schema.prisma
```prisma
model Food {
    food_id       String     @id @default(uuid()) @db.Uuid
    name          String
    status        FoodStatus @default(AVAILABLE)
    
    @@index([status]) // Índice simple
    @@index([status, expiresAt]) // Índice compuesto
}
```

#### 2. Aplicar cambios
```bash
npx prisma migrate dev --name add_indexes_to_food
```

---

## 📊 Comparación de Comandos

| Comando | Cuándo usar | Crea migraciones | Historial | Producción |
|---------|-------------|------------------|-----------|------------|
| `prisma db push` | Desarrollo rápido | ❌ No | ❌ No | ❌ No |
| `prisma migrate dev` | Desarrollo normal | ✅ Sí | ✅ Sí | ✅ Sí (con deploy) |
| `prisma migrate deploy` | Producción | ❌ No (usa existentes) | ✅ Sí | ✅ Sí |
| `prisma migrate reset` | Resetear DB | ❌ Borra todo | ✅ Sí | ❌ NUNCA |

---

## 🔧 Comandos Útiles

### Ver estado de migraciones
```bash
npx prisma migrate status
```

### Ver diferencias antes de aplicar
```bash
npx prisma migrate diff \
  --from-schema-datamodel prisma/schema.prisma \
  --to-schema-datasource prisma/schema.prisma
```

### Generar migración sin aplicarla
```bash
npx prisma migrate dev --create-only --name my_migration
```

### Aplicar migraciones pendientes
```bash
npx prisma migrate deploy
```

### Resetear base de datos (⚠️ PELIGROSO)
```bash
npx prisma migrate reset --force
```

### Ver datos en interfaz visual
```bash
npx prisma studio
```

---

## 🎯 Flujo Recomendado para tu Proyecto

### Durante Desarrollo (Feature Branch)

```bash
# 1. Modificas schema.prisma
# 2. Creas migración
npx prisma migrate dev --name descriptive_name

# 3. Generas cliente (automático con migrate dev, pero por si acaso)
npx prisma generate

# 4. Pruebas tus cambios
npm run start:dev

# 5. Commit de cambios (schema.prisma + carpeta migrations)
git add prisma/schema.prisma prisma/migrations
git commit -m "feat: add new field to model"
```

### Al Mergear a Main/Producción

```bash
# 1. Pull de cambios
git pull origin main

# 2. Aplicar migraciones pendientes
npx prisma migrate deploy

# 3. Regenerar cliente
npx prisma generate

# 4. Reiniciar aplicación
npm run start:prod
```

---

## 🚨 Problemas Comunes y Soluciones

### Error: "Migration already exists"
```bash
# Solución: Aplicar migraciones pendientes
npx prisma migrate deploy
```

### Error: "Schema drift detected"
```bash
# Solución 1: Ver diferencias
npx prisma migrate status

# Solución 2: Crear migración para resolver drift
npx prisma migrate dev --name resolve_drift
```

### Error: "Database is not in sync"
```bash
# Desarrollo: Resetear (⚠️ PIERDE DATOS)
npx prisma migrate reset

# Producción: Aplicar migraciones
npx prisma migrate deploy
```

### Error: Cambio destructivo detectado
Prisma detectará cambios que pueden causar pérdida de datos:
- Eliminar campos
- Cambiar tipos incompatibles
- Hacer campos requeridos que eran opcionales

**Solución**:
1. Prisma te preguntará si deseas continuar
2. Responde `y` si estás seguro
3. O cancela y ajusta tu schema

---

## 📚 Mejores Prácticas

### ✅ DO (Hacer)
- Usar `migrate dev` en desarrollo
- Usar `migrate deploy` en producción
- Hacer commits de las migraciones
- Nombres descriptivos para migraciones
- Revisar SQL generado antes de aplicar
- Hacer backups antes de cambios grandes

### ❌ DON'T (No hacer)
- No uses `db push` en producción
- No edites migraciones ya aplicadas
- No hagas `migrate reset` en producción
- No ignores warnings de Prisma
- No commitees solo schema.prisma sin las migraciones

---

## 🔍 Ejemplo Completo de Flujo

```bash
# PASO 1: Estado inicial
# Tienes: Establishment y Food

# PASO 2: Decides agregar tabla User y campo email en Establishment
# Editas schema.prisma:

model Establishment {
    establishment_id   String   @id @db.Uuid
    address            String
    location           Json
    establishment_type String?
    email              String?  // ← NUEVO
    createdAt          DateTime @default(now())
    updatedAt          DateTime @updatedAt
    
    user_id String @db.Uuid
    foods   Food[]
}

model User {  // ← NUEVO MODELO
    user_id   String   @id @default(uuid()) @db.Uuid
    name      String
    email     String   @unique
    createdAt DateTime @default(now())
}

# PASO 3: Crear migración
npx prisma migrate dev --name add_user_table_and_email_field
# Prisma generará SQL y aplicará cambios

# PASO 4: Verificar migración
ls prisma/migrations/
# Verás: 20241015_add_user_table_and_email_field/migration.sql

# PASO 5: Generar cliente (ya se hizo automáticamente)
npx prisma generate

# PASO 6: Usar en tu código
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const user = await prisma.user.create({
  data: {
    name: 'John',
    email: 'john@example.com'
  }
});

# PASO 7: Commit cambios
git add prisma/schema.prisma prisma/migrations
git commit -m "feat: add User model and email to Establishment"
```

---

## 🎓 Recursos Adicionales

- [Prisma Migrate Docs](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Migration Workflows](https://www.prisma.io/docs/guides/migrate/developing-with-prisma-migrate)
