import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FullComponent } from './backoffice/layouts/full/full.component';
import { BusinessListComponent } from './pages/business/business-list/business-list.component';
import { AddBusinessComponent } from './pages/business/add-business/add-business.component';
import { HomeComponent } from './FrontOffice/home/home.component';
import { BusinessListFrontComponent } from './pages/business/business-list-front/business-list-front.component';
import { BusinessproductsComponent } from './pages/products/businessproducts/businessproducts.component';

export const Approutes: Routes = [

  // FrontOffice
    { 
      path: '',
      component: HomeComponent 
    },
    {
      path: 'business/:businessId/products',
      component: BusinessproductsComponent
    },
    {
      path: 'businesses',
      component: BusinessListFrontComponent,
      title: 'Liste des small business'
    },
   
  
    // BackOffice
    {
      path: 'admin',
      component: FullComponent,
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

      {
        path: 'dashboard',
        loadChildren: () => import('./backoffice/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'about',
        loadChildren: () => import('./backoffice/about/about.module').then(m => m.AboutModule)
      },
      {
        path: 'component',
        loadChildren: () => import('./backoffice/component/component.module').then(m => m.ComponentsModule)
      },
      { path: 'listBusiness', component: BusinessListComponent },
      { path: 'businesses/add', component: AddBusinessComponent },
    ]
  },
  {
    path: '**',
    redirectTo: '/starter'
  }
];
