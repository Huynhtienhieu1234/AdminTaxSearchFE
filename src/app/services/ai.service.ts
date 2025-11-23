import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface GeminiResponse {
  text: string;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class AiService {
  private apiUrl = `${environment.apiUrl}/AI/generate-text`; // backend Gemini

  constructor(private http: HttpClient) {}

  generateText(prompt: string): Observable<GeminiResponse> {
    return this.http.post<GeminiResponse>(this.apiUrl, { prompt });
  }
}
