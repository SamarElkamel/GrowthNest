import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { BusinessproductsComponent } from 'src/app/pages/products/businessproducts/businessproducts.component';
import { BusinessListFrontComponent } from 'src/app/pages/business/business-list-front/business-list-front.component';
import { WishlistComponent } from 'src/app/pages/products/wishlist/wishlist.component';
import { BusinessDetailsComponent } from 'src/app/pages/business/business-details/business-details.component';
import { LayoutComponent } from '../layout/layout.component';


const routes: Routes = [
      {
    
        path: '',

        component: LayoutComponent,
      children:[
        {path: '',

            component: HomeComponent},
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

      ]
     
    }
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontOfficeRoutingModule { }