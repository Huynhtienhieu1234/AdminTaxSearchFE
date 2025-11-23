import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { RegisterRequest } from '../../../models/auth.model';

@Component({
  selector: 'register-page',
  standalone: true,
  imports: [FormsModule, NgIf, RouterModule],
  templateUrl: './register.html',
})
export class RegisterPage {
  username = '';
  password = '';
  email = '';
  loading = false;

  // Thông báo lỗi và thành công
  error = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) { }


  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  register() {
    this.error = '';
    this.successMessage = '';
    this.loading = true;

    if (!this.username.trim()) {
      this.error = 'Vui lòng nhập tên người dùng.';
      this.loading = false;
      this.autoHideMessage();
      return;
    }

    if (!this.password.trim()) {
      this.error = 'Vui lòng nhập mật khẩu.';
      this.loading = false;
      this.autoHideMessage();
      return;
    }

    const req: RegisterRequest = {
      username: this.username.trim(),
      password: this.password.trim(),
      email: this.email.trim()
    };

    this.authService.register(req).subscribe({
      next: res => {
        this.loading = false;
        this.successMessage = 'Đăng ký thành công! Đang chuyển về trang đăng nhập...';

        // Tự động tắt sau 3 giây và chuyển trang
        setTimeout(() => {
          this.successMessage = '';
          this.router.navigate(['/auth/login']);
        }, 3000);
      },
      error: err => {
        this.loading = false;

        if (err.status === 0) {
          this.error = 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.';
        } else if (err.status === 400) {
          this.error = err.error?.error || 'Thông tin đăng ký không hợp lệ.';
        } else if (err.status === 409) {
          this.error = err.error?.error || 'Tên người dùng hoặc email Gmail đã tồn tại.';
        } else {
          this.error = 'Đăng ký thất bại. Vui lòng thử lại.';
        }

        console.error('Lỗi đăng ký:', err);
        this.autoHideMessage();
      }
    });
  }

  // Hàm tự động ẩn thông báo sau 3 giây
  autoHideMessage() {
    setTimeout(() => {
      this.error = '';
      this.successMessage = '';
    }, 3000);
  }

}
