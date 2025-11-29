import { CanActivateFn } from '@angular/router';

const hasAccessToken = () =>
  document.cookie.split('; ').some((cookie) => cookie.startsWith('access_token='));

export const guestGuard: CanActivateFn = () => {
  if (hasAccessToken()) {
    window.location.href = '/dashboard';
    return false;
  }

  return true;
};
