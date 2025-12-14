import { Observable } from 'rxjs';

export default interface IWebSocket {
  isOpen: boolean;
  connectSocket(url: string): Observable<any>;
  receiveMessages(): Observable<any>;
  sendMessage(body: Object): void;
  disconnectSocket(): void;
}
