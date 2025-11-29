import type { Routes } from '@angular/router';
import { authGuard } from './auth-guard';
import { guestGuard } from './guest-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login').then((l) => l.Login),
    canActivate: [guestGuard],
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup').then((l) => l.Signup),
    canActivate: [guestGuard],
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard').then((d) => d.Dashboard),
    canActivate: [authGuard],
  },
  { path: 'logout', loadComponent: () => import('./pages/logout').then((l) => l.Logout) },
  {
    path: 'reservations',
    loadComponent: () => import('./pages/reservations/reservations').then((r) => r.Reservations),
    canActivate: [authGuard],
  },
];
