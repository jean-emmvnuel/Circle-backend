import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) { }

  // 🔐 vérifier que l’utilisateur est membre
  async canAccessConversation(userId: string, conversationId: string) {
    const member = await this.prisma.conversationMember.findFirst({
      where: {
        conversationId,
        userId,
      },
    });

    if (!member) {
      throw new ForbiddenException('Accès refusé');
    }
  }

  // 📜 historique paginé
  async getConversationMessages(
    userId: string,
    conversationId: string,
    limit = 20,
    cursor?: Date,
  ) {
    await this.canAccessConversation(userId, conversationId);

    const messages = await this.prisma.message.findMany({
      where: {
        conversationId,
        ...(cursor && {
          createdAt: {
            lt: cursor, // 🔥 pagination vers le haut
          },
        }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit + 1, // 👈 pour savoir s’il reste des messages
    });

    const hasMore = messages.length > limit;
    const data = hasMore ? messages.slice(0, limit) : messages;

    return {
      messages: data.reverse(), // affichage du plus ancien au plus récent
      nextCursor: hasMore ? data[0].createdAt : null,
    };
  }
  // ✍️ créer un message
  async createMessage(
    conversationId: string,
    senderId: string,
    senderEmail: string,
    content: string,
  ) {
    return this.prisma.message.create({
      data: {
        content,
        senderId,
        senderEmail,
        conversationId,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        conversation: {
          include: {
            members: true
          }
        }
      },
    });
  }
}
