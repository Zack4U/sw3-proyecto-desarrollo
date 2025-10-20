import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { EstablishmentsService } from './services/establishment.service';
import { EstablishmentsController } from './controllers/establishment.controller';
import { FoodsController } from './controllers/foods.controller';
import { FoodsService } from './services/foods.service';
import { DepartmentsController } from './controllers/department.controller';
import { DepartmentsService } from './services/department.service';
import { CitiesController } from './controllers/city.controller';
import { CitiesService } from './services/city.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    EstablishmentsController,
    FoodsController,
    DepartmentsController,
    CitiesController,
  ],
  providers: [
    AppService,
    PrismaService,
    EstablishmentsService,
    FoodsService,
    DepartmentsService,
    CitiesService,
  ],
})
export class AppModule {}
