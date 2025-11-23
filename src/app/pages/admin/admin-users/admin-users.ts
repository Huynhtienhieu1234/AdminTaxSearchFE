import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { UserService, User } from './../../../services/User.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './admin-users.html'
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  error?: string;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: res => this.users = res,
      error: err => {
        console.error('Lỗi khi tải danh sách người dùng:', err);
        this.error = 'Không thể tải danh sách người dùng';
      }
    });
  }

  currentPage = 1;
  pageSize = 10;

  get paginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.users.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.users.length / this.pageSize);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  editUser(userId: number) {
    console.log('Sửa user:', userId);
  }

  deleteUser(userId: number) {
    console.log('Xóa user:', userId);
  }




}


