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



  showModal = false;
  modalMode: 'add' | 'edit' = 'add';
  modalUser: any = {};

  onAddUser(): void {
    this.modalMode = 'add';
    this.modalUser = {
      username: '',
      email: '',
      roleId: 1,
      isActive: true
    };
    this.showModal = true;
  }

  editUser(user: any): void {
    this.modalMode = 'edit';
    this.modalUser = { ...user };
    this.showModal = true;
  }

  deleteUser(user: any): void {
    const confirmDelete = confirm(`Bạn có chắc muốn xóa tài khoản "${user.username}" không?`);
    if (confirmDelete) {
      console.log('🗑️ Xóa người dùng:', user);
      // Gọi API xóa ở đây nếu cần
    }
  }

  saveUser(): void {
    if (this.modalMode === 'add') {
      console.log('➕ Thêm người dùng:', this.modalUser);
      // Gọi API tạo mới
    } else {
      console.log('✏️ Cập nhật người dùng:', this.modalUser);
      // Gọi API cập nhật
    }
    this.closeModal();
  }

  closeModal(): void {
    this.showModal = false;
  }




}


