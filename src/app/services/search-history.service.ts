import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchHistoryDto } from '../models/search-history.model';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class SearchHistoryService {
  private apiUrl = `${environment.apiUrl}/searchhistory`;

  constructor(private http: HttpClient) {}

  getUserHistory(): Observable<SearchHistoryDto[]> {
    const token = localStorage.getItem('authToken'); // JWT token
    return this.http.get<SearchHistoryDto[]>(`${this.apiUrl}/history`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
