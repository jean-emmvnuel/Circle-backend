import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UseGuards } from "@nestjs/common"
import { JwtService } from '@nestjs/jwt';
import { WsJwtGuard } from './guards/ws-jwt.guard';
import { AuthenticatedSocket } from '../ws/ws.types';
import { PresenceService } from './presence.service';



@UseGuards(WsJwtGuard)
@WebSocketGateway({
  cors: { origin: '*' },
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    private presence: PresenceService,
  ) { }

  handleConnection(client: AuthenticatedSocket) {
    try {
      // 🔐 On vérifie si le guard a déjà mis l'user ou on le fait manuellement
      const auth = client.handshake?.auth?.token || client.handshake?.headers?.authorization;
      if (!auth) {
        console.log('Connexion rejetée : Token manquant');
        client.disconnect();
        return;
      }

      const token = auth.replace('Bearer ', '');
      const payload = this.jwtService.verify(token);
      client.user = { id: payload.sub, email: payload.email, role: payload.role };

      const userId = client.user.id;
      client.join(`user:${userId}`);
      this.presence.userConnected(userId);
      console.log(`Utilisateur connecté: ${userId}`);
    } catch (err) {
      console.log('Erreur de connexion socket:', err.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.user?.id) {
      this.presence.userDisconnected(client.user.id);
      console.log(`Utilisateur déconnecté: ${client.user.id}`);
    }
  }
}





