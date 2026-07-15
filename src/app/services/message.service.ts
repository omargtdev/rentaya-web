import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatMessage, Conversation } from '../models/message.model';
import { Property } from '../models/property.model';

/**
 * Servicio de conversaciones y mensajes integrado con la API.
 */
@Injectable({ providedIn: 'root' })
export class MessageService {
  private readonly baseUrl = '/api/conversations';

  constructor(private http: HttpClient) {}

  getConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(this.baseUrl);
  }

  getMessages(conversationId: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.baseUrl}/${conversationId}/messages`);
  }

  /** Devuelve la conversación existente para una propiedad + usuario actual, o crea una nueva. */
  getOrCreateConversationForProperty(property: Property): Observable<Conversation> {
    return this.http.post<Conversation>(this.baseUrl, { propertyId: property.id });
  }

  send(conversationId: string, content: string): Observable<ChatMessage> {
    return this.http.post<ChatMessage>(`${this.baseUrl}/${conversationId}/messages`, { content });
  }
}
