import { Component } from '@angular/core';
import { SideBar } from '../../components/side-bar/side-bar';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-chat-layout',
  imports: [SideBar, MatIconModule, RouterOutlet],
  templateUrl: './chat-layout.html',
})
export class ChatLayout {
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
