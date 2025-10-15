# ⚡ Setup en 5 Minutos

Una guía ultra-rápida para levantar el proyecto **ComiTeam** localmente.

---

## 🎯 Paso 1: Clonar e Instalar

```bash
# Clonar el repositorio
git clone https://github.com/Zack4U/sw3-proyecto-desarrollo.git
cd sw3-proyecto-desarrollo/backend

# Instalar dependencias
npm install
```

---

## 🎯 Paso 2: Configurar Base de Datos

### Opción A: Script Automático (Recomendado)

#### Windows (PowerShell)
```powershell
cd scripts/setup_database
./setup-database.ps1
```

#### Linux/Mac (Bash)
```bash
cd scripts/setup_database
chmod +x setup-database.sh
./setup-database.sh
```

### Opción B: Manual

```bash
# 1. Crear archivo .env
echo 'DATABASE_URL="postgresql://usuario:password@localhost:5432/comiteam_db"' > .env

# 2. Crear base de datos
createdb comiteam_db

# 3. Aplicar migraciones
npx prisma migrate dev

# 4. Generar cliente
npx prisma generate

# 5. Cargar datos de prueba
npx prisma db seed
```
---

## 🎯 Paso 3 (OPCIONAL): Generar datos de prueba

> ⚠️ **Nota**: Si ejecutaste la **Opción A (Script Automático)** en el Paso 2, los seeds ya fueron ejecutados automáticamente. Este paso es solo si usaste la **Opción B (Manual)** y omitiste el paso 5.

### ¿Cuándo ejecutar los seeds?

- ✅ Primera vez configurando el proyecto
- ✅ Después de resetear la base de datos
- ✅ Cuando necesites datos frescos para desarrollo
- ✅ Para probar la aplicación con datos realistas

### Ejecutar Seeds

```bash
# Desde la carpeta backend/
npx prisma db seed
```

**Salida esperada:**
```
🌱 Seeding database...
✅ Created 8 establishments
✅ Created 52 foods
🎉 Database seeded successfully!
```

### Ver los datos generados

```bash
# Abrir Prisma Studio
npx prisma studio
```

Esto abrirá una interfaz web en http://localhost:5555 donde podrás:
- 👀 Ver todos los establecimientos creados
- 🍕 Explorar los alimentos con sus categorías
- ✏️ Editar datos manualmente
- 🗑️ Eliminar registros

### Datos incluidos en los seeds

| Entidad | Cantidad | Ejemplos |
|---------|----------|----------|
| **Establecimientos** | 8 | La Panadería Central, Supermercado FreshMart, Restaurante El Buen Sabor |
| **Alimentos** | 52 | Pan integral, Tomates frescos, Pollo asado, Leche entera |

**Categorías de alimentos**: Panadería, Lácteos, Carnes, Frutas y Verduras, Bebidas, Comida Preparada

**Estados de alimentos**: AVAILABLE, RESERVED, DELIVERED, EXPIRED

### 🔄 Regenerar seeds (resetear datos)

Si necesitas empezar de cero:

```bash
# Opción 1: Resetear BD completa (borra todo y recrea)
npx prisma migrate reset
# Esto automáticamente ejecuta los seeds

# Opción 2: Solo eliminar datos y volver a crear
npx prisma db seed --preview-feature
```

### Personalizar los seeds

Si quieres modificar los datos de prueba:

```bash
# Editar el seed principal
code backend/prisma/seed.ts

# Editar seeds específicos
code backend/prisma/seeds/establishment.seed.ts
code backend/prisma/seeds/food.seed.ts
```

Después de editar, ejecuta:
```bash
npx prisma db seed
```

---

## 🎯 Paso 4: Iniciar el Servidor

```bash
npm run start:dev
```

✅ **¡Listo!** El servidor estará en: http://localhost:3000

---

## 🔍 Verificar la Instalación

### Probar el backend

```bash
# Opción 1: Con curl
curl http://localhost:3000

# Opción 2: Abrir en el navegador
# http://localhost:3000
```

### Ver los datos en la base de datos

```bash
npx prisma studio
# Se abre en: http://localhost:5555
```

---

## 📦 ¿Qué incluyen los seeds?

| Entidad | Cantidad | Descripción |
|---------|----------|-------------|
| **Establecimientos** | 8 | Panaderías, restaurantes, supermercados, etc. |
| **Alimentos** | 50+ | Con categorías, estados y fechas de expiración |

**Estados de alimentos**: AVAILABLE, RESERVED, DELIVERED, EXPIRED

---

## 🚨 Problemas Comunes

### ❌ Error: "Can't reach database server"

```bash
# Verifica que PostgreSQL esté corriendo
# Windows: services.msc → PostgreSQL debe estar en "Running"
# Linux: sudo systemctl status postgresql
# Mac: brew services list | grep postgresql

# Verifica tu .env
cat .env
```

### ❌ Error: "Port 3000 already in use"

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### ❌ Error: "Prisma Client not generated"

```bash
npx prisma generate
```

### 🔄 Resetear todo

```bash
npx prisma migrate reset
# Esto resetea la BD y ejecuta los seeds automáticamente
```

---

## 🎨 Comandos Esenciales

| Comando | Descripción |
|---------|-------------|
| `npm run start:dev` | Iniciar servidor en modo desarrollo |
| `npx prisma studio` | Abrir interfaz visual de la BD |
| `npx prisma db seed` | Ejecutar seeds (datos de prueba) |
| `npx prisma migrate dev` | Crear nueva migración |
| `npx prisma migrate reset` | Resetear BD completamente |
| `npx prisma generate` | Generar cliente de Prisma |
| `npm run test` | Ejecutar tests |

---

## 📂 Archivos Clave

```
backend/
├── .env                              # ⚙️ Configuración (¡crear este!)
├── prisma/
│   ├── schema.prisma                 # 📋 Esquema de la BD
│   ├── seed.ts                       # 🌱 Seed principal
│   └── seeds/                        # 🌱 Seeds modulares
│       ├── establishment.seed.ts
│       └── food.seed.ts
└── src/
    └── main.ts                       # 🚀 Punto de entrada
```

## 🆘 ¿Necesitas ayuda?

- 📚 **Guía completa**: `.docs/QUICK_START.md`
- 🌱 **Docs de Seeds**: `backend/SEEDS.md` o `backend/prisma/seeds/README.md`
- 🐛 **Issues**: [GitHub Issues](https://github.com/Zack4U/sw3-proyecto-desarrollo/issues)

---

## ✅ Checklist de Verificación Rápida

Antes de desarrollar, verifica:

- [ ] ✅ PostgreSQL corriendo
- [ ] ✅ `npm install` completado
- [ ] ✅ Archivo `.env` creado y configurado
- [ ] ✅ `npx prisma migrate dev` ejecutado sin errores
- [ ] ✅ `npx prisma db seed` ejecutado correctamente
- [ ] ✅ Servidor corriendo en http://localhost:3000
- [ ] ✅ Prisma Studio accesible en http://localhost:5555

---

**¡Todo listo para comenzar a desarrollar! 🚀**

¿Primera vez usando Prisma o NestJS? Revisa la [guía completa](.docs/QUICK_START.md) con más detalles.
