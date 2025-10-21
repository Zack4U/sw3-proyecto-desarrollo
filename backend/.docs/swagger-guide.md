# Configuración Global

Esta carpeta contiene las configuraciones globales de la aplicación.

## Swagger Configuration

### Instalación

Para usar Swagger, primero instala las dependencias necesarias:

```bash
npm install --save @nestjs/swagger swagger-ui-express
```

### Uso

La configuración de Swagger se aplica en el archivo `main.ts`:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerConfig } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar Swagger
  SwaggerConfig.setup(app, 'api/docs');
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

### Acceso a la documentación

Una vez configurado, la documentación estará disponible en:
- **Swagger UI**: http://localhost:3000/api/docs

### Personalización

Puedes personalizar la configuración de Swagger en `swagger.config.ts`:

- **Título y descripción**: Modifica `setTitle()` y `setDescription()`
- **Tags**: Agrega más tags con `addTag()`
- **Autenticación**: Configura esquemas de autenticación con `addBearerAuth()`, `addApiKey()`, etc.
- **Ruta de documentación**: Pasa una ruta personalizada como segundo parámetro en `SwaggerConfig.setup()`

### Decoradores en Controllers

Para documentar tus endpoints, usa los decoradores de Swagger:

```typescript
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('establishments')
@Controller('establishments')
export class EstablishmentController {
  @ApiOperation({ summary: 'Obtener todos los establecimientos' })
  @ApiResponse({ status: 200, description: 'Lista de establecimientos' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @Get()
  findAll() {
    // ...
  }
}
```

### Documentar DTOs

Documenta tus DTOs con decoradores:

```typescript
import { ApiProperty } from '@nestjs/swagger';

export class CreateEstablishmentDto {
  @ApiProperty({ description: 'Nombre del establecimiento', example: 'Restaurante El Buen Sabor' })
  name: string;

  @ApiProperty({ description: 'Dirección del establecimiento', example: 'Calle Principal 123' })
  address: string;
}
```
