import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./components/authentication-form/authentication-form').then(
        (m) => m.AuthenticationForm
      ),
  },
];
