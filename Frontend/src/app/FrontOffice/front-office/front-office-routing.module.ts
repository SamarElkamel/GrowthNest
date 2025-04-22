
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { CartPageComponent } from '../../pages/cart-page/cart-page.component';
import { ProduitsComponent } from '../../pages/produits/produits.component';
import { OrderHistoryComponent } from '../../pages/order-history/order-history.component';
import { PaymentComponent } from '../../pages/payment/payment.component';
import { LayoutComponent } from '../layout/layout.component';

const routes: Routes = [
    {
      path: '',
      component: LayoutComponent, 
      children: [
        { path: '', component: HomeComponent },
        { path: 'cart', component: CartPageComponent },
        { path: 'produits', component: ProduitsComponent },
        { path: 'orders/history', component: OrderHistoryComponent },
        { path: 'payment', component: PaymentComponent }
      ]
    }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class FrontOfficeRoutingModule { }