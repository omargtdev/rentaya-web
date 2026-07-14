import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './profile.html'
})
export class ProfileComponent {
  private fb = inject(FormBuilder);
  private session = inject(SessionService);

  currentUser = this.session.currentUser;
  saving = false;
  saved = false;
  editingSection: 'personal' | 'security' | null = null;

  profileForm = this.fb.group({
    firstName: [this.currentUser().firstName, [Validators.required]],
    lastName: [this.currentUser().lastName, [Validators.required]],
    email: [this.currentUser().email, [Validators.required, Validators.email]],
    phone: [this.currentUser().phone, [Validators.required, Validators.pattern(/^\d{9}$/)]]
  });

  get firstName() { return this.profileForm.get('firstName'); }
  get lastName() { return this.profileForm.get('lastName'); }
  get email() { return this.profileForm.get('email'); }
  get phone() { return this.profileForm.get('phone'); }

  get userInitials(): string {
    const u = this.currentUser();
    return `${u.firstName.charAt(0)}${u.lastName.charAt(0)}`.toUpperCase();
  }

  get roleLabel(): string {
    return this.currentUser().role === 'PROPIETARIO' ? 'Propietario' : 'Inquilino';
  }

  startEdit(section: 'personal' | 'security'): void {
    this.editingSection = section;
    this.saved = false;
    // Reset form values from current user
    this.profileForm.patchValue({
      firstName: this.currentUser().firstName,
      lastName: this.currentUser().lastName,
      email: this.currentUser().email,
      phone: this.currentUser().phone
    });
  }

  cancelEdit(): void {
    this.editingSection = null;
    this.profileForm.markAsUntouched();
  }

  onSave(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.saving = true;

    // Mock: simulate API call
    setTimeout(() => {
      // Update session with new values
      const v = this.profileForm.value;
      this.session.updateUser({
        firstName: v.firstName!,
        lastName: v.lastName!,
        email: v.email!,
        phone: v.phone!
      });
      this.saving = false;
      this.saved = true;
      this.editingSection = null;
    }, 700);
  }
}
