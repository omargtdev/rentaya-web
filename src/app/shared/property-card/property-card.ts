import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Property } from '../../models/property.model';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './property-card.html'
})
export class PropertyCardComponent {
  @Input({ required: true }) property!: Property;
  @Output() favoriteToggled = new EventEmitter<number>();

  private favorites = inject(FavoriteService);

  get isFavorite(): boolean {
    return this.favorites.isFavorite(this.property.id);
  }

  toggleFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.favorites.toggle(this.property.id);
    this.favoriteToggled.emit(this.property.id);
  }
}
