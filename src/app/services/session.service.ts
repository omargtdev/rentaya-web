import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { User, UserRole } from '../models/user.model';
import { AuthService, LoginRequest, LoginResponse, UpdateProfileRequest } from './auth.service';

/**
 * Servicio de sesión integrado con la API.
 * Persiste JWT y usuario en localStorage para mantener la sesión al recargar.
 */
@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly emptyUser: User = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'INQUILINO'
  };

  readonly currentUser = signal<User>(this.readStoredUser());

  constructor(private authService: AuthService) {}

  get isOwner(): boolean {
    return this.currentUser().role === 'PROPIETARIO';
  }

  get isTenant(): boolean {
    return this.currentUser().role === 'INQUILINO';
  }

  get isAuthenticated(): boolean {
    return !!this.token;
  }

  get token(): string | null {
    return localStorage.getItem('rentaya_token');
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.authService.login(request).pipe(
      tap(response => this.storeSession(response))
    );
  }

  refreshCurrentUser(): Observable<User> {
    return this.authService.me().pipe(
      tap(user => this.storeUser(user))
    );
  }

  updateUser(partial: UpdateProfileRequest): Observable<User> {
    return this.authService.updateMe(partial).pipe(
      tap(user => this.storeUser(user))
    );
  }

  clearSession(): void {
    localStorage.removeItem('rentaya_token');
    localStorage.removeItem('rentaya_user');
    this.currentUser.set(this.emptyUser);
  }

  setRole(role: UserRole): void {
    this.currentUser.update(user => ({ ...user, role }));
  }

  logout(): void {
    if (this.token) {
      this.authService.logout().subscribe({ error: () => undefined });
    }
    this.clearSession();
  }

  private storeSession(response: LoginResponse): void {
    localStorage.setItem('rentaya_token', response.token);
    this.storeUser(response.user);
  }

  private storeUser(user: User): void {
    localStorage.setItem('rentaya_user', JSON.stringify(user));
    this.currentUser.set(user);
  }

  private readStoredUser(): User {
    try {
      const raw = localStorage.getItem('rentaya_user');
      return raw ? JSON.parse(raw) as User : this.emptyUser;
    } catch {
      return this.emptyUser;
    }
  }
}
