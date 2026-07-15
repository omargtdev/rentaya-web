import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Visit, VisitStatus } from '../models/visit.model';

/**
 * Servicio de visitas integrado con la API.
 */
@Injectable({ providedIn: 'root' })
export class VisitService {
  private readonly baseUrl = '/api/visits';

  constructor(private http: HttpClient) {}

  getByOwner(ownerId: number): Observable<Visit[]> {
    return this.http.get<Visit[]>(`${this.baseUrl}/owner`);
  }

  getByTenant(tenantId: number): Observable<Visit[]> {
    return this.http.get<Visit[]>(`${this.baseUrl}/tenant`);
  }

  hasPendingForProperty(propertyId: number, tenantId: number): boolean {
    return false;
  }

  /**
   * Reglas de negocio (HU06):
   * - No se permiten fechas anteriores al día actual.
   * - Un inquilino no puede tener más de 1 solicitud pendiente por propiedad.
   */
  request(propertyId: number, propertyTitle: string, ownerId: number, date: string, time: string): Observable<Visit> {
    return this.http.post<Visit>(this.baseUrl, {
      propertyId,
      date,
      time
    });
  }

  updateStatus(id: number, status: VisitStatus): Observable<Visit> {
    return this.http.patch<Visit>(`${this.baseUrl}/${id}/status`, { status });
  }
}
