import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authUsersGuard: CanActivateFn = () => {
  const router = inject(Router);
  if (localStorage.getItem('token') !== null) {
    return true;
  } else {
    router.navigate(['']);
    return false;
  }
};
