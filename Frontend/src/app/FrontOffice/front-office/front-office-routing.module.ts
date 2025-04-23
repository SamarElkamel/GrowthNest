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
import { BusinessListComponent } from 'src/app/pages/business/business-list/business-list.component';
import { BusinessDetailBComponent } from 'src/app/pages/business/business-detail-b/business-detail-b.component';
import { AddProductComponent } from 'src/app/pages/products/add-product/add-product.component';

const routes: Routes = [
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
    
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontOfficeRoutingModule { }
