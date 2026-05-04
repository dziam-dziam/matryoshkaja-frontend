import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { API_BASE_URL } from './api.config';
import { LoginRequest } from './api.models';
import { AuthTokenService } from './auth-token.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);
  private readonly authToken = inject(AuthTokenService);

  login(request: LoginRequest): Observable<string> {
    return this.http
      .post(`${this.apiBaseUrl}/auth/login`, request, { responseType: 'text' })
      .pipe(tap((token) => this.authToken.setToken(token)));
  }

  logout(): void {
    this.authToken.clearToken();
  }
}
