<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Backend del proyecto **Comiya Business** - Sistema de gestión de establecimientos y alimentos.

Desarrollado con [NestJS](https://github.com/nestjs/nest), [Prisma](https://www.prisma.io/), y PostgreSQL.

## 📋 Requisitos Previos

- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm >= 9.x

## 🚀 Configuración del Proyecto

### 1. Instalar Dependencias

```bash
$ npm install
```

### 2. Configurar Base de Datos

#### Opción A: Script Automático (Recomendado)

**Windows (PowerShell):**
```bash
$ cd scripts/setup_database
$ ./setup-database.ps1
```

**Linux/Mac (Bash):**
```bash
$ cd scripts/setup_database
$ chmod +x setup-database.sh
$ ./setup-database.sh
```

#### Opción B: Manual

```bash
# 1. Crear archivo .env con la cadena de conexión
$ echo 'DATABASE_URL="postgresql://comiya_user:password@localhost:5432/comiya_business"' > .env

# 2. Generar el cliente de Prisma
$ npm run prisma:generate

# 3. Aplicar migraciones
$ npm run prisma:migrate

# 4. Cargar datos de prueba
$ npm run seed
```

## 💻 Comandos Disponibles

### Desarrollo

```bash
# Iniciar servidor en modo desarrollo con hot-reload
$ npm run start:dev

# Iniciar servidor normal
$ npm run start

# Iniciar en modo debug
$ npm run start:debug

# Compilar el proyecto
$ npm run build

# Formatear código con Prettier
$ npm run format

# Ejecutar ESLint y corregir errores
$ npm run lint
```

### Base de Datos (Prisma)

```bash
# Generar cliente de Prisma (después de cambios en schema.prisma)
$ npm run prisma:generate
# Alternativa: npx prisma generate

# Crear y aplicar migraciones
$ npm run prisma:migrate
# Alternativa: npx prisma migrate dev

# Cargar datos de prueba (seeds)
$ npm run prisma:seed
# Alternativa: npx prisma db seed

# Abrir Prisma Studio (interfaz visual de BD)
$ npm run prisma:studio

# Ver estado de migraciones
$ npm run prisma:status

# Resetear base de datos (¡CUIDADO! Borra todos los datos)
$ npm run prisma:reset

# Aplicar schema sin crear migración (desarrollo)
$ npm run prisma:push
```

### Testing

```bash
# Ejecutar tests unitarios
$ npm run test

# Ejecutar tests en modo watch
$ npm run test:watch

# Ejecutar tests e2e (end-to-end)
$ npm run test:e2e

# Generar reporte de cobertura
$ npm run test:cov

# Ejecutar tests en modo debug
$ npm run test:debug
```

### Producción

```bash
# Compilar para producción
$ npm run build

# Ejecutar versión compilada
$ npm run start:prod
```

## 📊 Acceder a la Aplicación

Una vez iniciado el servidor:

- **API REST**: http://localhost:3000
- **Swagger UI**: http://localhost:3000/api
- **Prisma Studio**: http://localhost:5555 (después de ejecutar `npx prisma studio`)

## 🗂️ Estructura del Proyecto

```
backend/
├── prisma/
│   ├── schema.prisma          # Esquema de base de datos
│   ├── seed.ts                # Script principal de seeds
│   └── seeds/                 # Seeds modulares por entidad
│       ├── establishment.seed.ts
│       └── food.seed.ts
├── src/
│   ├── config/                # Configuraciones (Swagger, etc)
│   ├── controllers/           # Controladores REST
│   ├── dtos/                  # Data Transfer Objects
│   ├── models/               # Modelos de dominio
│   ├── services/             # Lógica de negocio
│   ├── prisma/               # Servicio de Prisma
│   ├── app.module.ts         # Módulo principal
│   └── main.ts               # Punto de entrada
├── test/                     # Tests e2e
├── .env                      # Variables de entorno (crear este!)
└── package.json              # Dependencias y scripts
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
