// src/app/services/dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardStats {
    users: number;
    apiCalls: number;
    searches: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
    private apiUrl = 'https://localhost:5124/api/Dashboard/stats';

    constructor(private http: HttpClient) { }

    getStats(): Observable<DashboardStats> {
        return this.http.get<DashboardStats>(this.apiUrl);
    }
}
