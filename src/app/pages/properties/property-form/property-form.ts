import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { PropertyFormValue } from '../../../models/property.model';
import { NavbarComponent } from '../../../shared/navbar/navbar';
import { SessionService } from '../../../services/session.service';

const PLACEHOLDER_PHOTOS = [
  'https://picsum.photos/seed/rentaya-new1/800/600',
  'https://picsum.photos/seed/rentaya-new2/800/600',
  'https://picsum.photos/seed/rentaya-new3/800/600',
  'https://picsum.photos/seed/rentaya-new4/800/600',
  'https://picsum.photos/seed/rentaya-new5/800/600',
  'https://picsum.photos/seed/rentaya-new6/800/600',
  'https://picsum.photos/seed/rentaya-new7/800/600',
  'https://picsum.photos/seed/rentaya-new8/800/600'
];

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NavbarComponent],
  templateUrl: './property-form.html'
})
export class PropertyFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private propertyService = inject(PropertyService);
  private session = inject(SessionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = false;
  propertyId: number | null = null;
  loading = false;
  submitting = false;
  errorMessage = '';

  photos: string[] = [];

  form = this.fb.group({
    title: ['', [Validators.required]],
    district: ['', [Validators.required]],
    address: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(1)]],
    rooms: [1, [Validators.required, Validators.min(1)]],
    bathrooms: [1, [Validators.required, Validators.min(1)]],
    description: ['', [Validators.required]]
  });

  get title() { return this.form.get('title'); }
  get district() { return this.form.get('district'); }
  get address() { return this.form.get('address'); }
  get price() { return this.form.get('price'); }
  get description() { return this.form.get('description'); }

  ngOnInit(): void {
    if (!this.session.isAuthenticated) {
      this.errorMessage = 'Debes iniciar sesión como propietario para publicar una propiedad.';
      return;
    }

    if (!this.session.isOwner) {
      this.errorMessage = 'Solo los propietarios pueden publicar o editar propiedades.';
      return;
    }

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.propertyId = Number(idParam);
      this.loading = true;
      this.propertyService.getById(this.propertyId).subscribe(property => {
        this.loading = false;
        if (!property) return;
        this.form.patchValue({
          title: property.title,
          district: property.district,
          address: property.address,
          price: property.price,
          rooms: property.rooms,
          bathrooms: property.bathrooms,
          description: property.description
        });
        this.photos = [...property.photos];
      });
    }
  }

  addPhoto(): void {
    if (this.photos.length >= 8) return;
    const nextPlaceholder = PLACEHOLDER_PHOTOS[this.photos.length % PLACEHOLDER_PHOTOS.length];
    this.photos.push(nextPlaceholder);
  }

  removePhoto(index: number): void {
    this.photos.splice(index, 1);
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.session.isAuthenticated) {
      this.errorMessage = 'Debes iniciar sesión como propietario para publicar una propiedad.';
      return;
    }

    if (!this.session.isOwner) {
      this.errorMessage = 'Solo los propietarios pueden publicar o editar propiedades.';
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.photos.length < 1 || this.photos.length > 8) {
      this.errorMessage = 'Debes cargar entre 1 y 8 fotografías de la propiedad.';
      return;
    }

    this.submitting = true;
    const value: PropertyFormValue = {
      title: this.form.value.title!,
      district: this.form.value.district!,
      address: this.form.value.address!,
      price: Number(this.form.value.price),
      rooms: Number(this.form.value.rooms),
      bathrooms: Number(this.form.value.bathrooms),
      description: this.form.value.description!,
      photos: this.photos
    };

    const request$ = this.isEditMode && this.propertyId
      ? this.propertyService.update(this.propertyId, value)
      : this.propertyService.create(value);

    request$.subscribe({
      next: (property) => {
        this.submitting = false;
        this.router.navigate(['/properties', property.id]);
      },
      error: (err: unknown) => {
        this.submitting = false;
        this.errorMessage = this.getErrorMessage(err);
      }
    });
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) {
        return 'Tu sesión expiró. Vuelve a iniciar sesión.';
      }
      if (error.status === 403) {
        return error.error?.error || 'No tienes permisos para publicar o editar esta propiedad.';
      }
      if (error.status === 400 && error.error && typeof error.error === 'object') {
        const firstMessage = Object.values(error.error)[0];
        if (typeof firstMessage === 'string') return firstMessage;
      }
      return error.error?.error || 'No se pudo guardar la propiedad.';
    }

    return error instanceof Error ? error.message : 'No se pudo guardar la propiedad.';
  }
}
