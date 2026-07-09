import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private session = inject(SessionService);

  loading = false;
  errorMessage = '';
  showPassword = false;

  // Credenciales mock hardcodeadas para demo
  readonly MOCK_EMAIL = 'emir.sanchez@correo.com';
  readonly MOCK_PASSWORD = 'Demo1234';

  loginForm = this.fb.group({
    email: [this.MOCK_EMAIL, [Validators.required, Validators.email]],
    password: [this.MOCK_PASSWORD, [Validators.required, Validators.minLength(6)]]
  });

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    // Mock login: cualquier combinación válida entra como propietario
    setTimeout(() => {
      this.loading = false;
      // Simular login como propietario por defecto
      this.session.setRole('PROPIETARIO');
      this.router.navigate(['/properties']);
    }, 800);
  }
}
