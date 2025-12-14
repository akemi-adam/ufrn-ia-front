import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.headers.has('skipAuth')) {
    const cleanReq = req.clone({ headers: req.headers.delete('skipAuth'), });
    return next(cleanReq);
  }
  
  const authService = inject(AuthService);
  const token = authService.token;
  if (token)
    req = req.clone({ setHeaders: { Authorization: `Token ${token}`, }, });
  return next(req);
};
