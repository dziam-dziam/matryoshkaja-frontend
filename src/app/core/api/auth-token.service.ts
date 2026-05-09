import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

const TOKEN_KEY = 'matryoshkaja.authToken';

interface JwtPayload {
  exp?: number;
}

@Injectable({ providedIn: 'root' })
export class AuthTokenService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly tokenSignal = signal<string | null>(this.readToken());

  readonly token = this.tokenSignal.asReadonly();

  setToken(token: string): void {
    if (!this.isTokenUsable(token)) {
      this.clearToken();
      return;
    }

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

    const token = localStorage.getItem(TOKEN_KEY);

    if (!token || !this.isTokenUsable(token)) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }

    return token;
  }

  private isTokenUsable(token: string): boolean {
    const payload = this.decodePayload(token);

    return typeof payload?.exp === 'number' && payload.exp * 1000 > Date.now();
  }

  private decodePayload(token: string): JwtPayload | null {
    try {
      const payload = token.split('.')[1];

      if (!payload) {
        return null;
      }

      const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
      const paddedPayload = normalizedPayload.padEnd(
        Math.ceil(normalizedPayload.length / 4) * 4,
        '=',
      );

      return JSON.parse(atob(paddedPayload)) as JwtPayload;
    } catch {
      return null;
    }
  }
}
