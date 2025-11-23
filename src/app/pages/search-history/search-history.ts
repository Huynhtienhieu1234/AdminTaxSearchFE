import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgFor, DatePipe } from '@angular/common';  // ✅ thêm NgFor và DatePipe
import { environment } from '../../environments/environment';
interface HistoryItem {
  inputText: string;
  resultText?: string;
  createdAt: string;
}

@Component({
  selector: 'app-search-history',
  standalone: true,
  imports: [NgFor, DatePipe],  // ✅ khai báo ở đây
  templateUrl: './search-history.html' 
})
export class SearchHistoryComponent implements OnInit {
  private http = inject(HttpClient);
  histories: HistoryItem[] = [];

  ngOnInit() {
    this.http.get<HistoryItem[]>(`${environment.apiUrl}/searchhistory/history`)
      .subscribe(res => this.histories = res);
  }
}
