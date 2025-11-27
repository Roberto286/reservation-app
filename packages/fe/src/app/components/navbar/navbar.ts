import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NAVBAR_ROUTES } from '../../constants';
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
}
