// src/app/pages/admin-users/admin-users.component.ts
import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from './../../../services/User.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './admin-users.html'
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  error?: string;

  currentPage = 1;
  pageSize = 10;

  showModal = false;
  modalMode: 'add' | 'edit' = 'add';
  modalUser: Partial<User> = {};

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }


  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: res => this.users = res,
      error: err => {
        console.error('Lỗi khi tải danh sách người dùng:', err);
        this.error = 'Không thể tải danh sách người dùng';
      }
    });
  }

  onAddUser(): void {
    this.modalMode = 'add';
    this.modalUser = {
      username: '',
      email: '',
      roleId: 1,
      isActive: true,
      password: ''
    };
    this.showModal = true;
  }

  editUser(user: User): void {
    this.modalMode = 'edit';
    this.modalUser = { ...user };
    this.showModal = true;
  }

  deleteUser(user: User): void {
    const confirmDelete = confirm(`Bạn có chắc muốn xóa tài khoản "${user.username}" không?`);
    if (confirmDelete) {
      this.userService.deleteUser(user.userId).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.userId !== user.userId);
        },
        error: err => {
          console.error('Lỗi khi xóa người dùng:', err);
          this.error = 'Không thể xóa người dùng';
        }
      });
    }
  }

  saveUser(): void {
    if (this.modalMode === 'add') {
      this.userService.createUser(this.modalUser).subscribe({
        next: newUser => {
          this.users.push(newUser);
          this.closeModal();
        },
        error: err => {
          console.error('Lỗi khi thêm người dùng:', err);
          this.error = 'Không thể thêm người dùng';
        }
      });
    } else {
      this.userService.updateUser(this.modalUser.userId!, this.modalUser).subscribe({
        next: () => {
          const index = this.users.findIndex(u => u.userId === this.modalUser.userId);
          if (index !== -1) this.users[index] = { ...this.modalUser } as User;
          this.closeModal();
        },
        error: err => {
          console.error('Lỗi khi cập nhật người dùng:', err);
          this.error = 'Không thể cập nhật người dùng';
        }
      });
    }
  }

  showDeleted = false;

  get filteredUsers(): User[] {
    return this.showDeleted
      ? this.users.filter(u => u.isActive === false)
      : this.users.filter(u => u.isActive !== false);
  }

  get paginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.pageSize);
  }

  toggleDeleted(): void {
    this.showDeleted = !this.showDeleted;
    this.currentPage = 1;
  }




  closeModal(): void {
    this.showModal = false;
  }
}
