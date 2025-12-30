import { Module } from '@nestjs/common';
import { EquipesService } from './equipes.service';
import { EquipesController } from './equipes.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [EquipesService, PrismaService],
  controllers: [EquipesController]
})
export class EquipesModule { }
