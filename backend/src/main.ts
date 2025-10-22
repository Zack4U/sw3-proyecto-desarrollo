import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerConfig } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuracion .env
  const PORT = process.env.PORT ?? 3001;
  const API_VERSION = process.env.API_VERSION ?? 'v1';
  const ENVIRONMENT = process.env.NODE_ENV ?? 'development';

  // Habilitar CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Configurar ValidationPipe global para validar DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Configurar prefijo global para todas las rutas
  app.setGlobalPrefix(`api/${API_VERSION}`);

  // Configurar Swagger
  SwaggerConfig.setup(app, `api/${API_VERSION}/docs`);

  await app.listen(PORT);
  console.log(`=`.repeat(65));
  console.log(`🏔️  Environment: ${ENVIRONMENT}`);
  console.log(`🌐 Application is running on: http://localhost:${PORT}`);
  console.log(`⭐ API is running on: http://localhost:${PORT}/api/${API_VERSION}`);
  console.log(`📄 Documentation available at: http://localhost:${PORT}/api/${API_VERSION}/docs`);
  console.log(`=`.repeat(65));
}
bootstrap();
