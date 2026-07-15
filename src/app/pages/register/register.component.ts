import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, RegisterRequest } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  standalone: true
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  loading = false;
  successMessage = '';
  errorMessage = '';
  showPassword = false;

  registerForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/)]],
    role: ['INQUILINO' as 'PROPIETARIO' | 'INQUILINO', [Validators.required]]
  });

  get firstName() { return this.registerForm.get('firstName'); }
  get lastName() { return this.registerForm.get('lastName'); }
  get email() { return this.registerForm.get('email'); }
  get phone() { return this.registerForm.get('phone'); }
  get password() { return this.registerForm.get('password'); }
  get role() { return this.registerForm.get('role'); }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const request: RegisterRequest = this.registerForm.value as RegisterRequest;

    this.authService.register(request)
      .subscribe({
        next: () => {
          this.loading = false;
          this.successMessage = 'Cuenta creada exitosamente. Redirigiendo al login...';
          this.cdr.detectChanges();
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err: Error) => {
          this.loading = false;
          this.errorMessage = err.message;
          this.cdr.detectChanges();
        }
      });
  }
}
