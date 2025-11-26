// src/app/pages/admin-users/admin-users.component.ts
import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from './../../../services/User.service';
import { ToastComponent } from '../../../share/toast/toast';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, ToastComponent],
  templateUrl: './admin-users.html'
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  error?: string;
  toastMessage = '';

  currentPage = 1;
  pageSize = 10;

  showModal = false;
  modalMode: 'add' | 'edit' | 'view' = 'add';
  modalUser: Partial<User> = {};
  isLoading = false;

  // confirm modal
  confirmDeleteUser?: User;
  showConfirmBox = false;

  showDeleted = false;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: res => this.users = res,
      error: err => {
        console.error('Lỗi khi tải danh sách người dùng:', err);
        this.error = 'Không thể tải danh sách người dùng';
        this.toastMessage = '❌ Lỗi khi tải danh sách người dùng';
      }
    });
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.isLoading = true;
      setTimeout(() => {
        this.currentPage = page;
        this.isLoading = false;
      }, 500);
    }
  }

  getSimplePages(): number[] {
    const pages: number[] = [];
    const delta = 3;
    const start = Math.max(1, this.currentPage - delta);
    const end = Math.min(this.totalPages, this.currentPage + delta);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

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
    return Math.max(1, Math.ceil(this.filteredUsers.length / this.pageSize));
  }

  toggleDeleted(): void {
    this.showDeleted = !this.showDeleted;
    this.currentPage = 1;
  }

  // modal add / edit / view
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
    this.toastMessage = '🆕 Đang mở form thêm người dùng mới';
  }

  viewUser(user: User): void {
    this.modalMode = 'view';
    this.modalUser = { ...user };
    this.showModal = true;
  }

  editUser(user: User): void {
    this.modalMode = 'edit';
    this.modalUser = { ...user };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  // save (create / update)
  saveUser(): void {
    if (this.modalMode === 'add') {
      const emailExists = this.users.some(u => u.email === this.modalUser.email);
      if (emailExists) {
        this.error = 'Email đã tồn tại. Vui lòng chọn email khác.';
        this.toastMessage = '⚠️ Email đã tồn tại!';
        return;
      }
      this.userService.createUser(this.modalUser).subscribe({
        next: newUser => {
          this.users.push(newUser);
          this.toastMessage = `✅ Thêm thành công: ${newUser.username}`;
          this.closeModal();
        },
        error: err => {
          console.error('Lỗi khi thêm người dùng:', err);
          this.error = 'Không thể thêm người dùng';
          this.toastMessage = '❌ Lỗi khi thêm người dùng';
        }
      });
    } else {
      this.userService.updateUser(this.modalUser.userId!, this.modalUser).subscribe({
        next: () => {
          const index = this.users.findIndex(u => u.userId === this.modalUser.userId);
          if (index !== -1) this.users[index] = { ...this.modalUser } as User;
          this.toastMessage = `💾 Cập nhật thành công: ${this.modalUser.username}`;
          this.closeModal();
        },
        error: err => {
          console.error('Lỗi khi cập nhật người dùng:', err);
          this.error = 'Không thể cập nhật người dùng';
          this.toastMessage = '❌ Lỗi khi cập nhật người dùng';
        }
      });
    }
  }

  // delete flow: open confirm modal (no browser confirm)
  openDeleteConfirm(user: User): void {
    this.confirmDeleteUser = user;
    this.showConfirmBox = true;
  }

  closeConfirmBox(): void {
    this.showConfirmBox = false;
    this.confirmDeleteUser = undefined;
  }

  confirmDelete(): void {
    if (!this.confirmDeleteUser) return;

    const user = this.confirmDeleteUser;
    this.toastMessage = `⏳ Đang xóa: ${user.username}...`;
    this.showConfirmBox = false;

    this.userService.deleteUser(user.userId).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.userId !== user.userId);
        this.toastMessage = `🗑️ Xóa thành công: ${user.username}`;
        this.confirmDeleteUser = undefined;
      },
      error: err => {
        console.error('Lỗi khi xóa người dùng:', err);
        this.error = 'Không thể xóa người dùng';
        this.toastMessage = '❌ Lỗi khi xóa người dùng';
        this.confirmDeleteUser = undefined;
      }
    });
  }

  // keep deleteUser for backward compatibility (calls confirm modal)
  deleteUser(user: User): void {
    this.openDeleteConfirm(user);
  }
}
