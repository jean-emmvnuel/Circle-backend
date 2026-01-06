import { IsOptional, IsEmail, IsUUID } from 'class-validator';

export class CreateDirectConversationDto {
  @IsOptional()
  @IsUUID()
  recipientId?: string;

  @IsOptional()
  @IsEmail()
  recipientEmail?: string;
}
