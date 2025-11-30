import { computed, Injectable, inject, signal } from '@angular/core';
import { JwtPayload, LoginOkDto } from '@reservation-app/shared';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { UserRole } from '../../pages/signup';

const ACCESS_TOKEN_COOKIE = 'access_token';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly cookieService = inject(CookieService);
  private readonly authenticated = signal(this.cookieService.check(ACCESS_TOKEN_COOKIE));
  private readonly _userRole = signal<UserRole>(this.getTokenProperty('role', UserRole.User));

  readonly isAuthenticated = computed(() => this.authenticated());

  private getTokenProperty<K extends keyof JwtPayload>(
    property: K,
    defaultValue: JwtPayload[K]
  ): JwtPayload[K] {
    const token = this.getAccessToken();
    if (!token) return defaultValue;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded[property];
    } catch {
      return defaultValue;
    }
  }

  login(res: LoginOkDto) {
    this.persistAccessToken(res.access_token);
  }

  private persistAccessToken(token: string) {
    this.cookieService.set(ACCESS_TOKEN_COOKIE, token, undefined, '/');
    this.authenticated.set(true);
  }

  logout() {
    this.cookieService.delete(ACCESS_TOKEN_COOKIE, '/');
    this.authenticated.set(false);
    this._userRole.set(UserRole.User);
  }

  refreshFromCookies() {
    this.authenticated.set(this.cookieService.check(ACCESS_TOKEN_COOKIE));
    this._userRole.set(this.getTokenProperty('role', UserRole.User));
  }

  getAccessToken(): string | null {
    const token = this.cookieService.get(ACCESS_TOKEN_COOKIE);
    return token ? token : null;
  }

  getUserId(): string | null {
    return this.getTokenProperty('sub', '');
  }

  get userRole(): UserRole {
    return this._userRole();
  }
}
