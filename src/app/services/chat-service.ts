import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  baseUrl = 'http://localhost:3000/api/v1';
  constructor(private http: HttpClient) {}
  
  findAll() {
    return this.http.get(`${this.baseUrl}/chats`);
  }
}
