import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Property, PropertyFilters } from '../../../models/property.model';
import { PropertyService } from '../../../services/property.service';
import { SessionService } from '../../../services/session.service';
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

  districts = DISTRICTS;
  properties: Property[] = [];
  loading = true;

  filters: PropertyFilters = { district: '', minPrice: null, maxPrice: null };

  get isOwner(): boolean {
    return this.session.isOwner;
  }

  ngOnInit(): void {
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
    const activeFilters: PropertyFilters = {
      district: this.filters.district || undefined,
      minPrice: this.filters.minPrice ?? null,
      maxPrice: this.filters.maxPrice ?? null
    };
    this.propertyService.getAll(activeFilters).subscribe(list => {
      this.properties = list;
      this.loading = false;
    });
  }
}
