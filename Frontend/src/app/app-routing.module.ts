import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderListComponent } from './pages/Orders/order-list/order-list.component';
import { FullComponent } from './BackOffice/layouts/full/full.component';
import { CouponListComponent } from './pages/Orders/coupon-list/coupon-list.component';
import { CouponFormComponent } from './pages/Orders/coupon-form/coupon-form.component';


export const Approutes: Routes = [
  
  { path: '', loadChildren: () => import('./FrontOffice/front-office/front-office.module').then(m => m.FrontOfficeModule) },
  // BackOffice layout
  {
    path: 'admin',
    component: FullComponent, 
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () => import('./BackOffice/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'component',
        loadChildren: () => import('./BackOffice/component/component.module').then(m => m.ComponentsModule)
      },
      { path: 'orders', component: OrderListComponent },
      { path: 'coupon', component: CouponListComponent },
      { path: 'coupons/create', component: CouponFormComponent },
      

    ]
  },

  // fallback
  { path: '**', redirectTo: '' }
];
