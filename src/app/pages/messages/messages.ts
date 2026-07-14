import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChatMessage, Conversation } from '../../models/message.model';
import { MessageService } from '../../services/message.service';
import { SessionService } from '../../services/session.service';
import { NavbarComponent } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './messages.html'
})
export class MessagesComponent implements OnInit {
  private messageService = inject(MessageService);
  private session = inject(SessionService);
  private route = inject(ActivatedRoute);

  conversations: Conversation[] = [];
  messages: ChatMessage[] = [];
  activeConversation: Conversation | null = null;
  draft = '';
  sendError = '';
  loading = true;

  get currentUserId(): number {
    return this.session.currentUser().id;
  }

  ngOnInit(): void {
    this.messageService.getConversations().subscribe(list => {
      this.conversations = list;
      this.loading = false;

      const requestedId = this.route.snapshot.queryParamMap.get('conversation');
      const initial = requestedId ? list.find(c => c.id === requestedId) : list[0];
      if (initial) {
        this.selectConversation(initial);
      }
    });
  }

  selectConversation(conversation: Conversation): void {
    this.activeConversation = conversation;
    this.sendError = '';
    this.messageService.getMessages(conversation.id).subscribe(msgs => {
      this.messages = msgs;
    });
  }

  otherPartyName(conversation: Conversation): string {
    return conversation.ownerId === this.currentUserId ? conversation.tenantName : conversation.ownerName;
  }

  send(): void {
    const content = this.draft.trim();
    if (!content) {
      this.sendError = 'Escribe un mensaje antes de enviar';
      return;
    }
    if (!this.activeConversation) return;

    this.sendError = '';
    this.messageService.send(this.activeConversation.id, content).subscribe(message => {
      this.messages = [...this.messages, message];
      this.draft = '';
    });
  }
}
