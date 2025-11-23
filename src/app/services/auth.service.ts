import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthRequest, AuthResponse, RegisterRequest } from '../models/auth.model';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;

  // BehaviorSubject để theo dõi username realtime
  public username$ = new BehaviorSubject<string | null>(this.getUsername());

  constructor(private http: HttpClient) {}

  login(data: AuthRequest) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, data).pipe(
      tap(res => {
        localStorage.setItem('authToken', res.token);
        localStorage.setItem('username', res.username);
        localStorage.setItem('role', res.role);
        this.username$.next(res.username); // update ngay
      })
    );
  }

  register(data: RegisterRequest) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, data).pipe(
      tap(res => {
        localStorage.setItem('authToken', res.token);
        localStorage.setItem('username', res.username);
        localStorage.setItem('role', res.role);
        this.username$.next(res.username);
      })
    );
  }

changePassword(currentPassword: string, newPassword: string) {
  const token = localStorage.getItem('authToken');
  return this.http.post(
    `${this.baseUrl}/change-password`,
    { currentPassword, newPassword },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
}


  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    this.username$.next(null);
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
  setUserInfo(res: AuthResponse) {
  localStorage.setItem('authToken', res.token);
  localStorage.setItem('username', res.username);
  localStorage.setItem('role', res.role);
  this.username$.next(res.username);
}

}
