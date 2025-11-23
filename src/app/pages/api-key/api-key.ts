import { Component, OnInit } from '@angular/core';
import { ApikeyService } from '../../services/apikey.service';
import { Apikey, CreateApikeyRequest } from '../..//models/apikey.model';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, DatePipe  } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-api-key',
  imports: [FormsModule, NgFor, NgIf, DatePipe ],
  templateUrl: './api-key.html'
})
export class ApiKeyPage implements OnInit {
  apikeys: Apikey[] = [];
  systemName = '';

  constructor(private apikeyService: ApikeyService) {}

  ngOnInit() {
    this.loadKeys();
  }

  loadKeys() {
    this.apikeyService.getMyApikeys().subscribe(res => this.apikeys = res);
  }

  createKey() {
    if (!this.systemName.trim()) return;
    const dto: CreateApikeyRequest = { systemName: this.systemName.trim() };
    this.apikeyService.createApikey(dto).subscribe(res => {
      this.apikeys.push(res);
      this.systemName = '';
    });
  }
}
