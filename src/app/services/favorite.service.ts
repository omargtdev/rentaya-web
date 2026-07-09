import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map, switchMap } from 'rxjs/operators';
import { Property } from '../models/property.model';
import { PropertyService } from './property.service';
import { SessionService } from './session.service';

/**
 * MOCK FAVORITE SERVICE (HU09)
 * ---------------------------------------------------------
 * Persiste en localStorage (por usuario) para que el estado de
 * favorito sobreviva a un cierre e inicio de sesión, tal como pide
 * el criterio de aceptación de HU09, incluso sin backend real.
 *
 * TODO(API): reemplazar por GET/POST/DELETE /api/favorites.
 */
@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private readonly storageKey = 'rentaya_mock_favorites';
  readonly favoriteIds = signal<Set<number>>(new Set());

  constructor(private propertyService: PropertyService, private session: SessionService) {
    this.loadFromStorage();
  }

  isFavorite(propertyId: number): boolean {
    return this.favoriteIds().has(propertyId);
  }

  toggle(propertyId: number): void {
    const current = new Set(this.favoriteIds());
    if (current.has(propertyId)) {
      current.delete(propertyId);
    } else {
      current.add(propertyId);
    }
    this.favoriteIds.set(current);
    this.saveToStorage(current);
  }

  list(): Observable<Property[]> {
    const ids = Array.from(this.favoriteIds());
    return this.propertyService.getAll().pipe(
      delay(100),
      map(all => all.filter(p => ids.includes(p.id)))
    );
  }

  private storageKeyForUser(): string {
    return `${this.storageKey}_${this.session.currentUser().id}`;
  }

  private loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(this.storageKeyForUser());
      const ids: number[] = raw ? JSON.parse(raw) : [];
      this.favoriteIds.set(new Set(ids));
    } catch {
      this.favoriteIds.set(new Set());
    }
  }

  private saveToStorage(ids: Set<number>): void {
    try {
      localStorage.setItem(this.storageKeyForUser(), JSON.stringify(Array.from(ids)));
    } catch {
      // almacenamiento no disponible: se ignora en modo mock
    }
  }

  /** Llamar cuando SessionService cambie de usuario/rol en la demo. */
  reloadForCurrentUser(): void {
    this.loadFromStorage();
  }
}
