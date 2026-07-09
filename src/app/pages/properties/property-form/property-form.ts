import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { PropertyFormValue } from '../../../models/property.model';
import { NavbarComponent } from '../../../shared/navbar/navbar';

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
      error: (err: Error) => {
        this.submitting = false;
        this.errorMessage = err.message;
      }
    });
  }
}
