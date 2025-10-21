# 🛡️ Guía de Guards en Autenticación

Este documento explica cómo utilizar los tres guards de autenticación implementados en el módulo de auth.

## 📋 Tabla de Contenidos

1. [Resumen de Guards](#resumen-de-guards)
2. [LocalAuthGuard](#localauthguard)
3. [JwtAuthGuard](#jwtauthguard)
4. [GoogleAuthGuard](#googleauthguard)
5. [Ejemplos de Uso](#ejemplos-de-uso)
6. [Combinación de Guards](#combinación-de-guards)

---

## Resumen de Guards

| Guard | Propósito | Cuándo Usar | Validación |
|-------|-----------|------------|-----------|
| **LocalAuthGuard** | Validar credenciales locales | Login con usuario/email/documento + contraseña | Estrategia Passport Local |
| **JwtAuthGuard** | Proteger rutas autenticadas | Endpoints que requieren usuario autenticado | Token JWT en header Authorization |
| **GoogleAuthGuard** | Validar login con Google | Login/Registro con Google OAuth | Token de Google validado por Passport |

---

## LocalAuthGuard

### ¿Qué hace?

El `LocalAuthGuard` valida las credenciales del usuario (identifier + password) usando la estrategia local de Passport.

### ¿Cuándo usarlo?

- En endpoints de login tradicional
- Cuando necesitas validar username/email/documentNumber + password

### Implementación

```typescript
// src/auth/guards/local-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
```

### Uso en Controlador

```typescript
import { LocalAuthGuard } from './guards';
import { LoginDto } from '../dtos/Auth';

@Controller('auth')
export class AuthController {
  /**
   * Login con credenciales locales
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Login local' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }
}
```

### Flujo de Validación

```
1. Usuario envía: { identifier: "user@example.com", password: "pass123" }
   ↓
2. LocalAuthGuard intercepta la petición
   ↓
3. Passport llama a LocalStrategy.validate()
   ↓
4. LocalStrategy llama a AuthService.validateUser()
   ↓
5. AuthService busca usuario por username/email/documentNumber
   ↓
6. Verifica contraseña con bcrypt
   ↓
7. Si válido: request.user = usuario, continúa al controlador
8. Si inválido: Lanza 401 Unauthorized
```

### Manejo de Errores

```typescript
// Si las credenciales son inválidas, recibiras:
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

---

## JwtAuthGuard

### ¿Qué hace?

El `JwtAuthGuard` valida que el usuario haya incluido un JWT válido en el header `Authorization`.

### ¿Cuándo usarlo?

- Proteger endpoints que requieren autenticación
- Verificar que el usuario tiene un token válido y no expirado
- Acceso a perfil, cambio de contraseña, etc.

### Implementación

```typescript
// src/auth/guards/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

### Uso en Controlador

```typescript
import { JwtAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  /**
   * Obtener perfil del usuario autenticado
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user profile' })
  async getProfile(@Request() req: any): Promise<any> {
    return this.authService.getProfile(req.user.userId);
  }

  /**
   * Cambiar contraseña (requiere estar autenticado)
   */
  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Change password' })
  async changePassword(
    @Request() req: any,
    @Body() body: { oldPassword: string; newPassword: string }
  ): Promise<{ success: boolean; message: string }> {
    return this.authService.changePassword(
      req.user.userId,
      body.oldPassword,
      body.newPassword
    );
  }

  /**
   * Logout (solo para usuarios autenticados)
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Logout' })
  async logout(@Request() req: any): Promise<{ message: string }> {
    // Implementar lógica de logout si es necesaria
    return { message: 'Successfully logged out' };
  }
}
```

### Flujo de Validación

```
1. Cliente envía: GET /auth/profile
   Header: Authorization: Bearer eyJhbGc...
   ↓
2. JwtAuthGuard intercepta
   ↓
3. Extrae token del header Authorization (Bearer token)
   ↓
4. JwtStrategy verifica el token con JWT_SECRET
   ↓
5. Valida que no esté expirado
   ↓
6. Extrae payload: { sub: userId, email, username }
   ↓
7. Busca usuario en BD
   ↓
8. Si válido: request.user = usuario, continúa
9. Si inválido: Lanza 401 Unauthorized
```

### Acceso al Usuario en Controlador

Una vez que pasa el `JwtAuthGuard`, puedes acceder al usuario:

```typescript
@Get('profile')
@UseGuards(JwtAuthGuard)
async getProfile(@Request() req: any): Promise<any> {
  // req.user contiene:
  // {
  //   userId: "123e4567-e89b-12d3-a456-426614174000",
  //   email: "user@example.com",
  //   username: "john_doe",
  //   sub: "123e4567-e89b-12d3-a456-426614174000"
  // }
  
  const userId = req.user.userId; // o req.user.sub
  return this.authService.getProfile(userId);
}

// También puedes usar el decorador @Request() o inyectar el usuario directamente
@Get('me')
@UseGuards(JwtAuthGuard)
async getMe(@CurrentUser() user: any): Promise<any> {
  return user;
}
```

### Manejo de Errores

```typescript
// Si el token es inválido o está expirado:
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}

// Si falta el token:
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

---

## GoogleAuthGuard

### ¿Qué hace?

El `GoogleAuthGuard` valida que el usuario está haciendo login con Google OAuth.

### ¿Cuándo usarlo?

- Endpoints de login/registro con Google
- Validar que el token viene de Google
- Crear o actualizar usuario basado en perfil de Google

### Implementación

```typescript
// src/auth/guards/google-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {}
```

### Uso en Controlador

```typescript
import { GoogleAuthGuard } from './guards';
import { GoogleAuthBeneficiaryDto, GoogleAuthEstablishmentDto } from '../dtos/Auth';

@Controller('auth')
export class AuthController {
  /**
   * Google login para beneficiario
   */
  @Post('beneficiary/google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login beneficiary with Google' })
  async googleAuthBeneficiary(
    @Body() googleAuthDto: GoogleAuthBeneficiaryDto
  ): Promise<AuthResponseDto> {
    if (!googleAuthDto.email) {
      throw new BadRequestException('Email from Google is required');
    }
    return this.authService.googleLoginBeneficiary(googleAuthDto);
  }

  /**
   * Google login para establecimiento
   */
  @Post('establishment/google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login establishment with Google' })
  async googleAuthEstablishment(
    @Body() googleAuthDto: GoogleAuthEstablishmentDto
  ): Promise<AuthResponseDto> {
    if (!googleAuthDto.email) {
      throw new BadRequestException('Email from Google is required');
    }
    return this.authService.googleLoginEstablishment(googleAuthDto);
  }
}
```

### Flujo de Validación

```
1. Frontend obtiene token de Google
   ↓
2. Frontend envía: POST /auth/beneficiary/google
   {
     token: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEyMzQ1Njc4OTAi...",
     email: "user@gmail.com",
     name: "John Doe"
   }
   ↓
3. Passport-Google-OAuth20 valida el token con Google
   ↓
4. Google retorna el perfil: { id, displayName, emails, photos }
   ↓
5. GoogleStrategy.validate() transforma el perfil
   ↓
6. Backend busca/crea usuario en BD
   ↓
7. Retorna NUESTROS tokens JWT (no el de Google)
```

### Respuesta

```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@gmail.com"
}
```

---

## Ejemplos de Uso

### Ejemplo 1: Endpoint de Login

```typescript
@Post('login')
@HttpCode(HttpStatus.OK)
@UseGuards(LocalAuthGuard)  // ← Valida credenciales
@ApiOperation({ summary: 'Login local' })
@ApiBody({ type: LoginDto })
async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
  // En este punto, LocalAuthGuard ya validó las credenciales
  // request.user contiene el usuario validado
  return this.authService.login(loginDto);
}

// Cliente:
// curl -X POST http://localhost:3000/auth/login \
//   -H "Content-Type: application/json" \
//   -d '{
//     "identifier": "john_doe",
//     "password": "SecurePass123!"
//   }'
```

### Ejemplo 2: Endpoint Protegido

```typescript
@Get('profile')
@UseGuards(JwtAuthGuard)  // ← Valida JWT
@ApiBearerAuth('JWT-auth')
async getProfile(@Request() req: any): Promise<any> {
  // Solo llega aquí si el JWT es válido
  // request.user contiene la info del token
  return this.authService.getProfile(req.user.userId);
}

// Cliente:
// curl http://localhost:3000/auth/profile \
//   -H "Authorization: Bearer eyJhbGc..."
```

### Ejemplo 3: Múltiples Guards

```typescript
@Delete('account')
@UseGuards(JwtAuthGuard)  // Primero verifica JWT
@HttpCode(HttpStatus.OK)
async deleteAccount(@Request() req: any): Promise<{ message: string }> {
  // Solo usuarios autenticados pueden eliminar su cuenta
  const userId = req.user.userId;
  await this.authService.deleteAccount(userId);
  return { message: 'Account deleted successfully' };
}
```

---

## Combinación de Guards

### Guards en Secuencia

Cuando usas múltiples guards, todos deben pasar:

```typescript
@Post('secure-action')
@UseGuards(JwtAuthGuard, RoleGuard)  // Ambos deben pasar
async secureAction(@Request() req: any): Promise<any> {
  // Primero JwtAuthGuard valida el token
  // Luego RoleGuard valida el rol
  return { success: true };
}
```

### Guards Condicionales

```typescript
@Get('data')
@UseGuards(JwtAuthGuard)
async getData(
  @Request() req: any,
  @Query('public') isPublic?: boolean
): Promise<any> {
  // Si isPublic=true, no necesita autenticación
  // Si isPublic=false, requiere JWT válido
  if (!isPublic && !req.user) {
    throw new UnauthorizedException();
  }
  return this.dataService.getData(isPublic);
}
```

---

## Tabla Resumen de Guards

| Endpoint | Guard | Requiere | Retorna en request.user |
|----------|-------|----------|------------------------|
| `POST /auth/login` | LocalAuthGuard | username/email/documentNumber + password | Usuario validado |
| `GET /auth/profile` | JwtAuthGuard | Authorization header con JWT | { userId, email, username } |
| `POST /auth/logout` | JwtAuthGuard | Authorization header con JWT | { userId, email, username } |
| `POST /auth/change-password` | JwtAuthGuard | Authorization header con JWT | { userId, email, username } |
| `POST /auth/beneficiary/google` | Ninguno | Token de Google en body | - |
| `POST /auth/establishment/google` | Ninguno | Token de Google en body | - |
| `POST /auth/refresh` | Ninguno | Refresh token en body | - |

---

## Configuración de Ambiente

Para que los guards funcionen correctamente, asegúrate de tener estas variables en `.env`:

```bash
# JWT
JWT_SECRET=your-secret-key-change-this
JWT_REFRESH_SECRET=your-refresh-secret-key-change-this
JWT_EXPIRATION=3600

# Google OAuth (opcional, solo para GoogleAuthGuard)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/callback
```

---

## Mejores Prácticas

✅ **DO:**
- Usar `JwtAuthGuard` para proteger endpoints sensibles
- Usar `LocalAuthGuard` solo en endpoint de login
- Verificar `req.user` después de que el guard pase
- Usar `@ApiBearerAuth()` en Swagger para documentar JWT
- Incluir manejo de errores apropiado

❌ **DON'T:**
- No dejes endpoints protegidos sin guards
- No guardes la contraseña en `request.user`
- No uses guards innecesariamente
- No confundas token de Google con JWT propio
- No expongas JWT en logs o error messages

---

## Troubleshooting

### Error: "Unauthorized"
- Verifica que incluiste el token en el header: `Authorization: Bearer token`
- Comprueba que el JWT no está expirado
- Verifica que JWT_SECRET es el mismo en producción

### Error: "Invalid credentials"
- Verifica que identifier (username/email/documentNumber) existe
- Comprueba que la contraseña es correcta
- Asegúrate de que la cuenta está activa

### Error: "Email from Google is required"
- Verifica que el usuario ha autorizado compartir su email con tu app
- Comprueba que estás enviando el token correcto

---

## Recursos Adicionales

- [Documentación de Passport.js](http://www.passportjs.org/)
- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [JWT en NestJS](https://docs.nestjs.com/security/jwt)
- [OAuth 2.0 Spec](https://tools.ietf.org/html/rfc6749)
