import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { EstablishmentsService } from './services/establishment.service';
import { EstablishmentsController } from './controllers/establishment.controller';
import { FoodsController } from './controllers/foods.controller';
import { FoodsService } from './services/foods.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AppController, EstablishmentsController, FoodsController],
  providers: [AppService, PrismaService, EstablishmentsService, FoodsService],
})
export class AppModule {}
