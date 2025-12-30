import { Module } from '@nestjs/common';
import { JoueursService } from './joueurs.service';
import { PrismaService } from 'src/prisma.service';
import { JoueursController } from './joueurs.controller';

@Module({
  providers: [JoueursService, PrismaService],
  controllers: [JoueursController]
})
export class JoueursModule {}
