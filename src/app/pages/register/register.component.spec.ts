import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService, RegisterRequest, RegisterResponse } from '../../services/auth.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let registerCalls: RegisterRequest[] = [];
  let registerReturnValue: Observable<RegisterResponse> = of({} as RegisterResponse);
  let navigateCalls: string[][] = [];

  const authServiceMock = {
    register: (req: RegisterRequest): Observable<RegisterResponse> => {
      registerCalls.push(req);
      return registerReturnValue;
    }
  };

  const routerMock = {
    navigate: (args: string[]): Promise<boolean> => {
      navigateCalls.push(args);
      return Promise.resolve(true);
    }
  };

  beforeEach(async () => {
    registerCalls = [];
    navigateCalls = [];
    registerReturnValue = of({} as RegisterResponse);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('form should be valid with correct data', () => {
    component.registerForm.setValue({
      firstName: 'Omar',
      lastName: 'Gutierrez',
      email: 'omar@test.com',
      password: 'Password1',
      phone: '987654321',
      role: 'INQUILINO' as const
    });
    expect(component.registerForm.valid).toBeTruthy();
  });

  it('should show email validation error for invalid format', () => {
    const emailControl = component.registerForm.get('email');
    emailControl?.setValue('invalid-email');
    emailControl?.markAsTouched();
    fixture.detectChanges();
    expect(emailControl?.invalid).toBeTruthy();
  });

  it('should show password validation error for weak password', () => {
    const passwordControl = component.registerForm.get('password');
    passwordControl?.setValue('weak');
    passwordControl?.markAsTouched();
    fixture.detectChanges();
    expect(passwordControl?.invalid).toBeTruthy();
  });

  it('should show phone validation error for invalid format', () => {
    const phoneControl = component.registerForm.get('phone');
    phoneControl?.setValue('123');
    phoneControl?.markAsTouched();
    fixture.detectChanges();
    expect(phoneControl?.invalid).toBeTruthy();
  });

  it('role should default to INQUILINO', () => {
    expect(component.registerForm.get('role')?.value).toBe('INQUILINO');
  });

  it('should call AuthService.register on valid submit', () => {
    const mockResponse: RegisterResponse = {
      id: 1,
      firstName: 'Omar',
      lastName: 'Gutierrez',
      email: 'omar@test.com',
      phone: '987654321',
      role: 'INQUILINO'
    };
    registerReturnValue = of(mockResponse);

    component.registerForm.setValue({
      firstName: 'Omar',
      lastName: 'Gutierrez',
      email: 'omar@test.com',
      password: 'Password1',
      phone: '987654321',
      role: 'INQUILINO' as const
    });

    component.onSubmit();

    expect(registerCalls.length).toBe(1);
    expect(registerCalls[0]).toEqual({
      firstName: 'Omar',
      lastName: 'Gutierrez',
      email: 'omar@test.com',
      password: 'Password1',
      phone: '987654321',
      role: 'INQUILINO'
    } as RegisterRequest);
  });

  it('should show error message on registration failure', () => {
    registerReturnValue = throwError(() => new Error('El correo ya está registrado'));

    component.registerForm.setValue({
      firstName: 'Omar',
      lastName: 'Gutierrez',
      email: 'existing@test.com',
      password: 'Password1',
      phone: '987654321',
      role: 'INQUILINO' as const
    });

    component.onSubmit();

    expect(component.errorMessage).toBe('El correo ya está registrado');
    expect(component.loading).toBeFalsy();
  });

  it('should show success message and navigate on registration success', () => {
    const originalSetTimeout = window.setTimeout;
    (window as any).setTimeout = (fn: Function) => fn();

    const mockResponse: RegisterResponse = {
      id: 1,
      firstName: 'Omar',
      lastName: 'Gutierrez',
      email: 'omar@test.com',
      phone: '987654321',
      role: 'INQUILINO'
    };
    registerReturnValue = of(mockResponse);

    component.registerForm.setValue({
      firstName: 'Omar',
      lastName: 'Gutierrez',
      email: 'omar@test.com',
      password: 'Password1',
      phone: '987654321',
      role: 'INQUILINO' as const
    });

    component.onSubmit();

    expect(component.successMessage).toBe('Cuenta creada exitosamente. Redirigiendo al login...');
    expect(component.loading).toBeFalsy();
    expect(navigateCalls.length).toBe(1);
    expect(navigateCalls[0]).toEqual(['/login']);

    (window as any).setTimeout = originalSetTimeout;
  });
});
