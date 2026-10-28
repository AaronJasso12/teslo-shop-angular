import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@auth/services/auth-service';
import { firstValueFrom } from 'rxjs';

export const notAuthenticatedGuard: CanActivateFn = async(route, state) => {
  const authSrv = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = await firstValueFrom( authSrv.checkStatus());

  if (isAuthenticated) {
    router.navigateByUrl('/');
    return false;
  }

  return true;
};
