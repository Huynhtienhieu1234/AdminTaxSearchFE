import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
    userId: number;
    username: string;
    email?: string;
    roleId: number;
    isActive?: boolean;
}

@Injectable({ providedIn: 'root' })
export class UserService {
    private readonly API_URL = 'https://localhost:7215/api/auth/all';

    constructor(private http: HttpClient) { }

    getAllUsers(): Observable<User[]> {
        const token = localStorage.getItem('authToken');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token ?? ''}`
        });

        return this.http.get<User[]>(this.API_URL, { headers });
    }
}
