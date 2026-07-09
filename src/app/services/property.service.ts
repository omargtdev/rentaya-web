import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Property, PropertyFilters, PropertyFormValue } from '../models/property.model';
import { MOCK_PROPERTIES } from './mock-data';
import { SessionService } from './session.service';

/**
 * MOCK PROPERTY SERVICE (HU03, HU04, HU10)
 * ---------------------------------------------------------
 * Simula la API de propiedades en memoria. Todas las operaciones
 * devuelven Observables con un pequeño delay para imitar latencia
 * de red, de modo que los componentes ya queden listos para
 * consumir HttpClient sin cambios de interfaz.
 *
 * TODO(API): reemplazar el body de cada método por llamadas a
 * GET/POST/PUT/DELETE /api/properties usando HttpClient, manteniendo
 * las mismas firmas públicas.
 */
@Injectable({ providedIn: 'root' })
export class PropertyService {
  private readonly propertiesSubject = new BehaviorSubject<Property[]>([...MOCK_PROPERTIES]);
  private nextId = MOCK_PROPERTIES.length + 1;

  constructor(private session: SessionService) {}

  getAll(filters?: PropertyFilters): Observable<Property[]> {
    return this.propertiesSubject.asObservable().pipe(
      delay(250),
      map(list => list.filter(p => p.status === 'Disponible').filter(p => this.matchesFilters(p, filters)))
    );
  }

  getByOwner(ownerId: number): Observable<Property[]> {
    return this.propertiesSubject.asObservable().pipe(
      delay(200),
      map(list => list.filter(p => p.ownerId === ownerId))
    );
  }

  getById(id: number): Observable<Property | undefined> {
    return this.propertiesSubject.asObservable().pipe(
      delay(200),
      map(list => list.find(p => p.id === id))
    );
  }

  create(value: PropertyFormValue): Observable<Property> {
    const user = this.session.currentUser();
    const property: Property = {
      ...value,
      id: this.nextId++,
      ownerId: user.id,
      ownerName: `${user.firstName} ${user.lastName}`,
      status: 'Disponible',
      createdAt: new Date().toISOString().slice(0, 10)
    };
    const updated = [property, ...this.propertiesSubject.value];
    this.propertiesSubject.next(updated);
    return of(property).pipe(delay(300));
  }

  update(id: number, value: PropertyFormValue): Observable<Property> {
    const current = this.propertiesSubject.value;
    const index = current.findIndex(p => p.id === id);
    if (index === -1) {
      return throwError(() => new Error('Propiedad no encontrada'));
    }
    const updatedProperty: Property = { ...current[index], ...value };
    const updatedList = [...current];
    updatedList[index] = updatedProperty;
    this.propertiesSubject.next(updatedList);
    return of(updatedProperty).pipe(delay(300));
  }

  delete(id: number): Observable<void> {
    const updated = this.propertiesSubject.value.filter(p => p.id !== id);
    this.propertiesSubject.next(updated);
    return of(void 0).pipe(delay(300));
  }

  private matchesFilters(property: Property, filters?: PropertyFilters): boolean {
    if (!filters) return true;
    if (filters.district && property.district !== filters.district) return false;
    if (filters.minPrice != null && property.price < filters.minPrice) return false;
    if (filters.maxPrice != null && property.price > filters.maxPrice) return false;
    return true;
  }
}
