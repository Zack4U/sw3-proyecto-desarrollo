# Scripts de Configuración de Base de Datos

Esta carpeta contiene scripts automatizados para configurar la base de datos PostgreSQL del proyecto Comiya Business.

## 📁 Archivos Disponibles

### 1. `setup-database.sql`
Script SQL puro para ejecutar manualmente o desde un cliente SQL.

**Uso:**
```bash
# Desde psql
psql -U postgres -f scripts/setup-database.sql

# Desde línea de comandos
psql -U postgres < scripts/setup-database.sql
```

### 2. `setup-database.sh`
Script Bash para Linux/macOS con interfaz interactiva.

**Uso:**
```bash
# Dar permisos de ejecución
chmod +x scripts/setup-database.sh

# Ejecutar
./scripts/setup-database.sh
```

### 3. `setup-database.ps1`
Script PowerShell para Windows con interfaz interactiva.

**Uso:**
```powershell
# Ejecutar con configuración por defecto
.\scripts\setup-database.ps1

# Ejecutar con parámetros personalizados
.\scripts\setup-database.ps1 -DbName "mi_db" -DbUser "mi_usuario" -DbPassword "mi_pass"
```

**Parámetros disponibles:**
- `-DbName`: Nombre de la base de datos (default: `comiya_business`)
- `-DbUser`: Nombre del usuario (default: `comiya_user`)
- `-DbPassword`: Contraseña del usuario (default: `password`)
- `-DbHost`: Host de PostgreSQL (default: `localhost`)
- `-DbPort`: Puerto de PostgreSQL (default: `5432`)
- `-PostgresUser`: Usuario admin de PostgreSQL (default: `postgres`)
- `-PostgresPassword`: Contraseña del usuario admin (se solicita si no se proporciona)

## ⚙️ ¿Qué hacen estos scripts?

Los scripts automatizan todo el proceso de configuración:

1. ✅ Verifican la conexión a PostgreSQL
2. ✅ Terminan conexiones activas a la base de datos (si existe)
3. ✅ Eliminan la base de datos anterior (si existe)
4. ✅ Eliminan el usuario anterior (si existe)
5. ✅ Crean un nuevo usuario con contraseña
6. ✅ Crean una nueva base de datos
7. ✅ Configuran todos los permisos necesarios
8. ✅ Instalan extensiones útiles (`uuid-ossp`, `pgcrypto`)
9. ✅ Muestran la cadena de conexión para tu `.env`

## 🚀 Configuración Rápida (Windows)

```powershell
# 1. Ejecutar el script
.\scripts\setup-database.ps1

# 2. El script te pedirá la contraseña de 'postgres'

# 3. Confirma la operación cuando se te solicite

# 4. ¡Listo! Copia la cadena de conexión al archivo .env
```

## 🔒 Configuración por Defecto

```
Base de datos: comiya_business
Usuario:       comiya_user
Contraseña:    password
Host:          localhost
Puerto:        5432
```

## 📝 Después de ejecutar el script

1. Verifica que tu archivo `.env` tenga la cadena de conexión correcta:
   ```env
   DATABASE_URL="postgresql://comiya_user:password@localhost:5432/comiya_business"
   ```

2. Aplica el esquema de Prisma:
   ```bash
   npx prisma db push
   ```

3. Genera el cliente de Prisma:
   ```bash
   npx prisma generate
   ```

## ⚠️ Advertencias

- **IMPORTANTE**: Estos scripts eliminan y recrean la base de datos. ¡Se perderán todos los datos existentes!
- Ejecuta estos scripts solo en entornos de desarrollo
- Nunca ejecutes estos scripts en producción sin respaldo

## 🔧 Solución de Problemas

### Error: "psql: command not found"
Asegúrate de que PostgreSQL esté instalado y agregado al PATH del sistema.

**Windows:**
Agrega a tu PATH: `C:\Program Files\PostgreSQL\XX\bin`

### Error: "FATAL: password authentication failed"
Verifica que estés usando la contraseña correcta del usuario `postgres`.

### Error de permisos
Asegúrate de ejecutar el script como un usuario con privilegios de superusuario de PostgreSQL.

## 📚 Recursos Adicionales

- [Documentación de Prisma](https://www.prisma.io/docs)
- [Documentación de PostgreSQL](https://www.postgresql.org/docs/)
