import { computed, Injectable, inject, signal } from '@angular/core';
import { LoginOkDto } from '@reservation-app/shared';
import { CookieService } from 'ngx-cookie-service';
import { UserRole } from '../../pages/signup';

const ACCESS_TOKEN_COOKIE = 'access_token';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly cookieService = inject(CookieService);
  private readonly authenticated = signal(this.cookieService.check(ACCESS_TOKEN_COOKIE));
  private readonly _userRole = signal<UserRole>(UserRole.User);

  readonly isAuthenticated = computed(() => this.authenticated());

  login(res: LoginOkDto) {
    this.persistAccessToken(res.access_token);
    this.persistUserId(res.userId);
    this.userRole = res.userRole;
  }

  private persistAccessToken(token: string) {
    this.cookieService.set(ACCESS_TOKEN_COOKIE, token, undefined, '/');
    this.authenticated.set(true);
  }

  private persistUserId(userId: string) {
    this.cookieService.set('user_id', userId, undefined, '/');
  }

  logout() {
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

  getUserId(): string | null {
    const userId = this.cookieService.get('user_id');
    return userId ? userId : null;
  }

  get userRole(): UserRole {
    return this._userRole();
  }

  private set userRole(value: UserRole) {
    this._userRole.set(value);
  }
}
