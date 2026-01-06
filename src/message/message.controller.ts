import { Controller, Get, Query, Req, UseGuards, Post, Body, Inject, forwardRef } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { MessageService } from './message.service';
import { GetMessagesDto } from './dto/get-message.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { ChatGateway } from '../socket/chat.gateway';

@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessageController {
  constructor(
    private messageService: MessageService,
    @Inject(forwardRef(() => ChatGateway))
    private chatGateway: ChatGateway
  ) { }

  @Get()
  async getMessages(@Req() req, @Query() dto: GetMessagesDto) {
    return this.messageService.getConversationMessages(
      req.user.sub,
      dto.conversationId,
      dto.limit,
      dto.cursor ? new Date(dto.cursor) : undefined,
    );
  }

  @Post()
  async createMessage(@Req() req, @Body() dto: CreateMessageDto) {
    const message = await this.messageService.createMessage(
      dto.conversationId,
      req.user.sub,
      req.user.email,
      dto.content,
    );

    // 🔥 Diffusion temps réel via WebSocket
    // 1. Dans la room de la conversation
    this.chatGateway.server
      .to(`dm:${dto.conversationId}`)
      .emit('dm:new-message', message);

    // 2. Aux rooms personnelles des membres
    (message as any).conversation.members.forEach((m) => {
      if (m.userId) {
        this.chatGateway.server.to(`user:${m.userId}`).emit('dm:new-message', message);
      }
    });

    return message;
  }
}
