import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AskInput } from '../../components/ask-input/ask-input';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Chat from '../../interfaces/chat';
import { EventStartChatService } from '../../services/event-start-chat-service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-welcome',
  imports: [MatIconModule, AskInput],
  templateUrl: './welcome.html',
})
export class Welcome {
  private http: HttpClient = inject(HttpClient);
  message: string = '';

  constructor(private router: Router, private eventStartChatService: EventStartChatService) {}

  startNewChat: () => Observable<void> = (): Observable<void> => {
    const msg = this.message;
    this.http
      .post('http://localhost:8000/api/v1/chat/chats/', {
        message: msg,
      })
      .subscribe((response) => {
        this.eventStartChatService.emit({ canUpdateChatList: true, messageContent: msg });
        this.router.navigate(['/chats', (response as Chat).id]);
      });
    return of(void 0);
  };
}
