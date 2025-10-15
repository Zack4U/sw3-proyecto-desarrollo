import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { EstablishmentsService } from './services/establishment.service';
import { EstablishmentsController } from './controllers/establishment.controller';
import { FoodsController } from './controllers/foods.controller';
import { FoodsService } from './services/foods.service';

@Module({
  imports: [],
  controllers: [AppController, EstablishmentsController, FoodsController],
  providers: [AppService, PrismaService, EstablishmentsService, FoodsService],
})
export class AppModule {}
