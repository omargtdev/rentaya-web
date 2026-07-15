import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Property } from '../../models/property.model';
import { FavoriteService } from '../../services/favorite.service';
import { PropertyCardComponent } from '../../shared/property-card/property-card';
import { NavbarComponent } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink, PropertyCardComponent, NavbarComponent],
  templateUrl: './favorites.html'
})
export class FavoritesComponent implements OnInit {
  private favoriteService = inject(FavoriteService);

  properties: Property[] = [];
  loading = true;

  ngOnInit(): void {
    this.load();
  }

  onFavoriteToggled(): void {
    this.load();
  }

  private load(): void {
    this.loading = true;
    this.favoriteService.list().subscribe({
      next: list => {
        this.properties = list;
        this.loading = false;
      },
      error: () => {
        this.properties = [];
        this.loading = false;
      }
    });
  }
}
