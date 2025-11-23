import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './change-password.html' 
})
export class ChangePasswordComponent {
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  error = '';
  success = '';

  constructor(private authService: AuthService, private router: Router) {}

  changePassword() {
    this.error = '';
    this.success = '';

    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Mật khẩu mới và xác nhận mật khẩu không khớp';
      return;
    }

    this.authService.changePassword(this.currentPassword, this.newPassword)
      .subscribe({
        next: res => {
          this.success = 'Đổi mật khẩu thành công';
          // Optional: redirect sau 1-2s
          setTimeout(() => this.router.navigate(['/']), 1500);
        },
        error: err => {
          this.error = err.error?.error || 'Đổi mật khẩu thất bại';
        }
      });
  }
}
