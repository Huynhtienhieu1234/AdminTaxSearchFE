import { Component, OnInit } from '@angular/core';
import { NgFor, DatePipe } from '@angular/common';
import { SearchHistoryService } from '../../../services/search-history.service';
import { SearchHistoryDto } from '../../../models/search-history.model';

@Component({
  standalone: true,
  selector: 'app-admin-search-history',
  imports: [NgFor, DatePipe],
  templateUrl: './admin-search-history.html'
})
export class AdminSearchHistoryComponent implements OnInit {
  histories: SearchHistoryDto[] = [];

  constructor(private historyService: SearchHistoryService) {}

  ngOnInit() {
    this.historyService.getUserHistory().subscribe({
      next: res => this.histories = res,
      error: err => console.error('Error loading search history', err)
    });
  }
}
