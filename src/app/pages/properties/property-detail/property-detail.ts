import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Property } from '../../../models/property.model';
import { PropertyService } from '../../../services/property.service';
import { VisitService } from '../../../services/visit.service';
import { MessageService } from '../../../services/message.service';
import { FavoriteService } from '../../../services/favorite.service';
import { SessionService } from '../../../services/session.service';
import { NavbarComponent } from '../../../shared/navbar/navbar';
import { VisitModalComponent } from '../../../shared/visit-modal/visit-modal';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, VisitModalComponent],
  templateUrl: './property-detail.html'
})
export class PropertyDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private propertyService = inject(PropertyService);
  private visitService = inject(VisitService);
  private messageService = inject(MessageService);
  private favoriteService = inject(FavoriteService);
  private session = inject(SessionService);

  property: Property | null = null;
  loading = true;
  notFound = false;
  activePhotoIndex = 0;

  showVisitModal = false;
  visitSubmitting = false;
  visitError = '';
  visitSuccess = '';

  showDeleteConfirm = false;

  get isFavorite(): boolean {
    return this.property ? this.favoriteService.isFavorite(this.property.id) : false;
  }

  get isOwnerOfProperty(): boolean {
    return !!this.property && this.property.ownerId === this.session.currentUser().id;
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.propertyService.getById(id).subscribe(property => {
      this.loading = false;
      if (!property) {
        this.notFound = true;
        return;
      }
      this.property = property;
    });
  }

  selectPhoto(index: number): void {
    this.activePhotoIndex = index;
  }

  toggleFavorite(): void {
    if (!this.property) return;
    this.favoriteService.toggle(this.property.id);
  }

  openVisitModal(): void {
    this.visitError = '';
    this.visitSuccess = '';
    this.showVisitModal = true;
  }

  closeVisitModal(): void {
    this.showVisitModal = false;
  }

  confirmVisit(payload: { date: string; time: string }): void {
    if (!this.property) return;
    this.visitSubmitting = true;
    this.visitError = '';
    this.visitService.request(this.property.id, this.property.title, this.property.ownerId, payload.date, payload.time)
      .subscribe({
        next: () => {
          this.visitSubmitting = false;
          this.showVisitModal = false;
          this.visitSuccess = 'Solicitud de visita enviada. Quedó registrada como Pendiente.';
        },
        error: (err: Error) => {
          this.visitSubmitting = false;
          this.visitError = err.message;
        }
      });
  }

  contactOwner(): void {
    if (!this.property) return;
    this.messageService.getOrCreateConversationForProperty(this.property).subscribe(conversation => {
      this.router.navigate(['/messages'], { queryParams: { conversation: conversation.id } });
    });
  }

  goToEdit(): void {
    if (!this.property) return;
    this.router.navigate(['/properties', this.property.id, 'edit']);
  }

  askDelete(): void {
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  confirmDelete(): void {
    if (!this.property) return;
    this.propertyService.delete(this.property.id).subscribe(() => {
      this.router.navigate(['/properties']);
    });
  }
}
