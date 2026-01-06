import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ChatGateway } from './chat.gateway';
import { WsJwtGuard } from './guards/ws-jwt.guard';
import { DmService } from './dm/dm.service';
import { DmGateway } from './dm/dm.gateway';
import { PresenceService } from './presence.service';

@Module({
  imports: [JwtModule],
  providers: [
    ChatGateway,
    DmGateway,
    DmService,
    WsJwtGuard,
    PresenceService,
  ],
})
export class SocketModule {}




