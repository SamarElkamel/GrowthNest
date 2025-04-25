import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderListComponent } from './pages/Orders/order-list/order-list.component';
import { CouponListComponent } from './pages/Orders/coupon-list/coupon-list.component';

import { FullComponent } from './BackOffice/layouts/full/full.component';
import { LayoutComponent } from './FrontOffice/layout/layout.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ActivateAccountComponent } from './pages/activate-account/activate-account.component';
import { SelectRoleComponent } from './pages/select-role/select-role.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { UserListComponent } from './BackOffice/component/users-list/users-list.component';
import { BusinessListComponent } from './pages/business/business-list/business-list.component';
import { AddBusinessComponent } from './pages/business/add-business/add-business.component';
import { BusinessDetailBComponent } from './pages/business/business-detail-b/business-detail-b.component';
import { AddProductComponent } from './pages/products/add-product/add-product.component';
import { AdminDashboardComponent } from './pages/business/admin-dashboard/admin-dashboard.component';
import { RoleGuard } from './role.guard';
import { CouponFormComponent } from './pages/Orders/coupon-form/coupon-form.component';

import { EventListComponent } from './pages/EventAdmin/event-list/event-list.component';

import { EventUpdateComponent } from './pages/EventAdmin/update-event/update-event.component';
import { EventRegistrationsComponent } from './pages/EventAdmin/event-registrations/event-registrations.component';
import { EventHistoryComponent } from './pages/EventAdmin/event-history/event-history.component';
import { EventAddComponent } from './pages/EventAdmin/add-event/add-event.component';
import { EventDetailsComponent } from './pages/EventAdmin/event-details/event-details.component';
import { ManageEventRegistrationsComponent } from './pages/EventAdmin/manage-event-registrations/manage-event-registrations.component';
import { StatisticsComponent } from './pages/EventUser/statistics/statistics.component';
import { NotificationComponent } from './pages/EventAdmin/notification/notification.component';
export const Approutes: Routes = [
  // Authentication Routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'activate-account', component: ActivateAccountComponent },
  { path: 'select-role', component: SelectRoleComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  // User List Route (Root Level, Admin Access)
  {
    path: 'users',
    component: UserListComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_ADMIN'] },
  },

  // FrontOffice Routes
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

  // BackOffice Routes
  {
    path: 'admin',
    component: FullComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
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
        path: 'listBusiness',
        component: BusinessListComponent,
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_ADMIN'] },
      },

      {
        path: 'users',
        component: UserListComponent,
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_ADMIN'] },
      },
    
      { path: 'orders', component: OrderListComponent,
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_ADMIN'] }, },
      { path: 'coupon', component: CouponListComponent ,
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_ADMIN'] },},
      { path: 'coupons/create', component: CouponFormComponent ,
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_ADMIN'] },},
        { path: 'events', component: EventListComponent },
        { path: 'events/add', component:EventAddComponent },
        { path: 'events/history', component: EventHistoryComponent },
        {path: 'events/notif',component:NotificationComponent},
        {path: 'events/:id/manage-registrations', component: ManageEventRegistrationsComponent},
        { path: 'events/:id', component: EventDetailsComponent},
        { path: 'events/update/:id', component: EventUpdateComponent },
        { path: 'events/registrations/:id', component: EventRegistrationsComponent },
        {path: 'events/statistics', component:StatisticsComponent},
    ],
  },

  // Wildcard Route
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(Approutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
