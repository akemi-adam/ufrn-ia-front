import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  get token(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem('authToken');
  }

  get userId(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem('userId');
  }

  set token(value: string | null) {
    if (!isPlatformBrowser(this.platformId)) return;
    if (value) {
      localStorage.setItem('authToken', value);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  set userId(value: string | null) {
    if (!isPlatformBrowser(this.platformId)) return;
    if (value) {
      localStorage.setItem('userId', value);
    } else {
      localStorage.removeItem('userId');
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  logout(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
  }
}
