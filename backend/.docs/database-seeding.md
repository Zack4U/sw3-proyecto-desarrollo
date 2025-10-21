# Seeds de la Base de Datos

Este directorio contiene los archivos de seed para poblar la base de datos con datos de prueba.

## 📁 Estructura

```
prisma/
├── seed.ts                          # Archivo principal que orquesta todos los seeds
└── seeds/
    ├── department.seed.ts           # Seed de departamentos de Colombia
    ├── city.seed.ts                 # Seed de ciudades capitales
    ├── user.seed.ts                 # Seed de usuarios
    ├── establishment.seed.ts        # Seed de establecimientos
    ├── food.seed.ts                 # Seed de alimentos
    └── README.md                    # Esta documentación
```

## 🎯 Descripción de los Seeds

### Departamentos (`department.seed.ts`)
Crea **32 departamentos** de Colombia en orden alfabético:
- Amazonas, Antioquia, Arauca, Atlántico, Bolívar, Boyacá
- Caldas, Caquetá, Casanare, Cauca, Cesar, Chocó
- Córdoba, Cundinamarca, Guainía, Guaviare, Huila, La Guajira
- Magdalena, Meta, Nariño, Norte de Santander, Putumayo, Quindío
- Risaralda, San Andrés y Providencia, Santander, Sucre, Tolima
- Valle del Cauca, Vaupés, Vichada

Cada departamento incluye:
- ID único (UUID v4)
- Nombre del departamento
- Relación con sus ciudades capitales

### Ciudades (`city.seed.ts`)
Crea **32 ciudades capitales** de Colombia, una por cada departamento:
- Leticia (Amazonas), Medellín (Antioquia), Arauca (Arauca)
- Barranquilla (Atlántico), Cartagena (Bolívar), Tunja (Boyacá)
- Manizales (Caldas), Florencia (Caquetá), Yopal (Casanare)
- Popayán (Cauca), Valledupar (Cesar), Quibdó (Chocó)
- Montería (Córdoba), Bogotá D.C. (Cundinamarca), Inírida (Guainía)
- San José del Guaviare (Guaviare), Neiva (Huila), Riohacha (La Guajira)
- Santa Marta (Magdalena), Villavicencio (Meta), Pasto (Nariño)
- Cúcuta (Norte de Santander), Mocoa (Putumayo), Armenia (Quindío)
- Pereira (Risaralda), San Andrés (San Andrés y Providencia)
- Bucaramanga (Santander), Sincelejo (Sucre), Ibagué (Tolima)
- Cali (Valle del Cauca), Mitú (Vaupés), Puerto Carreño (Vichada)

Cada ciudad incluye:
- ID único (UUID v4)
- Nombre de la ciudad
- Relación con su departamento padre
- Relación con establecimientos ubicados en la ciudad

### Usuarios (`user.seed.ts`)
Crea usuarios de prueba para asociar con los establecimientos.

Cada usuario incluye:
- ID único (UUID v4)
- Información de perfil
- Credenciales de acceso
- Relación con establecimientos

### Establecimientos (`establishment.seed.ts`)
Crea **8 establecimientos** distribuidos en diferentes ciudades de Colombia:

**Medellín (Antioquia):**
- Panadería El Buen Pan (Laureles)
- Restaurante La Esquina (El Poblado)

**Bogotá D.C. (Cundinamarca):**
- Supermercado Fresh Market (Chapinero)
- Cafetería Aroma (Usaquén)

**Cali (Valle del Cauca):**
- Frutería Los Naranjos (San Fernando)
- Pastelería Dulce Encanto (Granada)

**Barranquilla (Atlántico):**
- Carnicería Don José (El Prado)
- Pizzería Bella Napoli (Riomar)

Cada establecimiento incluye:
- Nombre, descripción y tipo
- Información de contacto (teléfono, email)
- Dirección física normalizada
- Barrio o vecindario
- Ubicación geográfica (coordenadas GeoJSON Point)
- Relación con ciudad y departamento
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

- ✅ **32 departamentos** de Colombia (estructura administrativa completa)
- ✅ **32 ciudades capitales** (una por cada departamento)
- ✅ **Usuarios** de prueba para asociar con establecimientos
- ✅ **8 establecimientos** distribuidos en 4 ciudades principales (Medellín, Bogotá, Cali, Barranquilla)
- ✅ **50+ alimentos** con datos realistas y variados
- ✅ Relaciones completas: Departamentos → Ciudades → Establecimientos → Alimentos
- ✅ Diferentes estados de alimentos para probar filtros
- ✅ Fechas de expiración variadas
- ✅ Datos geográficos para probar búsquedas por ubicación, ciudad, departamento y barrio
- ✅ Información de barrios/vecindarios para búsquedas detalladas

## � Orden de Ejecución

Los seeds se ejecutan en el siguiente orden para mantener la integridad referencial:

1. **Departamentos** (`department.seed.ts`) - Base geográfica
2. **Ciudades** (`city.seed.ts`) - Depende de departamentos
3. **Usuarios** (`user.seed.ts`) - Independiente
4. **Establecimientos** (`establishment.seed.ts`) - Depende de ciudades y usuarios
5. **Alimentos** (`food.seed.ts`) - Depende de establecimientos

⚠️ **Importante:** No alterar este orden ya que hay dependencias entre las tablas.

## �🔧 Añadir nuevos seeds

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

3. Importa y ejecuta tu función en `seed.ts` **en el orden correcto**:

```typescript
import { seedMiEntidad } from './seeds/mi-entidad.seed';

async function main() {
  // ...
  await seedDepartments(prisma);
  await seedCities(prisma);
  await seedUsers(prisma);
  await seedMiEntidad(prisma);  // Colócalo según sus dependencias
  await seedEstablishments(prisma);
  await seedFoods(prisma);
  // ...
}
```

## ⚠️ Notas importantes

- Los seeds **eliminan todos los datos existentes** antes de insertar nuevos datos
- Los IDs están predefinidos (UUIDs v4) para mantener consistencia entre ejecuciones
- Las coordenadas están basadas en ubicaciones reales de Colombia:
  - Medellín: 6.2476° N, 75.5658° W
  - Bogotá: 4.7110° N, 74.0721° W
  - Cali: 3.4516° N, 76.5320° W
  - Barranquilla: 10.9639° N, 74.7964° W
- Los barrios/vecindarios son reales de cada ciudad
- Las URLs de imágenes apuntan a Unsplash (puedes reemplazarlas con tus propias imágenes)
- Los departamentos y ciudades corresponden a la división político-administrativa real de Colombia

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
