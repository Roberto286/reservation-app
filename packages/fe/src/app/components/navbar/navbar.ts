import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NAVBAR_ROUTES } from '../../constants';
import { LoginButton } from '../login-button/login-button';
import { Navlink } from '../navlink/navlink';
import { ThemeSwitcher } from '../theme-switcher/theme-switcher';

@Component({
  selector: 'app-navbar',
  imports: [ThemeSwitcher, LoginButton, Navlink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  protected readonly navbarRoutes = NAVBAR_ROUTES;
}
