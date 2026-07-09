export interface ChatMessage {
  id: number;
  conversationId: string;
  senderId: number;
  senderName: string;
  content: string;
  sentAt: string;
}

export interface Conversation {
  id: string;
  propertyId: number;
  propertyTitle: string;
  ownerId: number;
  ownerName: string;
  tenantId: number;
  tenantName: string;
  lastMessage: string;
  lastMessageAt: string;
}
