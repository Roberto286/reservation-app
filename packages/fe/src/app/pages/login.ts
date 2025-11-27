import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationForm } from '../components/authentication-form/authentication-form';
import { AuthStateService } from '../core/services/auth-state.service';
import type { AuthenticationFormValue } from '../types/authentication-form';

@Component({
  imports: [AuthenticationForm],
  selector: 'app-login',
  template: `<app-authentication-form
    [isSigningUp]="false"
    (submitForm)="handleSubmit($event)"
  ></app-authentication-form>`,
  styles: [],
})
export class Login {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly authState = inject(AuthStateService);

  handleSubmit(formValue: AuthenticationFormValue) {
    this.http.post<{ access_token: string }>('/auth/login', formValue).subscribe({
      next: (res) => {
        this.authState.persistAccessToken(res.access_token);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }
}
