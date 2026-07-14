import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Property } from '../models/property.model';

/**
 * Servicio de favoritos integrado con la API.
 */
@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private readonly baseUrl = '/api/favorites';
  readonly favoriteIds = signal<Set<number>>(new Set());

  constructor(private http: HttpClient) {}

  isFavorite(propertyId: number): boolean {
    return this.favoriteIds().has(propertyId);
  }

  toggle(propertyId: number): void {
    const current = new Set(this.favoriteIds());
    if (current.has(propertyId)) {
      current.delete(propertyId);
      this.favoriteIds.set(current);
      this.http.delete<void>(`${this.baseUrl}/${propertyId}`).subscribe({
        error: () => this.reloadForCurrentUser()
      });
    } else {
      current.add(propertyId);
      this.favoriteIds.set(current);
      this.http.post<void>(`${this.baseUrl}/${propertyId}`, {}).subscribe({
        error: () => this.reloadForCurrentUser()
      });
    }
  }

  list(): Observable<Property[]> {
    return this.http.get<Property[]>(this.baseUrl).pipe(
      tap(properties => this.favoriteIds.set(new Set(properties.map(p => p.id)))),
      catchError(() => {
        this.favoriteIds.set(new Set());
        return of([]);
      })
    );
  }

  reloadForCurrentUser(): void {
    this.list().subscribe();
  }
}
