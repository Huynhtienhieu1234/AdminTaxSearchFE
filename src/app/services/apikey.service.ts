import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Apikey, CreateApikeyRequest } from '../models/apikey.model';
import { AuthService } from './auth.service'; // <-- import AuthService
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApikeyService {
  private baseUrl = `${environment.apiUrl}/apikey`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getMyApikeys(): Observable<Apikey[]> {
    const token = this.authService.getToken();
    if (!token) throw new Error('User is not authenticated');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<Apikey[]>(`${this.baseUrl}/me`, { headers });
  }

  createApikey(dto: CreateApikeyRequest): Observable<Apikey> {
    const token = this.authService.getToken();
    if (!token) throw new Error('User is not authenticated');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post<Apikey>(`${this.baseUrl}/create`, dto, { headers });
  }

  getAllApikeys(): Observable<Apikey[]> {
    const token = this.authService.getToken();
    if (!token) throw new Error('User is not authenticated');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<Apikey[]>(`${this.baseUrl}/all`, { headers });
  }
}
