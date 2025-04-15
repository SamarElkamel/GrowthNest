import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { DisplayAllDeliveryAgencyComponent } from './pages/Delivery-agency/display-all-delivery-agency/display-all-delivery-agency.component';
import { HomeComponent } from './FrontOffice/home/home.component';
import { DisplayReclamationComponent } from './pages/Reclamation/display-reclamation/display-reclamation.component';
import { AddReclamationComponent } from './pages/Reclamation/add-reclamation/add-reclamation.component';
import { RatingComponent } from './pages/rating/rating.component';

export const Approutes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'delivery-agencies', component: DisplayAllDeliveryAgencyComponent },
      { path: 'add-reclamation', component: AddReclamationComponent },
      { path: 'rating', component: RatingComponent }


    ]
  },
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
      },
      { path: 'reclamation', component: DisplayReclamationComponent }

    ]
  },
  {
    path: '**',
    redirectTo: '/starter'
  }
];
