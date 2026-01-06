

export interface CreateDmPayload {
  recipientId?: string;
  recipientEmail?: string;
}

export interface SendDmMessagePayload {
  conversationId: string;
  content: string;
}
