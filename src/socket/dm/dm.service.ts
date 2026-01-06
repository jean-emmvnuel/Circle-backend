import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class DmService {
  constructor(private prisma: PrismaService) {}

  // 🔹 Créer ou récupérer une conversation DIRECT
  async getOrCreateDm(
    senderId: string,
    recipientId?: string,
    recipientEmail?: string,
  ) {
    if (!recipientId && !recipientEmail) {
      throw new ForbiddenException('Destinataire invalide');
    }

    // 1️⃣ chercher conversation existante
    const existing = await this.prisma.conversation.findFirst({
      where: {
        type: 'DIRECT',
        members: {
          some: { userId: senderId },
        },
        AND: [
          recipientId
            ? { members: { some: { userId: recipientId } } }
            : { members: { some: { invitedEmail: recipientEmail } } },
        ],
      },
    });

    if (existing) return existing;

    // 2️⃣ créer la conversation
    return this.prisma.conversation.create({
      data: {
        type: 'DIRECT',
        members: {
          create: [
            { userId: senderId },
            recipientId
              ? { userId: recipientId }
              : { invitedEmail: recipientEmail },
          ],
        },
      },
    });
  }

  // 🔹 Vérifier accès
  async canAccessConversation(userId: string, conversationId: string) {
    const member = await this.prisma.conversationMember.findFirst({
      where: {
        conversationId,
        userId,
      },
    });

    return !!member;
  }

  // 🔹 Envoi message
  async sendMessage(
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
    });
  }
}
