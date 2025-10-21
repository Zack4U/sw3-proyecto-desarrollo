# 🚀 Guía Rápida: Actualizar Base de Datos con Prisma

## 📋 TL;DR - Resumen Ejecutivo

```bash
# ✅ DESARROLLO (Feature Branch)
1. Editar prisma/schema.prisma
2. npm run prisma:reset
3. npm run prisma:push
4. Probar cambios
5. git commit prisma/

# ✅ PRODUCCIÓN (Deploy)
1. git pull origin main
2. npx prisma migrate deploy
3. npx prisma generate
4. Reiniciar app
```

---

## 🔄 Dos Enfoques Principales

### 1️⃣ `prisma db push` - Desarrollo Rápido ⚡

```
┌─────────────────────┐
│ Editar schema.prisma│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ npx prisma db push  │ ← Sincroniza directamente (NO crea migraciones)
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ npm prisma generate │
└─────────────────────┘
```

**✅ Ventajas:**
- Súper rápido
- Ideal para prototipos
- No genera archivos de migración

**❌ Desventajas:**
- Sin historial de cambios
- No recomendado para producción
- No puedes revertir cambios

---

### 2️⃣ `prisma migrate dev` - Desarrollo Profesional ⭐ (RECOMENDADO)

```
┌─────────────────────────┐
│ Editar schema.prisma    │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ npx prisma migrate dev  │ ← Crea archivo de migración + aplica
│ --name add_phone_field  │
└───────────┬─────────────┘
            │
            ├──> Genera: prisma/migrations/20241015_add_phone_field/migration.sql
            │
            ▼
┌─────────────────────────┐
│ npx prisma generate     │ ← Actualiza Prisma Client
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ git add prisma/         │
│ git commit              │
└─────────────────────────┘
```

**✅ Ventajas:**
- Historial completo de cambios
- Migraciones versionadas
- Apto para producción
- Puede revertirse
- Control total

**❌ Desventajas:**
- Más archivos para gestionar

---

## 📝 Ejemplos Prácticos

### Ejemplo 1: Agregar un campo nuevo

**Antes:**
```prisma
model Food {
    food_id    String @id @default(uuid()) @db.Uuid
    name       String
    quantity   Float
}
```

**Después:**
```prisma
model Food {
    food_id    String @id @default(uuid()) @db.Uuid
    name       String
    quantity   Float
    price      Float? // ← NUEVO CAMPO
}
```

**Comandos:**
```bash
npx prisma migrate dev --name add_price_to_food
# ✅ Prisma genera y aplica la migración automáticamente
```

---

### Ejemplo 2: Agregar una tabla nueva

**Agregar al schema.prisma:**
```prisma
model Review {
    review_id      String   @id @default(uuid()) @db.Uuid
    rating         Int
    comment        String?
    food_id        String   @db.Uuid
    user_id        String   @db.Uuid
    createdAt      DateTime @default(now())
    
    food Food @relation(fields: [food_id], references: [food_id], onDelete: Cascade)
}
```

**Actualizar Food para la relación:**
```prisma
model Food {
    // ... campos existentes
    reviews Review[] // ← Agregar relación
}
```

**Comandos:**
```bash
npx prisma migrate dev --name add_review_table
```

---

### Ejemplo 3: Modificar un campo

**Cambiar tipo de dato:**
```prisma
model Food {
    quantity Int  // Antes: Float, Ahora: Int
}
```

**Comandos:**
```bash
npx prisma migrate dev --name change_quantity_type
# ⚠️ Prisma advertirá sobre posible pérdida de datos
```

---

### Ejemplo 4: Eliminar un campo

**Antes:**
```prisma
model Food {
    food_id    String @id
    name       String
    imageUrl   String? // ← Eliminar esto
}
```

**Después:**
```prisma
model Food {
    food_id    String @id
    name       String
    // imageUrl eliminado
}
```

**Comandos:**
```bash
npx prisma migrate dev --name remove_image_url
# ⚠️ Esto eliminará la columna y sus datos
```

---

## 🛠️ Comandos Esenciales

| Comando | Propósito | Cuándo usar |
|---------|-----------|-------------|
| `npx prisma migrate dev --name xxx` | Crear y aplicar migración | Desarrollo |
| `npx prisma migrate deploy` | Aplicar migraciones pendientes | Producción |
| `npx prisma db push` | Sincronizar sin migración | Prototipado rápido |
| `npx prisma generate` | Actualizar Prisma Client | Después de cambios |
| `npx prisma migrate status` | Ver estado de migraciones | Diagnóstico |
| `npx prisma migrate reset` | ⚠️ RESETEAR base de datos | Solo desarrollo |
| `npx prisma studio` | Ver/editar datos visualmente | Desarrollo/Debug |

---

## 🎯 Flujo Diario de Trabajo

### Durante Desarrollo

```bash
# 1. Crear feature branch
git checkout -b feature/add-reviews

# 2. Modificar schema.prisma
# (agregar modelo Review)

# 3. Crear migración
npx prisma migrate dev --name add_review_model

# 4. Prisma automáticamente:
#    - Genera SQL
#    - Aplica cambios a DB
#    - Actualiza Prisma Client

# 5. Desarrollar feature
# Usar el nuevo modelo en tu código

# 6. Probar
npm run test
npm run start:dev

# 7. Commit (incluye schema + migrations)
git add prisma/
git commit -m "feat: add Review model"
git push origin feature/add-reviews

# 8. Crear Pull Request
```

### Al Mergear a Main

```bash
# 1. Otro desarrollador hace pull
git checkout main
git pull origin main

# 2. Aplicar nuevas migraciones
npx prisma migrate deploy

# 3. Regenerar cliente
npx prisma generate

# 4. Reiniciar app
npm run start:dev
```

---

## ⚠️ Problemas Comunes

### "Schema drift detected"

```bash
# Ver qué está mal sincronizado
npx prisma migrate status

# Opción 1: Crear migración para resolver
npx prisma migrate dev --name resolve_drift

# Opción 2: Resetear (⚠️ PIERDE DATOS)
npx prisma migrate reset
```

### "Migration already applied"

```bash
# Solo aplicar pendientes
npx prisma migrate deploy
```

### Cambios destructivos

Prisma detecta:
- ❌ Eliminar columnas
- ❌ Cambiar tipos incompatibles
- ❌ Hacer campos required

**Solución:** Prisma preguntará confirmación, responde `y` si estás seguro.

---

## 📚 Mejores Prácticas

### ✅ SÍ Hacer

- ✅ Usar `migrate dev` en desarrollo
- ✅ Usar `migrate deploy` en producción
- ✅ Commitear schema.prisma + carpeta migrations juntos
- ✅ Nombres descriptivos: `add_user_phone`, `remove_old_field`
- ✅ Revisar SQL generado antes de aplicar
- ✅ Hacer backups antes de cambios grandes

### ❌ NO Hacer

- ❌ `db push` en producción
- ❌ Editar migraciones ya aplicadas
- ❌ `migrate reset` en producción
- ❌ Ignorar warnings
- ❌ Commitear solo schema.prisma sin migrations

---

## 🎓 Recursos

- [Documentación oficial de Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- Ver: `backend/docs/database-workflow.md` para guía extendida
