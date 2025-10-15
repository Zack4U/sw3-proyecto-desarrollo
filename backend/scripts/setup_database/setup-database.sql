-- =====================================================
-- Script de configuración de base de datos PostgreSQL
-- Proyecto: Comiya Business
-- =====================================================
-- 
-- INSTRUCCIONES DE USO:
-- Ejecutar como superusuario de PostgreSQL (generalmente 'postgres')
-- 
-- Opción 1 - Desde psql:
--   psql -U postgres -f scripts/setup-database.sql
-- 
-- Opción 2 - Desde terminal:
--   psql -U postgres < scripts/setup-database.sql
-- 
-- Opción 3 - Copiar y pegar en pgAdmin o tu cliente SQL
-- =====================================================

-- Configuración de variables (modificar según necesidad)
\set db_name 'comiya_business'
\set db_user 'comiya_user'
\set db_password '''password'''

-- Terminar conexiones activas a la base de datos (si existe)
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = :'db_name'
  AND pid <> pg_backend_pid();

-- Eliminar la base de datos si existe (CUIDADO: Esto borra todos los datos)
DROP DATABASE IF EXISTS :db_name;

-- Eliminar el usuario si existe
DROP USER IF EXISTS :db_user;

-- Crear el usuario con contraseña
CREATE USER :db_user WITH PASSWORD :db_password;

-- Crear la base de datos
CREATE DATABASE :db_name
    WITH 
    OWNER = :db_user
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Comentario descriptivo
COMMENT ON DATABASE :db_name IS 'Base de datos para el sistema Comiya Business';

-- Conectar a la base de datos recién creada
\c :db_name

-- Otorgar todos los privilegios en la base de datos
GRANT ALL PRIVILEGES ON DATABASE :db_name TO :db_user;

-- Otorgar permisos en el esquema public
GRANT ALL ON SCHEMA public TO :db_user;
GRANT CREATE ON SCHEMA public TO :db_user;

-- Otorgar permisos sobre objetos existentes
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO :db_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO :db_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO :db_user;

-- Configurar permisos por defecto para objetos futuros
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO :db_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO :db_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO :db_user;

-- Habilitar extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- Para generar UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";       -- Para funciones criptográficas

-- Otorgar permisos de uso sobre las extensiones
GRANT USAGE ON SCHEMA public TO :db_user;

-- Mostrar mensaje de éxito
\echo '============================================='
\echo 'Base de datos configurada exitosamente!'
\echo '============================================='
\echo 'Base de datos: ' :db_name
\echo 'Usuario:       ' :db_user
\echo 'Extensiones instaladas: uuid-ossp, pgcrypto'
\echo '============================================='
