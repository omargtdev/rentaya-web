import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Property, PropertyFilters } from '../../../models/property.model';
import { PropertyService } from '../../../services/property.service';
import { SessionService } from '../../../services/session.service';
import { FavoriteService } from '../../../services/favorite.service';
import { DISTRICTS } from '../../../services/mock-data';
import { PropertyCardComponent } from '../../../shared/property-card/property-card';
import { NavbarComponent } from '../../../shared/navbar/navbar';

@Component({
  selector: 'app-properties-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PropertyCardComponent, NavbarComponent],
  templateUrl: './properties-list.html'
})
export class PropertiesListComponent implements OnInit {
  private propertyService = inject(PropertyService);
  private session = inject(SessionService);
  private favoriteService = inject(FavoriteService);

  districts = DISTRICTS;
  properties: Property[] = [];
  loading = true;
  errorMessage = '';

  filters: PropertyFilters = { district: '', minPrice: null, maxPrice: null };

  get isOwner(): boolean {
    return this.session.isOwner;
  }

  ngOnInit(): void {
    if (this.session.isAuthenticated) {
      this.favoriteService.reloadForCurrentUser();
    }
    this.load();
  }

  applyFilters(): void {
    this.load();
  }

  clearFilters(): void {
    this.filters = { district: '', minPrice: null, maxPrice: null };
    this.load();
  }

  private load(): void {
    this.loading = true;
    this.errorMessage = '';
    const activeFilters: PropertyFilters = {
      district: this.filters.district || undefined,
      minPrice: this.filters.minPrice ?? null,
      maxPrice: this.filters.maxPrice ?? null
    };
    this.propertyService.getAll(activeFilters).subscribe({
      next: list => {
        this.properties = list;
        this.loading = false;
      },
      error: () => {
        this.properties = [];
        this.errorMessage = 'No se pudieron cargar las propiedades. Intenta nuevamente o revisa el backend.';
        this.loading = false;
      }
    });
  }
}
