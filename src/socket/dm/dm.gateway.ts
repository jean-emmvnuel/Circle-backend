import {
  WebSocketGateway,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody
} from '@nestjs/websockets';
import { UseGuards, Inject, forwardRef } from "@nestjs/common"
import { WsJwtGuard } from '../guards/ws-jwt.guard';
import * as wsTypes from '../../ws/ws.types';
import { DmService } from './dm.service';
import { MessageService } from '../../message/message.service';
import * as dmTypes from './dm.types';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';



@WebSocketGateway({ cors: { origin: '*' } })
@UseGuards(WsJwtGuard)
export class DmGateway {
  @WebSocketServer()
  private server: Server;

  constructor(
    private dmService: DmService,
    @Inject(forwardRef(() => MessageService))
    private messageService: MessageService
  ) { }

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

    // 🔥 SYNC SOCKET
    // 🔔 Notifier tous les membres identifiés (émetteur et destinataire)
    conversation.members.forEach((m) => {
      if (m.userId) {
        this.server.to(`user:${m.userId}`).emit('conversation:new', conversation);
      }
    });

    return { conversationId: conversation.id };
  }

  @SubscribeMessage('dm:send')
  async sendMessage(
    @ConnectedSocket() client: wsTypes.AuthenticatedSocket,
    @MessageBody() payload: { conversationId: string; content: string },
  ) {
    // 🔐 sécurité
    const allowed = await this.dmService.canSendMessage(
      client.user.id,
      payload.conversationId,
    );

    if (!allowed) {
      return; // ou throw WsException
    }

    // 💾 sauvegarde
    const message = await this.messageService.createMessage(
      payload.conversationId,
      client.user.id,
      client.user.email,
      payload.content,
    );

    const room = `dm:${payload.conversationId}`;

    // 🔥 Diffusion temps réel
    // 1. Dans la room de la conversation (pour ceux qui ont le chat ouvert)
    this.server.to(room).emit('dm:new-message', message);

    // 2. Aux rooms personnelles des membres (pour mettre à jour la liste des conversations)
    (message as any).conversation.members.forEach((m) => {
      if (m.userId) {
        this.server.to(`user:${m.userId}`).emit('dm:new-message', message);
      }
    });

    return message;
  }

  @SubscribeMessage('dm:join')
  joinDm(
    @ConnectedSocket() client: wsTypes.AuthenticatedSocket,
    @MessageBody() conversationId: string,
  ) {
    client.join(`dm:${conversationId}`);
  }
}
