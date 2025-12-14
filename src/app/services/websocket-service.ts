import { Injectable } from '@angular/core';
import { Observable, of, } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import IWebSocket from '../interfaces/iwebsocket';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService implements IWebSocket {
  private socket!: WebSocketSubject<any>;
  private messageQueue: any[] = [];
  public isOpen = false;

  connectSocket(url: string): Observable<any> {
    try {
      this.socket = webSocket({
        url,
        openObserver: {
          next: () => {
            console.log('WebSocket aberto');
            this.isOpen = true;
            this.messageQueue.forEach((msg) => this.socket.next(msg));
            this.messageQueue = [];
          },
        },
        closeObserver: {
          next: () => {
            console.log('WebSocket fechado');
            this.isOpen = false;
          },
        },
      });

      return this.socket.asObservable();
    } catch (err) {
      console.error('Erro ao conectar WebSocket', err);
      return of(null);
    }
  }

  sendMessage(body: Object) {
    if (this.isOpen) {
      this.socket.next(body);
    } else {
      console.log('WebSocket ainda não aberto, adicionando à fila', body);
      this.messageQueue.push(body);
    }
  }

  receiveMessages(): Observable<any> {
    return this.socket ? this.socket.asObservable() : of(null);
  }

  disconnectSocket() {
    if (this.socket) {
      this.socket.complete();
      this.isOpen = false;
      this.messageQueue = [];
    }
  }
}
