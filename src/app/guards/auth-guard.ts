import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);
  const isAuthenticated = await authService.isLoggedIn();
  if (isAuthenticated) {
    return true;
  } else {
    router.navigateByUrl('/login');
    return false;
  }
};
