import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html'
})
export class NavbarComponent {
  private session = inject(SessionService);
  private favorites = inject(FavoriteService);

  currentUser = this.session.currentUser;

  onRoleChange(event: Event): void {
    const role = (event.target as HTMLSelectElement).value as 'PROPIETARIO' | 'INQUILINO';
    this.session.setRole(role);
    this.favorites.reloadForCurrentUser();
  }
}
