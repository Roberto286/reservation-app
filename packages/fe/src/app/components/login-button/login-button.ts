import { Component, inject } from '@angular/core';
import { AuthStateService } from '../../core/services/auth-state.service';

@Component({
  selector: 'app-login-button',
  imports: [],
  templateUrl: './login-button.html',
  styleUrl: './login-button.css',
})
export class LoginButton {
  private readonly authState = inject(AuthStateService);
  readonly isAuthenticated = this.authState.isAuthenticated;
}
