import { Component, inject } from '@angular/core';
import { FormInput } from '../../components/form-input/form-input';
import { Button } from '../../atoms/button/button';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import AuthResponse from '../../interfaces/AuthResponse';
import { AuthService } from '../../services/auth-service';

function passwordMatchValidator(form: FormGroup) {
  const password = form.get('password')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  imports: [FormInput, Button, RouterLink, ReactiveFormsModule],
  standalone: true,
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private http = inject(HttpClient);
  form: FormGroup;
  errorMessages: Record<string, Record<string, string>> = {
    name: {
      required: 'Nome é obrigatório',
      minlength: 'Nome deve ter no mínimo 3 caracteres',
      maxlength: 'Nome deve ter no máximo 100 caracteres',
    },
    email: {
      required: 'Email é obrigatório',
      email: 'Email inválido',
      maxlength: 'Email deve ter no máximo 120 caracteres',
    },
    password: {
      required: 'Senha é obrigatória',
      minlength: 'Senha deve ter no mínimo 8 caracteres',
      maxlength: 'Senha deve ter no máximo 100 caracteres',
    },
    confirmPassword: {
      required: 'Confirme a senha',
      minlength: 'Senha deve ter no mínimo 8 caracteres',
      maxlength: 'Senha deve ter no máximo 100 caracteres',
      passwordMismatch: 'As senhas não coincidem',
    },
  };
  formErrorMessages: Record<string, string> = {
    passwordMismatch: 'As senhas não coincidem',
  };

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.form = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
        email: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
        confirmPassword: [
          '',
          [Validators.required, Validators.minLength(8), Validators.maxLength(100)],
        ],
      },
      { validators: passwordMatchValidator }
    );
  }

  getFormError(): string | null {
    if (!this.form.errors || !this.form.touched) return null;
    for (const key in this.form.errors)
      if (this.formErrorMessages[key]) return this.formErrorMessages[key];
    return null;
  }

  getErrorMessage(controlName: string): string | null {
    const control = this.form.get(controlName);
    if (!control || !control.errors || !control.touched) return null;
    const errors = control.errors;
    const messages = this.errorMessages[controlName];
    for (const errorKey in errors) if (messages[errorKey]) return messages[errorKey];
    return null;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    const { name, email, password, confirmPassword } = this.form.value;
    console.log(confirmPassword);
    const config = { headers: new HttpHeaders({ skipAuth: 'true' }) };
    const data = { username: name, email: email, password: password, password_again: confirmPassword };
    const url = 'http://localhost:8000/api/v1/auth/register';
    this.http.post<AuthResponse>(url, data, config).subscribe({
      next: (response) => {
        this.authService.token = response.token;
        this.authService.userId = response.id;
        this.router.navigate(['/chats']);
      },
      error: (error) => {
        alert('Erro no registro: ' + (error.error?.message || 'Erro desconhecido'));
      },
    });
  }
}
