import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  if (authService.isAuthenticated() ) {
    return true;
  }
  authService.redirect();
  return false;
};
