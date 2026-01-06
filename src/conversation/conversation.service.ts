import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) { }

  async getUserConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                username: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1, // 🔥 dernier message seulement
        },
      },
    });
  }

  async getOrCreateDirectConversation(
    senderId: string,
    recipientId?: string,
    recipientEmail?: string,
  ) {
    // 🔍 Vérifier que l'expéditeur existe
    const sender = await this.prisma.user.findUnique({ where: { id: senderId } });
    if (!sender) {
      throw new Error(`Expéditeur avec l'ID ${senderId} n'existe pas`);
    }

    // ❌ Empêcher de s'envoyer un message à soi-même par ID
    if (recipientId === senderId) {
      throw new Error('Vous ne pouvez pas créer de conversation avec vous-même.');
    }

    // ❌ Empêcher de s'envoyer un message à soi-même par Email
    if (recipientEmail && recipientEmail.toLowerCase() === sender.email.toLowerCase()) {
      throw new Error('Vous ne pouvez pas créer de conversation avec votre propre adresse email.');
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

    // 🔍 Si un recipientId est fourni, vérifier qu'il existe
    if (recipientId) {
      const recipient = await this.prisma.user.findUnique({ where: { id: recipientId } });
      if (!recipient) {
        throw new Error(`Destinataire avec l'ID ${recipientId} n'existe pas`);
      }
    }

    // 🔍 chercher conversation existante
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
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (existing) return existing;

    // 🆕 créer conversation
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
      },
    });
  }

}
