import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { EstablecimientosService } from './services/establecimientos.services';
import { EstablecimientosController } from './controllers/establecimientos.controller';
import { AlimentosController } from './controllers/alimentos.controller';
import { AlimentosService } from './services/alimentos.services';

@Module({
  imports: [],
  controllers: [AppController, EstablecimientosController, AlimentosController],
  providers: [AppService, PrismaService, EstablecimientosService, AlimentosService],
})
export class AppModule {}
