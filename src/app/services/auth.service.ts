import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import { ConfigService } from './config.service';

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

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export type UpdateProfileRequest = Pick<User, 'firstName' | 'lastName' | 'email' | 'phone'>;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private get registerUrl(): string { return `${this.config.apiUrl}/api/users/register`; }
  private get loginUrl(): string { return `${this.config.apiUrl}/api/auth/login`; }
  private get logoutUrl(): string { return `${this.config.apiUrl}/api/auth/logout`; }
  private get meUrl(): string { return `${this.config.apiUrl}/api/users/me`; }

  constructor(private http: HttpClient, private config: ConfigService) {}

  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(this.registerUrl, request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 409) {
          const message = error.error?.email || 'El correo ya está registrado';
          return throwError(() => new Error(message));
        }
        if (error.status === 400 && error.error && typeof error.error === 'object') {
          const firstMessage = Object.values(error.error)[0];
          return throwError(() => new Error(typeof firstMessage === 'string' ? firstMessage : 'Datos inválidos.'));
        }
        return throwError(() => new Error('Error en el registro. Inténtalo de nuevo.'));
      })
    );
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, request);
  }

  logout(): Observable<void> {
    return this.http.post<void>(this.logoutUrl, {});
  }

  me(): Observable<User> {
    return this.http.get<User>(this.meUrl);
  }

  updateMe(request: UpdateProfileRequest): Observable<User> {
    return this.http.patch<User>(this.meUrl, request);
  }
}
