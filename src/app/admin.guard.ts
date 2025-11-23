import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(): boolean {
  const role = this.authService.getRole()?.trim().toLowerCase();
  if (role === 'admin') {
    return true;
  } else {
    this.router.navigate(['/']);
    return false;
  }
}

}
