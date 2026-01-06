import { Module, forwardRef } from '@nestjs/common';
import { MessageController } from './message.controller';
import { PrismaService } from 'src/prisma.service';
import { MessageService } from './message.service';
import { SocketModule } from '../socket/socket.module';

@Module({
    imports: [forwardRef(() => SocketModule)],
    controllers: [MessageController],
    providers: [PrismaService, MessageService],
    exports: [MessageService],
})
export class MessageModule { }
