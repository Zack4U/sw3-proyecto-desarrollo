import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { EstablecimientosService } from './services/establecimientos.services';
import { EstablecimientosController } from './controllers/establecimientos.controller';
import { FoodsController } from './controllers/foods.controller';
import { FoodsService } from './services/foods.services';

@Module({
  imports: [],
  controllers: [AppController, EstablecimientosController, FoodsController],
  providers: [AppService, PrismaService, EstablecimientosService, FoodsService],
})
export class AppModule {}
