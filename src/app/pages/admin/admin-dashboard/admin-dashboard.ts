import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from '../../../app.config';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.html',
})
export class AdminDashboardComponent implements OnInit {
  stats = {
    users: 0,
    apiCalls: 0,
    searches: 0,
    apikeys: 0

  };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<any>('https://localhost:5124/api/Dashboard/stats')
      .subscribe(data => {
        this.stats = data;
      });
  }
}
