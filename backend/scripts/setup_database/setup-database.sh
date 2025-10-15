#!/bin/bash
# =====================================================
# Script automático de configuración de base de datos
# Proyecto: Comiya Business
# =====================================================

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración (modificar según necesidad)
DB_NAME="comiya_business"
DB_USER="comiya_user"
DB_PASSWORD="password"
DB_HOST="localhost"
DB_PORT="5432"
POSTGRES_USER="postgres"

echo -e "${BLUE}=============================================${NC}"
echo -e "${BLUE}  Configuración de Base de Datos PostgreSQL${NC}"
echo -e "${BLUE}  Proyecto: Comiya Business${NC}"
echo -e "${BLUE}=============================================${NC}"
echo ""

# Función para verificar si PostgreSQL está corriendo
check_postgres() {
    echo -e "${YELLOW}Verificando conexión a PostgreSQL...${NC}"
    if psql -U "$POSTGRES_USER" -h "$DB_HOST" -p "$DB_PORT" -lqt &> /dev/null; then
        echo -e "${GREEN}✓ PostgreSQL está corriendo${NC}"
        return 0
    else
        echo -e "${RED}✗ No se puede conectar a PostgreSQL${NC}"
        echo -e "${YELLOW}Asegúrate de que PostgreSQL esté corriendo y que puedas conectarte como usuario '$POSTGRES_USER'${NC}"
        return 1
    fi
}

# Función para ejecutar comandos SQL
execute_sql() {
    local sql=$1
    PGPASSWORD="$POSTGRES_PASSWORD" psql -U "$POSTGRES_USER" -h "$DB_HOST" -p "$DB_PORT" -c "$sql" 2>/dev/null
}

# Verificar conexión
if ! check_postgres; then
    exit 1
fi

echo ""
echo -e "${YELLOW}Configuración a aplicar:${NC}"
echo -e "  Base de datos: ${GREEN}$DB_NAME${NC}"
echo -e "  Usuario:       ${GREEN}$DB_USER${NC}"
echo -e "  Contraseña:    ${GREEN}$DB_PASSWORD${NC}"
echo -e "  Host:          ${GREEN}$DB_HOST${NC}"
echo -e "  Puerto:        ${GREEN}$DB_PORT${NC}"
echo ""

read -p "¿Deseas continuar? (s/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[SsYy]$ ]]; then
    echo -e "${YELLOW}Operación cancelada${NC}"
    exit 0
fi

echo ""
echo -e "${YELLOW}Paso 1: Terminando conexiones activas...${NC}"
PGPASSWORD="$POSTGRES_PASSWORD" psql -U "$POSTGRES_USER" -h "$DB_HOST" -p "$DB_PORT" -c "
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = '$DB_NAME'
  AND pid <> pg_backend_pid();" 2>/dev/null
echo -e "${GREEN}✓ Conexiones terminadas${NC}"

echo ""
echo -e "${YELLOW}Paso 2: Eliminando base de datos si existe...${NC}"
PGPASSWORD="$POSTGRES_PASSWORD" psql -U "$POSTGRES_USER" -h "$DB_HOST" -p "$DB_PORT" -c "DROP DATABASE IF EXISTS $DB_NAME;" 2>/dev/null
echo -e "${GREEN}✓ Base de datos eliminada (si existía)${NC}"

echo ""
echo -e "${YELLOW}Paso 3: Eliminando usuario si existe...${NC}"
PGPASSWORD="$POSTGRES_PASSWORD" psql -U "$POSTGRES_USER" -h "$DB_HOST" -p "$DB_PORT" -c "DROP USER IF EXISTS $DB_USER;" 2>/dev/null
echo -e "${GREEN}✓ Usuario eliminado (si existía)${NC}"

echo ""
echo -e "${YELLOW}Paso 4: Creando usuario...${NC}"
PGPASSWORD="$POSTGRES_PASSWORD" psql -U "$POSTGRES_USER" -h "$DB_HOST" -p "$DB_PORT" -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Usuario creado exitosamente${NC}"
else
    echo -e "${RED}✗ Error al crear usuario${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Paso 5: Creando base de datos...${NC}"
PGPASSWORD="$POSTGRES_PASSWORD" psql -U "$POSTGRES_USER" -h "$DB_HOST" -p "$DB_PORT" -c "
CREATE DATABASE $DB_NAME
    WITH 
    OWNER = $DB_USER
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    CONNECTION LIMIT = -1;"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Base de datos creada exitosamente${NC}"
else
    echo -e "${RED}✗ Error al crear base de datos${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Paso 6: Configurando permisos...${NC}"
PGPASSWORD="$POSTGRES_PASSWORD" psql -U "$POSTGRES_USER" -h "$DB_HOST" -p "$DB_PORT" -d "$DB_NAME" << EOF
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
GRANT ALL ON SCHEMA public TO $DB_USER;
GRANT CREATE ON SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO $DB_USER;
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Permisos configurados exitosamente${NC}"
else
    echo -e "${RED}✗ Error al configurar permisos${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Paso 7: Instalando extensiones...${NC}"
PGPASSWORD="$POSTGRES_PASSWORD" psql -U "$POSTGRES_USER" -h "$DB_HOST" -p "$DB_PORT" -d "$DB_NAME" << EOF
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
GRANT USAGE ON SCHEMA public TO $DB_USER;
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Extensiones instaladas (uuid-ossp, pgcrypto)${NC}"
else
    echo -e "${YELLOW}⚠ Advertencia: No se pudieron instalar todas las extensiones${NC}"
fi

echo ""
echo -e "${GREEN}=============================================${NC}"
echo -e "${GREEN}  ✓ Configuración completada exitosamente${NC}"
echo -e "${GREEN}=============================================${NC}"
echo ""
echo -e "Cadena de conexión:"
echo -e "${BLUE}postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME${NC}"
echo ""
echo -e "Próximos pasos:"
echo -e "1. Verifica tu archivo ${YELLOW}.env${NC} con la cadena de conexión"
echo -e "2. Ejecuta: ${YELLOW}npx prisma db push${NC}"
echo -e "3. Ejecuta: ${YELLOW}npx prisma generate${NC}"
echo ""
