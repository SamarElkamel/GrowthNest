import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';

export const Approutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () => import('./BackOffice/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'about',
        loadChildren: () => import('./BackOffice/about/about.module').then(m => m.AboutModule)
      },
      {
        path: 'component',
        loadChildren: () => import('./BackOffice/component/component.module').then(m => m.ComponentsModule)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/starter'
  }
];
