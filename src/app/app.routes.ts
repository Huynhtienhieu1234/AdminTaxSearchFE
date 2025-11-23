import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { AdminGuard } from './admin.guard';
import { Routes,RouterModule  } from '@angular/router';
import { HomeLayout } from './layouts/home-layout/home-layout';import { DefaultRedirectComponent } from './default-redirect';

export const routes: Routes = [
  {
    path: '',
    component: HomeLayout,
    children: [
      { path: '', component: DefaultRedirectComponent }, // <- mặc định check role
      { path: 'user/change-password', loadComponent: () => import('./pages/change-password/change-password').then(m => m.ChangePasswordComponent) },
      { path: 'user/history', loadComponent: () => import('./pages/search-history/search-history').then(m => m.SearchHistoryComponent) },
       { path: 'user/api-keys', loadComponent: () => import('./pages/api-key/api-key').then(m => m.ApiKeyPage) },

      { path: 'auth/login', loadComponent: () => import('./pages/auth/login/login').then(m => m.LoginPage) },
      { path: 'auth/register', loadComponent: () => import('./pages/auth/register/register').then(m => m.RegisterPage) },
      { path: 'lookup/admin', loadComponent: () => import('./pages/administrative-lookup/administrative-lookup').then(m => m.AdminLookupComponent) },
      { path: 'lookup/tax', loadComponent: () => import('./pages/personal-search/personal-search').then(m => m.PersonalSearchComponent) },
      { path: 'lookup/coordinate', loadComponent: () => import('./pages/coordinate-search/coordinate-search').then(m => m.MapLookupComponent) },

      // bỏ các redirect mặc định cũ
      // { path: '', redirectTo: 'lookup/admin', pathMatch: 'full' },
      // { path: '**', redirectTo: 'lookup/admin' },
    ]
  },
  {
  path: 'admin',
  component: AdminLayout,
  canActivate: [AdminGuard],
  children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { 
      path: 'dashboard', 
      loadComponent: () => import('./pages/admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboardComponent) 
    },
    { 
      path: 'users', 
      loadComponent: () => import('./pages/admin/admin-users/admin-users').then(m => m.AdminUsersComponent) 
    },
    { 
      path: 'search-history', 
      loadComponent: () => import('./pages/admin/admin-search-history/admin-search-history').then(m => m.AdminSearchHistoryComponent) 
    },
    { 
      path: 'settings', 
      loadComponent: () => import('./pages/admin/admin-settings/admin-settings').then(m => m.AdminSettingsComponent) 
    },
    { 
      path: 'api-management', 
      loadComponent: () => import('./pages/admin/admin-api-management/admin-api-management').then(m => m.AdminApiManagementComponent) 
    },
  ]
}

];
