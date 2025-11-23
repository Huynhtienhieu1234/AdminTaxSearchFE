import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterModule, RouterLink, NgIf],
  templateUrl: './admin-layout.html'
})
export class AdminLayout {
  constructor(private authService: AuthService, private router: Router) { }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
