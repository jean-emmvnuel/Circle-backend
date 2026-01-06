import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      statut : true,
      message :"le serveur est en marche",
    };
  }
}
