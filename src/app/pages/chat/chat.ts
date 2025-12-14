import { Component, inject, Inject, signal, ViewChild, ElementRef } from '@angular/core';
import IWebSocket from '../../interfaces/iwebsocket';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Message as IMessage } from '../../interfaces/message';
import { Message } from '../../components/message/message';
import { AskInput } from '../../components/ask-input/ask-input';
import { WebsocketService } from '../../services/websocket-service';
import { Observable, of, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-chat',
  imports: [Message, AskInput],
  templateUrl: './chat.html',
  providers: [
    {
      provide: 'IWebSocket',
      useClass: WebsocketService,
    },
  ],
})
export class Chat {
  private http: HttpClient = inject(HttpClient);
  messages = signal<IMessage[]>([]);
  chatId: string = '';
  message: string = '';
  partialAnswer: string = '';
  isSending = signal(false);
  isWaitingForAnswer = signal(false);
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef<HTMLDivElement>;
  private socketSubscription!: Subscription;

  constructor(
    @Inject('IWebSocket') public webSocketService: IWebSocket,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const chatId: string = params['chat_id'];
      if (chatId) {
        this.fetchMessages(chatId);
        this.chatId = chatId;
        this.initializeWebSocket(chatId);
        this.fetchFirstMessage();
      }
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
      console.log('WebSocket desconectado');
    }
  }

  private initializeWebSocket(chatId: string): void {
    if (!this.authService.token) {
      console.warn('Token ainda não disponível, abortando conexão WS');
      return;
    }

    const socket$ = this.webSocketService.connectSocket(
      `ws://localhost:8000/ws/chat/${chatId}/?token=${this.authService.token}`
    );

    this.socketSubscription = socket$.subscribe((data: any) => {
      this.fetchAnswer(data);
    });
  }

  fetchAnswer(data: any): void {
    if (!data || !data.message) return;
    if (this.isWaitingForAnswer()) this.isWaitingForAnswer.set(false);
    this.partialAnswer += data.message;
    this.updateStreamingMessage();
    this.isSending.set(false);
  }

  private updateStreamingMessage(): void {
    const currentMessages = this.messages();
    if (currentMessages.length > 0 && currentMessages[currentMessages.length - 1].sender === 'ia') {
      const updated = {
        ...currentMessages[currentMessages.length - 1],
        content: this.partialAnswer,
      };
      this.messages.set([...currentMessages.slice(0, -1), updated]);
    } else {
      this.messages.update((prev) => [...prev, { sender: 'ia', content: this.partialAnswer }]);
    }
    this.scrollToBottom();
  }

  fetchMessages(id: string): void {
    this.http
      .get(`http://localhost:8000/api/v1/chat/chats/${id}/messages`)
      .subscribe((response) => {
        this.messages.set(response as IMessage[]);
      });
  }

  fetchFirstMessage(): void {
    this.http
      .get<IMessage>(`http://localhost:8000/api/v1/chat/chats/${this.chatId}/messages/first`)
      .subscribe((response: IMessage) => {
        if (this.isFirstMessage()) {
          this.message = response.content;
          this.sendMessage();
        }
      });
  }

  isFirstMessage(): boolean {
    return this.messages().length === 1 && this.messages()[0].sender === 'user';
  }

  sendMessage: () => Observable<void> = (): Observable<void> => {
    this.isSending.set(true);
    this.isWaitingForAnswer.set(true);
    if (!this.isFirstMessage()) {
      this.http
        .post(`http://localhost:8000/api/v1/chat/messages/`, {
          content: this.message,
          chat: this.chatId,
          sender: 'user',
        })
        .subscribe();
    }

    this.webSocketService.sendMessage({ message: this.message, chat_id: this.chatId });
    if (!this.isFirstMessage())
      this.messages.update((prev) => [...prev, { sender: 'user', content: this.message }]);
    this.message = '';
    this.partialAnswer = '';
    this.scrollToBottom();
    return of(void 0);
  };

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Erro ao rolar para o final do container:', err);
    }
  }
}
