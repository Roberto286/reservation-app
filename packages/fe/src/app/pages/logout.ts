import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStateService } from '../core/services/auth-state.service';

@Component({
  selector: 'app-logout',
  template: ` <p>Logging out...</p> `,
})
export class Logout {
  authStateService = inject(AuthStateService);
  router = inject(Router);

  constructor() {
    this.authStateService.logout();
    this.router.navigate(['/login']);
  }
}
