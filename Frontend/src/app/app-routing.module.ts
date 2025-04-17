import { Routes } from '@angular/router';

import { FullComponent } from './BackOffice/layouts/full/full.component';
import { LayoutComponent } from './FrontOffice/layout/layout.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ActivateAccountComponent } from './pages/activate-account/activate-account.component';
import { UserListComponent } from './BackOffice/component/users-list/users-list.component';
import { SelectRoleComponent } from './pages/select-role/select-role.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { RoleGuard } from './role.guard';


export const Approutes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'activate-account', component: ActivateAccountComponent },
  { path: 'select-role', component: SelectRoleComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
 
  


  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./FrontOffice/front-office/front-office.module').then((m) => m.FrontOfficeModule),
      },
    ],
  },


  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: 'dashboard',
        canActivate: [RoleGuard],
  data: { roles: ['ROLE_ADMIN'] },
        loadChildren: () =>
          import('./BackOffice/dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'about',
        loadChildren: () =>
          import('./BackOffice/about/about.module').then((m) => m.AboutModule),
      },
      {
        path: 'component',
        loadChildren: () =>
          import('./BackOffice/component/component.module').then((m) => m.ComponentsModule),
      },
      {
        path: 'users',
        component: UserListComponent,
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_ADMIN']
      },}
    ],
  },

  
  { path: '**', redirectTo: 'login' },
];
