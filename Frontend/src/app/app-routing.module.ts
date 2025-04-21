import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BusinessListComponent } from './pages/business/business-list/business-list.component';
import { AddBusinessComponent } from './pages/business/add-business/add-business.component';
import { HomeComponent } from './FrontOffice/home/home.component';
import { BusinessListFrontComponent } from './pages/business/business-list-front/business-list-front.component';
import { BusinessproductsComponent } from './pages/products/businessproducts/businessproducts.component';
import { BusinessDetailBComponent } from './pages/business/business-detail-b/business-detail-b.component';
import { AddProductComponent } from './pages/products/add-product/add-product.component';
import { BusinessDetailsComponent } from './pages/business/business-details/business-details.component';
import { AdminDashboardComponent } from './pages/business/admin-dashboard/admin-dashboard.component';
import { WishlistComponent } from './pages/products/wishlist/wishlist.component';
import { FullComponent } from './BackOffice/layouts/full/full.component';

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
    { path: 'business-details/:idB', component: BusinessDetailsComponent,title: 'business details' },
    { path: 'wishlist', component: WishlistComponent },
   
  
    // BackOffice
    {
      path: 'admin',
      component: FullComponent,
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      { 
        path: 'my-business/:idBusiness', 
        component: BusinessDetailBComponent
        
      },
      { path: 'add-product/:idBusiness', component: AddProductComponent },
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
      { path: 'listBusiness', component: BusinessListComponent },
      { path: 'businesses/add', component: AddBusinessComponent },
      { path: 'pending-businesses', component: AdminDashboardComponent, title: 'Pending Businesses' }
    
    ]
    
  },
  {
    path: '**',
    redirectTo: '/starter'
  }
];
