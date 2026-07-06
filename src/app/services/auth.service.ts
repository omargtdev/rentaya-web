import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role: 'PROPIETARIO' | 'INQUILINO';
}

export interface RegisterResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'PROPIETARIO' | 'INQUILINO';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = '/api/users/register';

  constructor(private http: HttpClient) {}

  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(this.apiUrl, request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 409) {
          const message = error.error?.email || 'El correo ya está registrado';
          return throwError(() => new Error(message));
        }
        return throwError(() => new Error('Error en el registro. Inténtalo de nuevo.'));
      })
    );
  }
}
