import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { ChatMessage, Conversation } from '../models/message.model';
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from './mock-data';
import { SessionService } from './session.service';
import { Property } from '../models/property.model';

/**
 * MOCK MESSAGE SERVICE (HU08)
 * ---------------------------------------------------------
 * TODO(API): reemplazar por GET /api/conversations, GET /api/messages?conversationId=,
 * POST /api/messages. Considerar WebSocket/polling para tiempo real.
 */
@Injectable({ providedIn: 'root' })
export class MessageService {
  private readonly conversationsSubject = new BehaviorSubject<Conversation[]>([...MOCK_CONVERSATIONS]);
  private readonly messagesSubject = new BehaviorSubject<ChatMessage[]>([...MOCK_MESSAGES]);
  private nextConversationId = MOCK_CONVERSATIONS.length + 1;
  private nextMessageId = MOCK_MESSAGES.length + 1;

  constructor(private session: SessionService) {}

  getConversations(): Observable<Conversation[]> {
    const user = this.session.currentUser();
    return this.conversationsSubject.asObservable().pipe(
      delay(200),
      map(list =>
        list
          .filter(c => c.ownerId === user.id || c.tenantId === user.id)
          .sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt))
      )
    );
  }

  getMessages(conversationId: string): Observable<ChatMessage[]> {
    return this.messagesSubject.asObservable().pipe(
      delay(150),
      map(list => list.filter(m => m.conversationId === conversationId).sort((a, b) => a.sentAt.localeCompare(b.sentAt)))
    );
  }

  /** Devuelve la conversación existente para una propiedad + usuario actual, o crea una nueva. */
  getOrCreateConversationForProperty(property: Property): Observable<Conversation> {
    const user = this.session.currentUser();
    const existing = this.conversationsSubject.value.find(
      c => c.propertyId === property.id && (c.tenantId === user.id || c.ownerId === user.id)
    );
    if (existing) {
      return of(existing).pipe(delay(150));
    }
    const conversation: Conversation = {
      id: `c${this.nextConversationId++}`,
      propertyId: property.id,
      propertyTitle: property.title,
      ownerId: property.ownerId,
      ownerName: property.ownerName,
      tenantId: user.id,
      tenantName: `${user.firstName} ${user.lastName}`,
      lastMessage: '',
      lastMessageAt: new Date().toISOString()
    };
    this.conversationsSubject.next([conversation, ...this.conversationsSubject.value]);
    return of(conversation).pipe(delay(150));
  }

  send(conversationId: string, content: string): Observable<ChatMessage> {
    const user = this.session.currentUser();
    const message: ChatMessage = {
      id: this.nextMessageId++,
      conversationId,
      senderId: user.id,
      senderName: `${user.firstName} ${user.lastName}`,
      content,
      sentAt: new Date().toISOString()
    };
    this.messagesSubject.next([...this.messagesSubject.value, message]);

    const conversations = this.conversationsSubject.value.map(c =>
      c.id === conversationId ? { ...c, lastMessage: content, lastMessageAt: message.sentAt } : c
    );
    this.conversationsSubject.next(conversations);

    return of(message).pipe(delay(150));
  }
}
