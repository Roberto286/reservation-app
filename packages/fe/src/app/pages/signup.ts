import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SignupRequestDto } from '@reservation-app/shared';
import { AuthenticationForm } from '../components/authentication-form/authentication-form';
import { AlertService } from '../core/services/alert.service';
import { AuthenticationFormValue } from '../types/authentication-form';

export enum UserRole {
  User = 'user',
  Admin = 'admin',
}
@Component({
  imports: [AuthenticationForm],
  selector: 'app-signup',
  template: `<app-authentication-form
    [isSigningUp]="true"
    (submitForm)="handleSubmit($event)"
  ></app-authentication-form>`,
  styles: [],
})
export class Signup {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly alertService = inject(AlertService);

  handleSubmit(formValue: AuthenticationFormValue) {
    const dto = this.mapFormValuesToDto(formValue);
    this.http.post('/users/signup', dto).subscribe({
      next: () => {
        this.alertService.success('Registrazione completata con successo!');
        this.router.navigate(['/login']);
      },
      error: () => {
        this.alertService.error('Errore durante la registrazione. Riprova.');
      },
    });
  }

  private mapFormValuesToDto(formValue: AuthenticationFormValue): SignupRequestDto {
    return {
      email: formValue.email ?? '',
      password: formValue.password ?? '',
      role: formValue.isAdmin ? UserRole.Admin : UserRole.User,
    };
  }
}
