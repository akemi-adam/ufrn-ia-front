import { Routes } from '@angular/router';
import { ChatLayout } from './layouts/chat-layout/chat-layout';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { guestGuard } from './guards/guest-guard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'chats', pathMatch: 'full' },
  {
    path: 'auth',
    component: AuthLayout,
    canActivate: [guestGuard],
    children: [
      { path: 'register', loadComponent: () => import('./pages/register/register').then(m => m.Register) },
      { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
    ],
  },
  {
    path: 'chats',
    component: ChatLayout,
    canActivate: [authGuard],
    children: [
      { path: '', loadComponent: () => import('./pages/welcome/welcome').then(m => m.Welcome) },
      { path: ':chat_id', loadComponent: () => import('./pages/chat/chat').then(m => m.Chat) },
    ],
  },
];
