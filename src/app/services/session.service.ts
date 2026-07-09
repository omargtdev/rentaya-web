import { Injectable, signal } from '@angular/core';
import { User, UserRole } from '../models/user.model';

/**
 * MOCK SESSION SERVICE
 * ---------------------------------------------------------
 * Mientras no exista integración con el backend (Spring Boot + JWT),
 * este servicio simula la sesión activa. Expone un signal `currentUser`
 * y permite alternar entre un usuario Propietario y uno Inquilino para
 * poder navegar y probar ambos flujos del prototipo.
 *
 * TODO(API): reemplazar por AuthService real que decodifique el JWT
 * devuelto por POST /api/auth/login y guarde el usuario autenticado.
 */
@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly tenantMock: User = {
    id: 10,
    firstName: 'Ana',
    lastName: 'López',
    email: 'ana.lopez@correo.com',
    phone: '987654321',
    role: 'INQUILINO'
  };

  private readonly ownerMock: User = {
    id: 2,
    firstName: 'Emir',
    lastName: 'Sánchez',
    email: 'emir.sanchez@correo.com',
    phone: '999888777',
    role: 'PROPIETARIO'
  };

  readonly currentUser = signal<User>(this.tenantMock);

  get isOwner(): boolean {
    return this.currentUser().role === 'PROPIETARIO';
  }

  get isTenant(): boolean {
    return this.currentUser().role === 'INQUILINO';
  }

  setRole(role: UserRole): void {
    this.currentUser.set(role === 'PROPIETARIO' ? this.ownerMock : this.tenantMock);
  }
}
