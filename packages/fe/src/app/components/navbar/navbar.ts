import { Component, computed, inject } from '@angular/core';
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
  private readonly authService = inject(AuthStateService);

  protected readonly isLoggedIn = this.authService.isAuthenticated;

  protected readonly navbarRoutes = computed(() => {
    const userRole = this.authService.getUserRole().toLowerCase();
    return NAVBAR_ROUTES.filter((route) => {
      if (!route.roles.includes(userRole)) {
        return false;
      }
      return true;
    });
  });
}
