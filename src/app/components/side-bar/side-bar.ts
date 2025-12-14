import { Component, inject, signal } from '@angular/core';
import { WhiteLogoIcon } from '../../atoms/white-logo-icon/white-logo-icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Chat from '../../interfaces/chat';
import { EventStartChatService } from '../../services/event-start-chat-service';

@Component({
  selector: 'app-side-bar',
  imports: [WhiteLogoIcon, MatSlideToggleModule, MatIconModule, RouterLink],
  templateUrl: './side-bar.html',
})
export class SideBar {
  private http = inject(HttpClient);
  chats = signal<Chat[]>([]);

  constructor(private eventStartChatService: EventStartChatService) {
    this.eventStartChatService.event$.subscribe(({ canUpdateChatList }) => {
      // Dá pra otimizar isso, passando o novo chat no payload do evento
      if (canUpdateChatList) this.fetchChats();
    });
  }

  ngOnInit() {
    this.fetchChats();
  }

  fetchChats() {
    this.http.get<Chat[]>('http://localhost:8000/api/v1/chat/chats').subscribe((chats) => {
      this.chats.set(chats);
    });
  }
}
