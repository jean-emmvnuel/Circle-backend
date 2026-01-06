import { Injectable } from '@nestjs/common';


@Injectable()
export class PresenceService {
  private onlineUsers = new Map<string, number>();

  userConnected(userId: string) {
    const count = this.onlineUsers.get(userId) || 0;
    this.onlineUsers.set(userId, count + 1);
  }

  userDisconnected(userId: string) {
    const count = this.onlineUsers.get(userId) || 1;
    if (count <= 1) this.onlineUsers.delete(userId);
    else this.onlineUsers.set(userId, count - 1);
  }

  isOnline(userId: string) {
    return this.onlineUsers.has(userId);
  }
}
