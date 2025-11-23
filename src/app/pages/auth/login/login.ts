import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AuthRequest } from '../../../models/auth.model';

@Component({
  selector: 'login-page',
  standalone: true,
  imports: [FormsModule, NgIf, RouterModule],
  templateUrl: './login.html',
})
export class LoginPage {
  username: string = '';
  password: string = '';
  error: string = '';
  success: string = '';
  submitted: boolean = false;
  loading = false;
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }



  login() {
    this.submitted = true;
    this.error = '';
    this.success = '';
    this.loading = true;

    // Kiểm tra trống username
    if (!this.username.trim()) {
      this.error = 'Vui lòng nhập tên người dùng!';
      this.loading = false;
      return;
    }

    // Kiểm tra trống password
    if (!this.password.trim()) {
      this.error = 'Vui lòng nhập mật khẩu!';
      this.loading = false;
      return;
    }

    const req: AuthRequest = { username: this.username.trim(), password: this.password.trim() };

    this.authService.login(req).subscribe({
      next: (res) => {
        this.authService.setUserInfo(res);
        this.success = 'Đăng nhập thành công!';
        this.loading = false;
        this.error = '';

        const role = res.role?.trim().toLowerCase();
        setTimeout(() => {
          if (role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']);
          }
        }, 1000);
      },
      error: (err) => {
        this.success = '';
        this.error = err.error?.error || 'Đăng nhập thất bại, vui lòng thử lại!';
        this.loading = false;
      },
    });
  }

}
