import { Chat } from "../pages/chat/chat";

export interface Message {
  id?: string;
  chat?: Chat;
  content: string;
  sender: 'user' | 'ia';
  updated_at?: string;
}