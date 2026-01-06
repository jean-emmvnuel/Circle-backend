import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateMessageDto {
    @IsNotEmpty()
    @IsUUID()
    conversationId: string;

    @IsNotEmpty()
    @IsString()
    content: string;
}
