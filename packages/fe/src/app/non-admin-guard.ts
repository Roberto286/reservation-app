import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthStateService } from './core/services/auth-state.service';

export const nonAdminGuard: CanActivateFn = () => {
  const authService = inject(AuthStateService);
  const userRole = authService.getUserRole();

  if (userRole.toLowerCase() === 'admin') {
    window.location.href = '/dashboard';
    return false;
  }

  return true;
};
