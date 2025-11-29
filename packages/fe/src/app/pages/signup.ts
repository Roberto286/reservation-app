import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SignupRequestDto, UserRole } from '@reservation-app/shared';
import { AuthenticationForm } from '../components/authentication-form/authentication-form';
import { AuthenticationFormValue } from '../types/authentication-form';

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
  constructor(private readonly http: HttpClient, private readonly router: Router) {}

  handleSubmit(formValue: AuthenticationFormValue) {
    const dto = this.mapFormValuesToDto(formValue);
    this.http.post('/users/signup', dto).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Signup failed:', error);
      },
    });
  }

  private mapFormValuesToDto(formValue: AuthenticationFormValue): SignupRequestDto {
    return {
      email: formValue.email ?? '',
      password: formValue.password ?? '',
      role: formValue.userRole ? UserRole.Admin : UserRole.User,
    };
  }
}
