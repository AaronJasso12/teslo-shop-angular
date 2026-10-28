import { HttpClient } from "@angular/common/http";
import { computed, inject, Service, signal } from "@angular/core";
import { environment } from "@environment/environment";
import { catchError, map, Observable, of, tap } from "rxjs";
import { rxResource } from "@angular/core/rxjs-interop";

import { AuthResponse } from "@auth/interfaces/auth-response.interface";
import { User } from "@auth/interfaces/user.interface";

type AuthStatus =  'checking' | 'authenticated' | 'not-authenticated';

const BASE_URL = environment.baseUrl;

@Service()
export class AuthService {
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  private http = inject(HttpClient);

  CheckStatusResource = rxResource({
    stream: () => this.checkStatus()
  });

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';

    if (this._user()) {
      return 'authenticated';
    }

    return 'not-authenticated';
  });

  user = computed<User|null>(() => this._user());
  token = computed<string|null>(this._token);
  errorMessage = signal<string|null>(null);
  isAdmin = computed(() => this._user()?.roles.includes('admin') ?? false);

  private tokenCache = new Map<string, number>();
  private readonly statusCacheDuration = 60 * 60 * 1000;

  login(email: string, password: string): Observable<boolean> {
    return this.authenticateRequest(
      `${BASE_URL}/auth/login`,
      { email, password }
    );
  }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false);
    }

    const lastCheck = this.tokenCache.get(token);
    if (lastCheck !== undefined && Date.now() - lastCheck < this.statusCacheDuration) {
      return of(true);
    }

    return this.http.get<AuthResponse>(`${BASE_URL}/auth/check-status`, {}).pipe(
      map((resp) => this.handleAuthSuccess(resp)),
      catchError((error: any) => this.handleAuthError(error))
    );
  }

  logout() {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');
    this.tokenCache.clear();

    localStorage.removeItem('token');
  }

  private handleAuthSuccess({token, user}: AuthResponse) {
    this._user.set(user);
    this._authStatus.set('authenticated');
    this._token.set(token);
    localStorage.setItem('token', token);
    this.tokenCache.set(token, Date.now());

    return true;
  }

  private handleAuthError(error: any) {
    this.logout();
    return of(false);
  }

  register(email: string, password: string, fullName: string): Observable<boolean> {
    return this.authenticateRequest(
      `${BASE_URL}/auth/register`,
      { email, password, fullName }
    );
  }

  private authenticateRequest(url: string, body: object): Observable<boolean> {
    return this.http.post<AuthResponse>(url, body)
    .pipe(
      map((resp) => this.handleAuthSuccess(resp)),
      catchError((error: any) => this.handleAuthError(error))
    );
  }
}
