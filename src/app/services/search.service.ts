import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaxInfo } from '../models/tax-info.model';
import { environment } from '../environments/environment';

export interface SearchRequest { cccd: string; }
export interface SearchResult {
  input: string;
  timestamp: string;
  found: boolean;
  data?: TaxInfo;
  error?: string;
  note?: string;
    source?: 'db' | 'scrape';
}

@Injectable({ providedIn: 'root' })
export class SearchService {
  private apiUrl = `${environment.apiUrl}/search`;
  constructor(private http: HttpClient) { }

  search(Cccd: string): Observable<SearchResult> {
    return this.http.post<SearchResult>(this.apiUrl, { Cccd });
  }
 // Thêm updateAddress
  updateAddress(taxId: string, newAddress: string): Observable<{ success: boolean }> {
    return this.http.put<{ success: boolean }>(`${this.apiUrl}/update-address`, { taxId, address: newAddress });
  } 
}