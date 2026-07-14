import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Visit, VisitStatus } from '../models/visit.model';
import { MOCK_VISITS } from './mock-data';
import { SessionService } from './session.service';

/**
 * MOCK VISIT SERVICE (HU06, HU07)
 * ---------------------------------------------------------
 * TODO(API): reemplazar por POST /api/visits, GET /api/visits?ownerId=,
 * PATCH /api/visits/:id/status usando HttpClient.
 */
@Injectable({ providedIn: 'root' })
export class VisitService {
  private readonly visitsSubject = new BehaviorSubject<Visit[]>([...MOCK_VISITS]);
  private nextId = MOCK_VISITS.length + 1;

  constructor(private session: SessionService) {}

  getByOwner(ownerId: number): Observable<Visit[]> {
    return this.visitsSubject.asObservable().pipe(
      delay(200),
      map(list => list.filter(v => v.ownerId === ownerId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
    );
  }

  getByTenant(tenantId: number): Observable<Visit[]> {
    return this.visitsSubject.asObservable().pipe(
      delay(200),
      map(list => list.filter(v => v.tenantId === tenantId))
    );
  }

  hasPendingForProperty(propertyId: number, tenantId: number): boolean {
    return this.visitsSubject.value.some(
      v => v.propertyId === propertyId && v.tenantId === tenantId && v.status === 'Pendiente'
    );
  }

  /**
   * Reglas de negocio (HU06):
   * - No se permiten fechas anteriores al día actual.
   * - Un inquilino no puede tener más de 1 solicitud pendiente por propiedad.
   */
  request(propertyId: number, propertyTitle: string, ownerId: number, date: string, time: string): Observable<Visit> {
    const user = this.session.currentUser();
    const today = new Date().toISOString().slice(0, 10);

    if (date < today) {
      return throwError(() => new Error('No se pueden seleccionar fechas anteriores al día actual.'));
    }
    if (this.hasPendingForProperty(propertyId, user.id)) {
      return throwError(() => new Error('Ya tienes una solicitud pendiente para esta propiedad.'));
    }

    const visit: Visit = {
      id: this.nextId++,
      propertyId,
      propertyTitle,
      tenantId: user.id,
      tenantName: `${user.firstName} ${user.lastName}`,
      ownerId,
      date,
      time,
      status: 'Pendiente',
      createdAt: new Date().toISOString()
    };
    this.visitsSubject.next([visit, ...this.visitsSubject.value]);
    return of(visit).pipe(delay(300));
  }

  updateStatus(id: number, status: VisitStatus): Observable<Visit> {
    const current = this.visitsSubject.value;
    const index = current.findIndex(v => v.id === id);
    if (index === -1) {
      return throwError(() => new Error('Solicitud no encontrada'));
    }
    const updatedVisit = { ...current[index], status };
    const updatedList = [...current];
    updatedList[index] = updatedVisit;
    this.visitsSubject.next(updatedList);
    return of(updatedVisit).pipe(delay(250));
  }
}
