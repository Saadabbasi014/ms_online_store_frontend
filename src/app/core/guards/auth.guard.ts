import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);

  if (accountService.currentUser()) {
    return of(true);
  }else{
    return accountService.getAuthStatus().pipe(
      map(authStatus => {
        if (authStatus.isAthenticated) {
          console.log("User is authenticated",authStatus.isAthenticated);
          return true;
        } else {
          router.navigate(['/account/login'], { queryParams: { returnUrl: state.url } });
          return false;
        }
      })
    );
  }
};
 