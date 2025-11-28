import { computed, Injectable, inject, signal } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

const ACCESS_TOKEN_COOKIE = 'access_token';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly cookieService = inject(CookieService);
  private readonly authenticated = signal(this.cookieService.check(ACCESS_TOKEN_COOKIE));

  readonly isAuthenticated = computed(() => this.authenticated());

  persistAccessToken(token: string) {
    this.cookieService.set(ACCESS_TOKEN_COOKIE, token, undefined, '/');
    this.authenticated.set(true);
  }

  clearAccessToken() {
    this.cookieService.delete(ACCESS_TOKEN_COOKIE, '/');
    this.authenticated.set(false);
  }

  refreshFromCookies() {
    this.authenticated.set(this.cookieService.check(ACCESS_TOKEN_COOKIE));
  }

  getAccessToken(): string | null {
    const token = this.cookieService.get(ACCESS_TOKEN_COOKIE);
    return token ? token : null;
  }
}
