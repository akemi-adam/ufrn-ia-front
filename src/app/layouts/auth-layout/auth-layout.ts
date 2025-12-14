import { Component } from '@angular/core';
import { AuthHeader } from '../../components/auth-header/auth-header';
import { AuthFooter } from '../../components/auth-footer/auth-footer';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [AuthHeader, AuthFooter, RouterOutlet],
  templateUrl: './auth-layout.html',
})
export class AuthLayout {}
