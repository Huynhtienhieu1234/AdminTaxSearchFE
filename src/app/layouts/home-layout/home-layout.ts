import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, RouterLink, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  imports: [RouterOutlet, RouterModule, RouterLink, NgIf],
  templateUrl: './home-layout.html'
})
export class HomeLayout {
  username: string | null = '';
  role: string | null = '';
  userMenuOpen = false;

  constructor(private authService: AuthService, private router: Router) {
    // Subscribe để cập nhật username realtime
    this.authService.username$.subscribe(name => this.username = name);
    this.role = this.authService.getRole();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['auth/login']);
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }
}
