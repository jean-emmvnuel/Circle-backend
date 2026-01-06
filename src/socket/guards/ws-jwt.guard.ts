import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();
    let token = client.handshake?.auth?.token || client.handshake?.headers?.authorization;

    if (!token) {
      throw new UnauthorizedException('Token manquant');
    }

    // Gestion du préfixe "Bearer " si présent
    if (token.startsWith('Bearer ')) {
      token = token.split(' ')[1];
    }

    try {
      const payload = this.jwtService.verify(token);

      client.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role
      };

      return true;
    } catch (err) {
      console.log('Erreur JWT Socket:', err.message);
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }
}
