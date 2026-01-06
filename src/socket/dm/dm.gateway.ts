import {
  WebSocketGateway,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody
} from '@nestjs/websockets';
import { UseGuard } from "@nestjs/common"
import { WsJwtGuard } from '../guards/ws-jwt.guard';
import * as wsTypes from '../../ws/ws.types';
import { DmService } from './dm.service';
import * as dmTypes from './dm.types';

@UseGuards(WsJwtGuard)
@WebSocketGateway({ cors: { origin: '*' } })
export class DmGateway {
  constructor(private dmService: DmService) {}

  // 🔹 Créer / rejoindre un DM
  @SubscribeMessage('dm:create')
  async createDm(
    @ConnectedSocket() client: wsTypes.AuthenticatedSocket,
    @MessageBody() payload: dmTypes.CreateDmPayload,
  ) {
    const conversation = await this.dmService.getOrCreateDm(
      client.user.id,
      payload.recipientId,
      payload.recipientEmail,
    );

    const room = `dm:${conversation.id}`;
    client.join(room);

    return { conversationId: conversation.id };
  }

  // 🔹 Envoyer un message
  @SubscribeMessage('dm:send')
  async sendDm(
    @ConnectedSocket() client: wsTypes.AuthenticatedSocket,
    @MessageBody() payload: dmTypes.SendDmMessagePayload,
  ) {
    const allowed = await this.dmService.canAccessConversation(
      client.user.id,
      payload.conversationId,
    );

    if (!allowed) return;

    const message = await this.dmService.sendMessage(
      payload.conversationId,
      client.user.id,
      client.user.email,
      payload.content,
    );

    const room = `dm:${payload.conversationId}`;
    client.to(room).emit('dm:new-message', message);

    return message;
  }
}
