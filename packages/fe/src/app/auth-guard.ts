import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const isAuthenticated = document.cookie
    .split('; ')
    .some((cookie) => cookie.startsWith('access_token='));

  if (!isAuthenticated) {
    window.location.href = '/login';
  }

  return isAuthenticated;
};
