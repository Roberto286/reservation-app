import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login').then((l) => l.Login),
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup').then((l) => l.Signup),
  },
];
