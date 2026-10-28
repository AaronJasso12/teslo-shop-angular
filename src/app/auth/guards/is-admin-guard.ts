import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '@auth/services/auth-service';
import { catchError, firstValueFrom, of } from 'rxjs';

export const isAdminGuard: CanMatchFn = async (route, segments) => {
  const authSrv = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = await firstValueFrom(
    authSrv.checkStatus().pipe(
      catchError(() => of(false))
    )
  );

  if (!isAuthenticated) {
    return router.createUrlTree(['/']);
  }

  if (!authSrv.isAdmin()) {
    return router.createUrlTree(['/']);
  }

  return true;
};
