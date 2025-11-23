// services/ollama.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  answer: string;
}

@Injectable({ providedIn: 'root' })
export class OllamaService {
  private apiUrl = `${environment.apiUrl}/chatbot/ask`; // backend .NET gọi Ollama3

  constructor(private http: HttpClient) {}

  ask(message: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(this.apiUrl, { message });
  }
}
