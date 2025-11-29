import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginOkDto } from '@reservation-app/shared';
import { Alert } from '../components/alert';
import { AuthenticationForm } from '../components/authentication-form/authentication-form';
import { AuthStateService } from '../core/services/auth-state.service';
import type { AuthenticationFormValue } from '../types/authentication-form';

@Component({
  imports: [AuthenticationForm, Alert],
  selector: 'app-login',
  template: `<app-authentication-form
      [isSigningUp]="false"
      (submitForm)="handleSubmit($event)"
    ></app-authentication-form>
    @if(authenticationError){
    <app-alert type="warning" message="Login fallito. Per favore riprova."></app-alert>
    } `,
  styles: [],
})
export class Login {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly authState = inject(AuthStateService);
  authenticationError = false;

  handleSubmit(formValue: AuthenticationFormValue) {
    this.http.post<LoginOkDto>('/auth/login', formValue).subscribe({
      next: (res) => {
        this.authState.persistAccessToken(res.access_token);
        this.authState.persistUserId(res.userId);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.authenticationError = true;
      },
    });
  }
}
