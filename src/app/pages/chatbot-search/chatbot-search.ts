import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { SearchService, SearchResult } from '../../services/search.service';
import { OllamaService, ChatResponse } from '../../services/ollama.service';
import { catchError, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-chatbot-search',
  standalone: true,
  template: '', // chỉ logic
})
export class ChatbotSearchComponent {
  private searchService = inject(SearchService);
  private ollamaService = inject(OllamaService);

  @Input() prompt = '';
  @Output() result = new EventEmitter<string>();
  @Output() error = new EventEmitter<string>();

  loading = false;

  sendMessage() {
    const prompt = this.prompt.trim();
    if (!prompt) return;

    this.loading = true;

    // Kiểm tra CCCD (12 số) hoặc MST (10 số)
    const cccdMatch = prompt.match(/\b\d{12}\b/);
    const taxIdMatch = prompt.match(/\b\d{10}\b/);

    if (cccdMatch || taxIdMatch) {
      const query = cccdMatch ? cccdMatch[0] : taxIdMatch![0];

      // Bước 1: gọi Search API
      this.searchService.search(query)
        .pipe(
          catchError(err => {
            this.error.emit('Có lỗi khi gọi Search API');
            this.loading = false;
            return of(null);
          }),
          // Bước 2: nếu có dữ liệu, gửi kết quả + prompt gốc cho Ollama
          switchMap((res: SearchResult | null) => {
            let aiPrompt: string;

            if (!res) {
              aiPrompt = `Không tìm thấy thông tin cho "${query}". Hãy trả lời người dùng một cách thân thiện.`;
            } else {
              const searchSummary = res.found
                ? `Tìm thấy thông tin: ${JSON.stringify(res.data, null, 2)}`
                : 'Không tìm thấy thông tin';
              aiPrompt = `Dựa trên kết quả tra cứu này, hãy trả lời người dùng bằng ngôn ngữ tự nhiên:\n${searchSummary}`;
            }

            // Bước 3: gọi Ollama
            return this.ollamaService.ask(aiPrompt)
              .pipe(
                catchError(err => {
                  this.error.emit('Có lỗi khi gọi Ollama 3');
                  return of({ answer: '[Lỗi Ollama]' } as ChatResponse);
                })
              );
          })
        )
        .subscribe((aiRes: ChatResponse) => {
          this.result.emit(aiRes.answer);
          this.loading = false;
        });

    } else {
      // Nếu không phải CCCD/MST, hỏi trực tiếp Ollama
      this.ollamaService.ask(prompt)
        .pipe(
          catchError(err => {
            this.error.emit('Có lỗi khi gọi Ollama 3');
            this.loading = false;
            return of({ answer: '[Lỗi API]' } as ChatResponse);
          })
        )
        .subscribe(res => {
          this.result.emit(res.answer);
          this.loading = false;
        });
    }
  }
}
