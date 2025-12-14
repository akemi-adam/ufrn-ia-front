import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface ChatEvent {
  canUpdateChatList: boolean;
  messageContent?: string;
}

@Injectable({
  providedIn: 'root',
})
export class EventStartChatService {
  private eventSource: Subject<any> = new Subject<any>();
  event$ = this.eventSource.asObservable();

  emit(data: ChatEvent) {
    this.eventSource.next(data);
  }
}
