import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Property, PropertyFilters, PropertyFormValue } from '../models/property.model';

/**
 * Servicio de propiedades integrado con la API.
 */
@Injectable({ providedIn: 'root' })
export class PropertyService {
  private readonly baseUrl = '/api/properties';

  constructor(private http: HttpClient) {}

  getAll(filters?: PropertyFilters): Observable<Property[]> {
    let params = new HttpParams();
    if (filters?.district) params = params.set('district', filters.district);
    if (filters?.minPrice != null) params = params.set('minPrice', String(filters.minPrice));
    if (filters?.maxPrice != null) params = params.set('maxPrice', String(filters.maxPrice));
    return this.http.get<Property[]>(this.baseUrl, { params });
  }

  getByOwner(ownerId: number): Observable<Property[]> {
    return this.http.get<Property[]>(`${this.baseUrl}/me`);
  }

  getById(id: number): Observable<Property | undefined> {
    return this.http.get<Property>(`${this.baseUrl}/${id}`).pipe(
      catchError(() => of(undefined))
    );
  }

  create(value: PropertyFormValue): Observable<Property> {
    return this.http.post<Property>(this.baseUrl, value);
  }

  update(id: number, value: PropertyFormValue): Observable<Property> {
    return this.http.put<Property>(`${this.baseUrl}/${id}`, value);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
