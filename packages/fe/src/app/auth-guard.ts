import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const isAuthenticated = document.cookie
    .split('; ')
    .some((cookie) => cookie.startsWith('accessToken='));

  if (!isAuthenticated) {
    window.location.href = '/login';
  }

  return isAuthenticated;
};
