import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Visit, VisitStatus } from '../../../models/visit.model';
import { VisitService } from '../../../services/visit.service';
import { SessionService } from '../../../services/session.service';
import { NavbarComponent } from '../../../shared/navbar/navbar';

type StatusFilter = 'Todas' | VisitStatus;

@Component({
  selector: 'app-visit-requests',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './visit-requests.html'
})
export class VisitRequestsComponent implements OnInit {
  private visitService = inject(VisitService);
  private session = inject(SessionService);

  loading = true;
  visits = signal<Visit[]>([]);
  activeFilter = signal<StatusFilter>('Pendiente');
  readonly statusOptions: StatusFilter[] = ['Todas', 'Pendiente', 'Aceptada', 'Rechazada'];

  filteredVisits = computed(() => {
    const filter = this.activeFilter();
    const all = this.visits();
    return filter === 'Todas' ? all : all.filter(v => v.status === filter);
  });

  pendingCount = computed(() => this.visits().filter(v => v.status === 'Pendiente').length);
  acceptedCount = computed(() => this.visits().filter(v => v.status === 'Aceptada').length);
  rejectedCount = computed(() => this.visits().filter(v => v.status === 'Rechazada').length);

  ngOnInit(): void {
    this.load();
  }

  setFilter(filter: StatusFilter): void {
    this.activeFilter.set(filter);
  }

  accept(visit: Visit): void {
    this.updateStatus(visit, 'Aceptada');
  }

  reject(visit: Visit): void {
    this.updateStatus(visit, 'Rechazada');
  }

  private updateStatus(visit: Visit, status: VisitStatus): void {
    this.visitService.updateStatus(visit.id, status).subscribe(() => this.load());
  }

  private load(): void {
    this.loading = true;
    const ownerId = this.session.currentUser().id;
    this.visitService.getByOwner(ownerId).subscribe(list => {
      this.visits.set(list);
      this.loading = false;
    });
  }
}
