import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

const TOKEN_KEY = 'matryoshkaja.authToken';

@Injectable({ providedIn: 'root' })
export class AuthTokenService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly tokenSignal = signal<string | null>(this.readToken());

  readonly token = this.tokenSignal.asReadonly();

  setToken(token: string): void {
    this.tokenSignal.set(token);

    if (this.isBrowser) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  }

  clearToken(): void {
    this.tokenSignal.set(null);

    if (this.isBrowser) {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  private readToken(): string | null {
    if (!this.isBrowser) {
      return null;
    }

    return localStorage.getItem(TOKEN_KEY);
  }
}