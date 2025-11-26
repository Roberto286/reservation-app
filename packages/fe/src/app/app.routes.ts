import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login-form/login-form').then((m) => m.LoginForm),
  },
];
