import { Controller, Get, UseGuards, Req, Post, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { ConversationService } from './conversation.service';
import { CreateDirectConversationDto } from './dto/create-direct.dto';

@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ConversationController {
  constructor(private conversationService: ConversationService) { }

  @Get()
  async getMyConversations(@Req() req) {
    return this.conversationService.getUserConversations(req.user.sub);
  }

  @Post('direct')
  @UseGuards(JwtAuthGuard)
  async createDirectConversation(@Req() req, @Body() dto: CreateDirectConversationDto,) {
    return this.conversationService.getOrCreateDirectConversation(
      req.user.sub,
      dto.recipientId,
      dto.recipientEmail,
    );
  }
}
