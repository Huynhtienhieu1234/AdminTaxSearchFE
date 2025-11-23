// ng g c pages/default-redirect --standalone

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-default-redirect',
  standalone: true,
  template: ``, // không cần template
})
export class DefaultRedirectComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const role = this.authService.getRole()?.trim().toLowerCase();

    if (role === 'admin') {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/lookup/admin']);
    }
  }
}
