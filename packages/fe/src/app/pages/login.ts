import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationForm } from '../components/authentication-form/authentication-form';
import { AuthenticationFormValue } from '../types/authentication-form';

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
  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly cookieService: CookieService
  ) {}

  handleSubmit(formValue: AuthenticationFormValue) {
    this.http.post<{ access_token: string }>('/auth/login', formValue).subscribe({
      next: (res) => {
        this.cookieService.set('accessToken', res.access_token);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }
}
