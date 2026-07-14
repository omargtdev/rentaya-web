import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('rentaya_token');

  if (!token || !request.url.startsWith('/api')) {
    return next(request);
  }

  const authRequest = request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authRequest).pipe(
    catchError(error => {
      if (error.status === 401) {
        localStorage.removeItem('rentaya_token');
        localStorage.removeItem('rentaya_user');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
