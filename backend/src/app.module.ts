import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { EstablishmentsService } from './services/establishment.service';
import { EstablishmentsController } from './controllers/establishment.controller';
import { FoodsController } from './controllers/foods.controller';
import { FoodsService } from './services/foods.service';
import { AuthModule } from './auth/auth.module';
import { DepartmentsController } from './controllers/department.controller';
import { DepartmentsService } from './services/department.service';
import { CitiesController } from './controllers/city.controller';
import { CitiesService } from './services/city.service';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { GeolocationService } from './services/geolocation.service';
import { GeolocationController } from './controllers/geolocation.controller';
import { EmailModule } from './notifications/email.module';
import { NotificationsController } from './controllers/notifications.controller';
import { NotificationsService } from './services/notifications.service';

@Module({
  imports: [AuthModule, EmailModule],
  controllers: [
    AppController,
    EstablishmentsController,
    FoodsController,
    DepartmentsController,
    CitiesController,
    UsersController,
    GeolocationController,
    NotificationsController,
  ],
  providers: [
    AppService,
    PrismaService,
    EstablishmentsService,
    FoodsService,
    DepartmentsService,
    CitiesService,
    UsersService,
    GeolocationService,
    NotificationsService,
  ],
})
export class AppModule {}
