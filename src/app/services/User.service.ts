// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface User {
    userId: number;
    username: string;
    email?: string;
    roleId: number;
    isActive?: boolean;
    password?: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
    private readonly API_URL = `${environment.apiUrl}/users`;

    constructor(private http: HttpClient) { }

    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('authToken');
        return new HttpHeaders({
            Authorization: `Bearer ${token ?? ''}`
        });
    }

    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.API_URL, { headers: this.getAuthHeaders() });
    }

    getUserById(id: number): Observable<User> {
        return this.http.get<User>(`${this.API_URL}/${id}`, { headers: this.getAuthHeaders() });
    }

    createUser(user: Partial<User>): Observable<User> {
        return this.http.post<User>(this.API_URL, user, { headers: this.getAuthHeaders() });
    }

    updateUser(id: number, user: Partial<User>): Observable<void> {
        return this.http.put<void>(`${this.API_URL}/${id}`, user, { headers: this.getAuthHeaders() });
    }

    deleteUser(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`, { headers: this.getAuthHeaders() });
    }
}
