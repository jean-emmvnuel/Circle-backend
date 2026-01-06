import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class DmService {
  constructor(private prisma: PrismaService) { }

  // 🔹 Créer ou récupérer une conversation DIRECT
  async getOrCreateDm(
    senderId: string,
    recipientId?: string,
    recipientEmail?: string,
  ) {
    if (!recipientId && !recipientEmail) {
      throw new ForbiddenException('Destinataire invalide');
    }

    // 🔍 Récupérer les infos de l'expéditeur pour vérifier l'email
    const sender = await this.prisma.user.findUnique({ where: { id: senderId } });
    if (!sender) {
      throw new ForbiddenException('Expéditeur inconnu');
    }

    // ❌ Empêcher l'auto-messagerie par ID
    if (recipientId === senderId) {
      throw new ForbiddenException('Auto-messagerie interdite');
    }

    // ❌ Empêcher l'auto-messagerie par Email
    if (recipientEmail && recipientEmail.toLowerCase() === sender.email.toLowerCase()) {
      throw new ForbiddenException('Auto-messagerie interdite (email)');
    }

    // 🔄 Tenter de récupérer l'ID si l'email existe déjà en base
    if (!recipientId && recipientEmail) {
      const userByEmail = await this.prisma.user.findUnique({
        where: { email: recipientEmail.toLowerCase() }
      });
      if (userByEmail) {
        recipientId = userByEmail.id;
        recipientEmail = undefined;
      }
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
      include: {
        members: true,
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        }
      }
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
      include: {
        members: true,
        messages: true,
      }
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
  async canSendMessage(userId: string, conversationId: string) {
    const member = await this.prisma.conversationMember.findFirst({
      where: {
        conversationId,
        userId,
      },
    });

    return !!member;
  }
}
