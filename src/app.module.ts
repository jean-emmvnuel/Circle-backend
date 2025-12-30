import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PositionsModule } from './positions/positions.module';
import { EquipesModule } from './equipes/equipes.module';
import { JoueursModule } from './joueurs/joueurs.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [PositionsModule, EquipesModule, JoueursModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
