import type { Routes } from '@angular/router';
import { authGuard } from './auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login').then((l) => l.Login),
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup').then((l) => l.Signup),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard').then((d) => d.Dashboard),
    canActivate: [authGuard],
  },
  { path: 'logout', loadComponent: () => import('./pages/logout').then((l) => l.Logout) },
];
