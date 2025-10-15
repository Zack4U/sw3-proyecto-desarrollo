import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { EstablecimientosService } from './services/establecimientos.services';
import { EstablecimientosController } from './controllers/establecimientos.controller';

@Module({
  imports: [],
  controllers: [AppController, EstablecimientosController],
  providers: [AppService, PrismaService, EstablecimientosService],
})
export class AppModule {}
