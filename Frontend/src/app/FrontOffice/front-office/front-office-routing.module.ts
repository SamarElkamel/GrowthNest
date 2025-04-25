
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { BusinessproductsComponent } from 'src/app/pages/products/businessproducts/businessproducts.component';
import { BusinessListFrontComponent } from 'src/app/pages/business/business-list-front/business-list-front.component';
import { WishlistComponent } from 'src/app/pages/products/wishlist/wishlist.component';
import { BusinessDetailsComponent } from 'src/app/pages/business/business-details/business-details.component';
import { LayoutComponent } from '../layout/layout.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { RoleGuard } from 'src/app/role.guard';
import { AdminDashboardComponent } from 'src/app/pages/business/admin-dashboard/admin-dashboard.component';
import { AddBusinessComponent } from 'src/app/pages/business/add-business/add-business.component';

import { BusinessDetailBComponent } from 'src/app/pages/business/business-detail-b/business-detail-b.component';
import { AddProductComponent } from 'src/app/pages/products/add-product/add-product.component';
import { CartPageComponent } from '../../pages/cart-page/cart-page.component';
import { OrderHistoryComponent } from '../../pages/order-history/order-history.component';
import { PaymentComponent } from '../../pages/payment/payment.component';

import { EventUserListComponent } from '../../pages/EventUser/event-user-list/event-user-list.component';
import { AddReservationComponent } from '../../pages/EventUser/add-reservation/add-reservation.component';
import { EventUserDetailsComponent } from '../../pages/EventUser/event-user-details/event-user-details.component';
import { UpdateReservationComponent } from '../../pages/EventUser/update-reservation/update-reservation.component';
import { UserReservationsComponent } from '../../pages/EventUser/user-reservations/user-reservations.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  { path: 'cart', component: CartPageComponent },
  { path: 'orders/history', component: OrderHistoryComponent },
  { path: 'payment', component: PaymentComponent },
 
      {
        path: 'business/:businessId/products',
        component: BusinessproductsComponent
      },
      {
        path: 'businesses',
        component: BusinessListFrontComponent,
        title: 'Liste des small business'
      },
      {
        path: 'business-details/:idB',
        component: BusinessDetailsComponent,
        title: 'business details'
      },
      {
        path: 'wishlist',
        component: WishlistComponent
      },
      {
        path: 'profile',
        component: UserProfileComponent,
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_USER', 'ROLE_BusinessOwner', 'ROLE_MarketingAgent'] }
      },
      {
        path: 'updateprofile',
        component: EditProfileComponent,
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_USER', 'ROLE_BusinessOwner', 'ROLE_MarketingAgent'] }
      },
      {
        path: 'EditPassword',
        component: ChangePasswordComponent,
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_USER', 'ROLE_BusinessOwner', 'ROLE_MarketingAgent'] }
      },
      {
        path: 'my-business/:idBusiness',
        component: BusinessDetailBComponent,
      }, {
        path: 'add-product/:idBusiness',
        component: AddProductComponent,
      },
      {
        path: 'businesses/add',
        component: AddBusinessComponent,
      },
      {
        path: 'pending-businesses',
        component: AdminDashboardComponent,
        title: 'Pending Businesses',
      },
      {path: 'events/user', component:EventUserListComponent},
      {path: 'events/user/add' , component:AddReservationComponent},
      {path : 'events/user/reservations', component:UserReservationsComponent},
      
     
      {path: 'events/user/:id',component:EventUserDetailsComponent},
      {path : 'events/user/update/:id' , component:UpdateReservationComponent},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontOfficeRoutingModule { }
