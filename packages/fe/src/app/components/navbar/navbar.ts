import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NAVBAR_ROUTES } from '../../constants';
import { AuthStateService } from '../../core/services/auth-state.service';
import { LoginButton } from '../login-button';
import { Navlink } from '../navlink';
import { ThemeSwitcher } from '../theme-switcher';

@Component({
  selector: 'app-navbar',
  imports: [ThemeSwitcher, LoginButton, Navlink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  protected readonly navbarRoutes = NAVBAR_ROUTES;
  private readonly authService = inject(AuthStateService);

  protected readonly isLoggedIn = this.authService.isAuthenticated;
}
