import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-visit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './visit-modal.html'
})
export class VisitModalComponent {
  @Input() propertyTitle = '';
  @Input() submitting = false;
  @Input() errorMessage = '';
  @Output() confirmed = new EventEmitter<{ date: string; time: string }>();
  @Output() closed = new EventEmitter<void>();

  readonly slots = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '17:00', '19:00'];
  selectedDate = '';
  selectedTime = '';

  readonly today = new Date().toISOString().slice(0, 10);

  selectSlot(slot: string): void {
    this.selectedTime = slot;
  }

  confirm(): void {
    if (!this.selectedDate || !this.selectedTime) return;
    this.confirmed.emit({ date: this.selectedDate, time: this.selectedTime });
  }

  close(): void {
    this.closed.emit();
  }
}
