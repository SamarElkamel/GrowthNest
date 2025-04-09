import { Routes } from '@angular/router';

import { FullComponent } from './backoffice/layouts/full/full.component';
import { LayoutComponent } from './FrontOffice/layout/layout.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ActivateAccountComponent } from './pages/activate-account/activate-account.component';
import { UserListComponent } from './BackOffice/component/users-list/users-list.component';

export const Approutes: Routes = [
  // Auth Routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'activate-account', component: ActivateAccountComponent },

  // Front Office Routes (wrapped in LayoutComponent)
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

  // Back Office Routes (NO 'admin' prefix anymore)
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: 'dashboard',
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
      },
    ],
  },

  // Catch-all
  { path: '**', redirectTo: 'login' },
];
