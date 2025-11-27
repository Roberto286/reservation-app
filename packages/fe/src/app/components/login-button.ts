import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthStateService } from '../core/services/auth-state.service';

@Component({
  selector: 'app-login-button',
  imports: [CommonModule],
  template: ` <a
    class="btn"
    [ngClass]="{ 'btn-primary': !isAuthenticated(), 'btn-secondary': isAuthenticated() }"
    [href]="isAuthenticated() ? '/logout' : '/login'"
  >
    @if(isAuthenticated()){Logout}@else{Login}
  </a>`,
  styles: [],
})
export class LoginButton {
  private readonly authState = inject(AuthStateService);
  readonly isAuthenticated = this.authState.isAuthenticated;
}
