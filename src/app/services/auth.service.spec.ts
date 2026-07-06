import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService, RegisterRequest, RegisterResponse } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a user and return response', () => {
    const request: RegisterRequest = {
      firstName: 'Omar',
      lastName: 'Gutierrez',
      email: 'omar@test.com',
      password: 'Password1',
      phone: '987654321',
      role: 'INQUILINO'
    };

    const mockResponse: RegisterResponse = {
      id: 1,
      firstName: 'Omar',
      lastName: 'Gutierrez',
      email: 'omar@test.com',
      phone: '987654321',
      role: 'INQUILINO'
    };

    service.register(request).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/users/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(mockResponse);
  });

  it('should throw error with message on 409 conflict', () => {
    const request: RegisterRequest = {
      firstName: 'Omar',
      lastName: 'Gutierrez',
      email: 'omar@test.com',
      password: 'Password1',
      phone: '987654321',
      role: 'INQUILINO'
    };

    return new Promise<void>((resolve, reject) => {
      service.register(request).subscribe({
        next: () => reject(new Error('should have thrown an error')),
        error: (err) => {
          expect(err.message).toBe('El correo ya está registrado');
          resolve();
        }
      });

      const req = httpMock.expectOne('/api/users/register');
      req.flush({ email: 'El correo ya está registrado' }, { status: 409, statusText: 'Conflict' });
    });
  });

  it('should throw generic error on other errors', () => {
    const request: RegisterRequest = {
      firstName: 'Omar',
      lastName: 'Gutierrez',
      email: 'omar@test.com',
      password: 'Password1',
      phone: '987654321',
      role: 'INQUILINO'
    };

    return new Promise<void>((resolve, reject) => {
      service.register(request).subscribe({
        next: () => reject(new Error('should have thrown an error')),
        error: (err) => {
          expect(err.message).toBe('Error en el registro. Inténtalo de nuevo.');
          resolve();
        }
      });

      const req = httpMock.expectOne('/api/users/register');
      req.flush({}, { status: 500, statusText: 'Internal Server Error' });
    });
  });
});
