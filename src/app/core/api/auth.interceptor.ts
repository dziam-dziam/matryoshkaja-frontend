import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthTokenService } from './auth-token.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = inject(AuthTokenService).token();
  const publicReadRequest =
    request.method === 'GET' &&
    (request.url.endsWith('/photos') ||
      /\/photos\/\d+$/.test(request.url) ||
      request.url.endsWith('/page-content'));

  if (!token || publicReadRequest) {
    return next(request);
  }

  return next(
    request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );
};
