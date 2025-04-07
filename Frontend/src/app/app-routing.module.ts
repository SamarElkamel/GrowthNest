import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderListComponent } from './pages/Orders/order-list/order-list.component';
import { FullComponent } from './layouts/full/full.component';
import { CouponListComponent } from './pages/Orders/coupon-list/coupon-list.component';
import { CouponFormComponent } from './pages/Orders/coupon-form/coupon-form.component';
import { HomeComponent } from './FrontOffice/home/home.component';
import { FrontLayoutComponent } from './layouts/front-layout/front-layout.component';
import { BackLayoutComponent } from './layouts/back-layout/back-layout.component';

export const Approutes: Routes = [
  // FrontOffice layout
  {
    path: '',
    component: FrontLayoutComponent,
    children: [
      { path: '', component: HomeComponent }, // public home
      //{ path: 'about', loadChildren: () => import('./FrontOffice/about/about.module').then(m => m.AboutModule) },
      // add other public-facing modules here
    ]
  },

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
      { path: 'couponForm', component: CouponFormComponent }
    ]
  },

  // fallback
  { path: '**', redirectTo: '' }
];
