// admin-api-management.ts
import { Component, OnInit } from '@angular/core';
import { Apikey } from '../../../models/apikey.model';
import { ApikeyService } from '../../../services/apikey.service';
import { NgFor } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-admin-api-management',
  imports: [NgFor],
  templateUrl: 'admin-api-management.html' 
})
export class AdminApiManagementComponent implements OnInit {
  apikeys: Apikey[] = [];
  constructor(private apikeyService: ApikeyService) {}

  ngOnInit() {
    this.apikeyService.getAllApikeys().subscribe(res => this.apikeys = res);
  }
}
