import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { LogoIcon } from '../../atoms/logo-icon/logo-icon';
import { FormInput } from '../../components/form-input/form-input';
import { Button } from '../../atoms/button/button';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import AuthResponse from '../../interfaces/AuthResponse';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormInput, Button, RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private http: HttpClient = inject(HttpClient);
  form: FormGroup;
  errorMessages: Record<string, Record<string, string>> = {
    password: {
      required: 'Senha é obrigatória',
      minlength: 'Senha deve ter no mínimo 8 caracteres',
      maxlength: 'Senha deve ter no máximo 100 caracteres',
    },
    email: {
      required: 'Email é obrigatório',
      email: 'Email inválido',
      maxlength: 'Email deve ter no máximo 120 caracteres',
    },
  };

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
    });
  }

  getErrorMessage(controlName: string): string | null {
    const control = this.form.get(controlName);
    if (!control || !control.errors || !control.touched) return null;
    const messages = this.errorMessages[controlName];
    for (const errorKey in control.errors) if (messages?.[errorKey]) return messages[errorKey];
    return null;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.value;
    const data = { email: email, password: password };
    const config = { headers: new HttpHeaders({ skipAuth: 'true' }) };
    const url = 'http://localhost:8000/api/v1/auth/login';
    this.http.post<AuthResponse>(url, data, config).subscribe({
      next: (response) => {
        this.authService.token = response.token;
        this.authService.userId = response.id;
        this.router.navigate(['/chats']);
      },
      error: (error) => {
        console.error('Login error:', error);
        alert('Falha no login. Verifique suas credenciais e tente novamente.');
      },
    });
  }
}
