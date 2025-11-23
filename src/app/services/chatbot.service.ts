// services/chatbot.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ChatRequest {
  message: string;
}

interface ChatResponse {
  answer: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = 'https://localhost:7215/api/chatbot';

  constructor(private http: HttpClient) {}

  ask(message: string): Observable<ChatResponse> {
    const body: ChatRequest = { message };
    return this.http.post<ChatResponse>(`${this.apiUrl}/ask`, body);
  }
}
