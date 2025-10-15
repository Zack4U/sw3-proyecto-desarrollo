# Seeds de la Base de Datos

Este directorio contiene los archivos de seed para poblar la base de datos con datos de prueba.

## 📁 Estructura

```
prisma/
├── seed.ts                          # Archivo principal que orquesta todos los seeds
└── seeds/
    ├── establishment.seed.ts        # Seed de establecimientos
    └── food.seed.ts                 # Seed de alimentos
```

## 🎯 Descripción de los Seeds

### Establecimientos (`establishment.seed.ts`)
Crea **8 establecimientos** de diferentes tipos:
- Panadería El Buen Pan
- Restaurante La Esquina
- Supermercado Fresh Market
- Cafetería Aroma
- Frutería Los Naranjos
- Carnicería Don José
- Pizzería Bella Napoli
- Pastelería Dulce Encanto

Cada establecimiento incluye:
- Nombre, descripción y tipo
- Información de contacto (teléfono, email)
- Dirección física
- Ubicación geográfica (coordenadas)
- ID de usuario asociado

### Alimentos (`food.seed.ts`)
Crea **50+ alimentos** distribuidos entre los establecimientos con:
- Diferentes categorías (Panadería, Frutas, Verduras, Lácteos, Carnes, etc.)
- Diferentes estados (AVAILABLE, RESERVED, DELIVERED, EXPIRED)
- Cantidades y unidades de medida variadas
- Fechas de expiración realistas
- URLs de imágenes de Unsplash
- Relaciones con sus establecimientos

## 🚀 Cómo ejecutar los seeds

### Opción 1: Usando npm scripts (Recomendado)

Primero, asegúrate de tener configurado el script en tu `package.json`:

```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

Luego ejecuta:

```bash
# Ejecutar seeds
npm run seed

# O con npx
npx prisma db seed
```

### Opción 2: Ejecutar directamente con ts-node

```bash
# Desde el directorio backend
npx ts-node prisma/seed.ts
```

### Opción 3: Como parte de la migración

```bash
# Resetear la base de datos y ejecutar seeds automáticamente
npx prisma migrate reset

# Esto ejecutará:
# 1. Eliminar la base de datos
# 2. Crear la base de datos
# 3. Aplicar migraciones
# 4. Ejecutar seeds
```

## 📊 Datos generados

Después de ejecutar los seeds tendrás:

- ✅ **8 establecimientos** con diferentes tipos de negocio
- ✅ **50+ alimentos** con datos realistas y variados
- ✅ Relaciones completas entre establecimientos y alimentos
- ✅ Diferentes estados de alimentos para probar filtros
- ✅ Fechas de expiración variadas
- ✅ Datos geográficos para probar búsquedas por ubicación

## 🔧 Añadir nuevos seeds

Para agregar un nuevo seed:

1. Crea un nuevo archivo en `prisma/seeds/` con el patrón `<entidad>.seed.ts`
2. Exporta una función async que reciba el cliente de Prisma:

```typescript
import { PrismaClient } from '@prisma/client';

export async function seedMiEntidad(prisma: PrismaClient) {
  console.log('🔨 Creando mi entidad...');
  
  // Tu lógica de seed aquí
  
  console.log('   ✅ Entidades creadas');
}
```

3. Importa y ejecuta tu función en `seed.ts`:

```typescript
import { seedMiEntidad } from './seeds/mi-entidad.seed';

async function main() {
  // ...
  await seedMiEntidad(prisma);
  // ...
}
```

## ⚠️ Notas importantes

- Los seeds **eliminan todos los datos existentes** antes de insertar nuevos datos
- Los IDs de los establecimientos están predefinidos para mantener consistencia
- Las coordenadas están basadas en ubicaciones reales de Madrid, España
- Los user_id son UUIDs de ejemplo y deberán coincidir con usuarios reales en producción
- Las URLs de imágenes apuntan a Unsplash (puedes reemplazarlas con tus propias imágenes)

## 🐛 Solución de problemas

### Error: "Can't reach database server"
- Verifica que tu base de datos esté ejecutándose
- Revisa la variable `DATABASE_URL` en tu archivo `.env`

### Error: "Invalid `prisma.xxx.create()` invocation"
- Asegúrate de haber ejecutado `npx prisma generate`
- Verifica que el schema de Prisma esté sincronizado con tu base de datos

### Error: "Foreign key constraint failed"
- Asegúrate de ejecutar los seeds en el orden correcto (establecimientos antes que alimentos)
- El archivo principal `seed.ts` ya maneja esto automáticamente

## 📝 Ejemplo de uso

```bash
# 1. Asegúrate de que la base de datos esté corriendo
npm run db:start  # o tu comando para iniciar la BD

# 2. Aplica las migraciones
npx prisma migrate dev

# 3. Ejecuta los seeds
npx prisma db seed

# 4. (Opcional) Verifica los datos con Prisma Studio
npx prisma studio
```
