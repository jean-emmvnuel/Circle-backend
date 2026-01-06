import {
  ArgumentsHost,
  Catch,
  WsExceptionFilter,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Catch()
export class WsGlobalExceptionFilter implements WsExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();

    client.emit('ws_error', {
      message: exception?.message || 'Erreur Socket',
    });
  }
}
