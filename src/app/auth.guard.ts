import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService) as AuthService;   // dependancy injection as in class based(in constructor)
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    router.navigate(['/sign-in']);
    return false;
  }

  return true;
};
