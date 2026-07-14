import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
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
  private router = inject(Router);

  currentUser = this.session.currentUser;
  profileDropdownOpen = signal(false);

  onRoleChange(event: Event): void {
    const role = (event.target as HTMLSelectElement).value as 'PROPIETARIO' | 'INQUILINO';
    this.session.setRole(role);
    this.favorites.reloadForCurrentUser();
  }

  toggleProfileDropdown(): void {
    this.profileDropdownOpen.update(v => !v);
  }

  closeDropdown(): void {
    this.profileDropdownOpen.set(false);
  }

  goToProfile(): void {
    this.profileDropdownOpen.set(false);
    this.router.navigate(['/profile']);
  }

  logout(): void {
    this.profileDropdownOpen.set(false);
    this.session.logout();
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('#profile-menu-btn') && !target.closest('#profile-dropdown')) {
      this.profileDropdownOpen.set(false);
    }
  }
}
