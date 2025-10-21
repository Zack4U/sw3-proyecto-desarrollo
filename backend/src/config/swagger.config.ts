import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

/**
 * Configuración global de Swagger para la API
 */
export class SwaggerConfig {
  /**
   * Configura Swagger en la aplicación NestJS
   * @param app - Instancia de la aplicación NestJS
   * @param path - Ruta donde se expondrá la documentación (por defecto: 'api/docs')
   */
  static setup(app: INestApplication, path: string = 'api/docs'): void {
    const config = new DocumentBuilder()
      .setTitle('ComiYA - API Documentation')
      .setDescription('Documentación de la API de ComiYA')
      .setVersion('1.0')
      .addTag('health', 'Operaciones de salud del sistema')
      .addTag('authentication', 'Operaciones de autenticación y autorización')
      .addTag('establishments', 'Operaciones relacionadas con establecimientos')
      .addTag('foods', 'Operaciones relacionadas con alimentos')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Ingrese el token JWT',
          in: 'header',
        },
        'JWT-auth', // Este nombre se usa en los decoradores @ApiBearerAuth()
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(path, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        operationsSorter: 'alpha',
      },
      customSiteTitle: 'API Docs',
      customCss: `
        .swagger-ui .topbar { display: none }
        .swagger-ui .information-container { margin: 20px 0 }
      `,
    });
  }
}
