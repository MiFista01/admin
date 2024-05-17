import { CanActivateFn, CanActivateChildFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { environment } from '@config';
import { lastValueFrom } from 'rxjs';
import { RequestsService } from '@services/admin/requests.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const req: RequestsService = inject(RequestsService);
  const router: Router = inject(Router);
  try {
    const result = req.Get(`${environment.apiUrl}/users/check-user`)
    let res = await lastValueFrom(result);
    return (res as boolean);
    
  } catch (error) {
    router.navigate(['/home'])
    return false
  }
};
