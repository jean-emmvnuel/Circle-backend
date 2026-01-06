import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
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
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private jwtService: JwtService, private presence: PresenceService) {}

//   utilisateur connecté
  handleConnection(client: AuthenticatedSocket) {
    this.presence.userConnected(client.user.id);
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.presence.userDisconnected(client.user.id);
  }
}
