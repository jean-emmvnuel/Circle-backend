import { Module, forwardRef } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { WsJwtGuard } from './guards/ws-jwt.guard';
import { DmService } from './dm/dm.service';
import { DmGateway } from './dm/dm.gateway';
import { PresenceService } from './presence.service';
import { PrismaService } from '../prisma.service';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [forwardRef(() => MessageModule)],
  providers: [
    ChatGateway,
    DmGateway,
    DmService,
    PrismaService,
    WsJwtGuard,
    PresenceService,
  ],
  exports: [ChatGateway]
})
export class SocketModule { }
