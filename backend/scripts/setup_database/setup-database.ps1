# =====================================================
# Script PowerShell para configuración de PostgreSQL
# Proyecto: Comiya Business
# =====================================================
# 
# USO:
#   .\scripts\setup-database.ps1
#   
# O con parámetros personalizados:
#   .\scripts\setup-database.ps1 -DbName "mi_db" -DbUser "mi_usuario" -DbPassword "mi_pass"
# =====================================================

param(
    [string]$DbName = "comiya_business",
    [string]$DbUser = "comiya_user",
    [string]$DbPassword = "password",
    [string]$DbHost = "localhost",
    [int]$DbPort = 5432,
    [string]$PostgresUser = "postgres",
    [string]$PostgresPassword = ""
)

# Configuración de colores
$ColorInfo = "Cyan"
$ColorSuccess = "Green"
$ColorWarning = "Yellow"
$ColorError = "Red"

Write-Host "=============================================" -ForegroundColor $ColorInfo
Write-Host "  Configuración de Base de Datos PostgreSQL" -ForegroundColor $ColorInfo
Write-Host "  Proyecto: Comiya Business" -ForegroundColor $ColorInfo
Write-Host "=============================================" -ForegroundColor $ColorInfo
Write-Host ""

# Si no se proporcionó contraseña de postgres, solicitarla
if ([string]::IsNullOrEmpty($PostgresPassword)) {
    $securePassword = Read-Host "Ingresa la contraseña del usuario 'postgres'" -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
    $PostgresPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
}

# Configurar variable de entorno para contraseña
$env:PGPASSWORD = $PostgresPassword

# Función para ejecutar comandos psql
function Invoke-PsqlCommand {
    param(
        [string]$Command,
        [string]$Database = "postgres"
    )
    
    $arguments = @(
        "-U", $PostgresUser,
        "-h", $DbHost,
        "-p", $DbPort,
        "-d", $Database,
        "-c", $Command
    )
    
    $process = Start-Process -FilePath "psql" -ArgumentList $arguments -NoNewWindow -Wait -PassThru -RedirectStandardError "NUL"
    return $process.ExitCode
}

# Verificar conexión a PostgreSQL
Write-Host "Verificando conexión a PostgreSQL..." -ForegroundColor $ColorWarning
$testConnection = Start-Process -FilePath "psql" -ArgumentList @("-U", $PostgresUser, "-h", $DbHost, "-p", $DbPort, "-l") -NoNewWindow -Wait -PassThru -RedirectStandardOutput "NUL" -RedirectStandardError "NUL"

if ($testConnection.ExitCode -ne 0) {
    Write-Host "✗ No se puede conectar a PostgreSQL" -ForegroundColor $ColorError
    Write-Host "Asegúrate de que PostgreSQL esté corriendo y que la contraseña sea correcta" -ForegroundColor $ColorWarning
    exit 1
}
Write-Host "✓ PostgreSQL está corriendo" -ForegroundColor $ColorSuccess

# Mostrar configuración
Write-Host ""
Write-Host "Configuración a aplicar:" -ForegroundColor $ColorWarning
Write-Host "  Base de datos: $DbName" -ForegroundColor $ColorSuccess
Write-Host "  Usuario:       $DbUser" -ForegroundColor $ColorSuccess
Write-Host "  Contraseña:    $DbPassword" -ForegroundColor $ColorSuccess
Write-Host "  Host:          $DbHost" -ForegroundColor $ColorSuccess
Write-Host "  Puerto:        $DbPort" -ForegroundColor $ColorSuccess
Write-Host ""

$confirmation = Read-Host "¿Deseas continuar? (S/N)"
if ($confirmation -notmatch '^[SsYy]$') {
    Write-Host "Operación cancelada" -ForegroundColor $ColorWarning
    exit 0
}

# Paso 1: Terminar conexiones activas
Write-Host ""
Write-Host "Paso 1: Terminando conexiones activas..." -ForegroundColor $ColorWarning
$terminateQuery = @"
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = '$DbName'
  AND pid <> pg_backend_pid();
"@
Invoke-PsqlCommand -Command $terminateQuery | Out-Null
Write-Host "✓ Conexiones terminadas" -ForegroundColor $ColorSuccess

# Paso 2: Eliminar base de datos si existe
Write-Host ""
Write-Host "Paso 2: Eliminando base de datos si existe..." -ForegroundColor $ColorWarning
Invoke-PsqlCommand -Command "DROP DATABASE IF EXISTS $DbName;" | Out-Null
Write-Host "✓ Base de datos eliminada (si existía)" -ForegroundColor $ColorSuccess

# Paso 3: Eliminar usuario si existe
Write-Host ""
Write-Host "Paso 3: Eliminando usuario si existe..." -ForegroundColor $ColorWarning
Invoke-PsqlCommand -Command "DROP USER IF EXISTS $DbUser;" | Out-Null
Write-Host "✓ Usuario eliminado (si existía)" -ForegroundColor $ColorSuccess

# Paso 4: Crear usuario
Write-Host ""
Write-Host "Paso 4: Creando usuario..." -ForegroundColor $ColorWarning
$createUserResult = Invoke-PsqlCommand -Command "CREATE USER $DbUser WITH PASSWORD '$DbPassword';"
if ($createUserResult -eq 0) {
    Write-Host "✓ Usuario creado exitosamente" -ForegroundColor $ColorSuccess
} else {
    Write-Host "✗ Error al crear usuario" -ForegroundColor $ColorError
    exit 1
}

# Paso 5: Crear base de datos
Write-Host ""
Write-Host "Paso 5: Creando base de datos..." -ForegroundColor $ColorWarning
$createDbQuery = @"
CREATE DATABASE $DbName
    WITH 
    OWNER = $DbUser
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;
"@
$createDbResult = Invoke-PsqlCommand -Command $createDbQuery
if ($createDbResult -eq 0) {
    Write-Host "✓ Base de datos creada exitosamente" -ForegroundColor $ColorSuccess
} else {
    Write-Host "✗ Error al crear base de datos" -ForegroundColor $ColorError
    exit 1
}

# Paso 6: Configurar permisos
Write-Host ""
Write-Host "Paso 6: Configurando permisos..." -ForegroundColor $ColorWarning
$permissionsQuery = @"
GRANT ALL PRIVILEGES ON DATABASE $DbName TO $DbUser;
GRANT ALL ON SCHEMA public TO $DbUser;
GRANT CREATE ON SCHEMA public TO $DbUser;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DbUser;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DbUser;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO $DbUser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DbUser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DbUser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO $DbUser;
"@
$permissionsResult = Invoke-PsqlCommand -Command $permissionsQuery -Database $DbName
if ($permissionsResult -eq 0) {
    Write-Host "✓ Permisos configurados exitosamente" -ForegroundColor $ColorSuccess
} else {
    Write-Host "✗ Error al configurar permisos" -ForegroundColor $ColorError
    exit 1
}

# Paso 7: Instalar extensiones
Write-Host ""
Write-Host "Paso 7: Instalando extensiones..." -ForegroundColor $ColorWarning
$extensionsQuery = @"
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
GRANT USAGE ON SCHEMA public TO $DbUser;
"@
$extensionsResult = Invoke-PsqlCommand -Command $extensionsQuery -Database $DbName
if ($extensionsResult -eq 0) {
    Write-Host "✓ Extensiones instaladas (uuid-ossp, pgcrypto)" -ForegroundColor $ColorSuccess
} else {
    Write-Host "⚠ Advertencia: No se pudieron instalar todas las extensiones" -ForegroundColor $ColorWarning
}

# Limpiar variable de entorno
Remove-Item Env:\PGPASSWORD

# Resumen final
Write-Host ""
Write-Host "=============================================" -ForegroundColor $ColorSuccess
Write-Host "  ✓ Configuración completada exitosamente" -ForegroundColor $ColorSuccess
Write-Host "=============================================" -ForegroundColor $ColorSuccess
Write-Host ""
Write-Host "Cadena de conexión:"
Write-Host "postgresql://$DbUser`:$DbPassword@$DbHost`:$DbPort/$DbName" -ForegroundColor $ColorInfo
Write-Host ""
Write-Host "Próximos pasos:"
Write-Host "1. Verifica tu archivo .env con la cadena de conexión" -ForegroundColor $ColorWarning
Write-Host "2. Ejecuta: npx prisma db push" -ForegroundColor $ColorWarning
Write-Host "3. Ejecuta: npx prisma generate" -ForegroundColor $ColorWarning
Write-Host ""
