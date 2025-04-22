import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FullComponent } from './BackOffice/layouts/full/full.component';
import { NavigationComponent } from './BackOffice/shared/header/navigation.component';
import { SidebarComponent } from './BackOffice/shared/sidebar/sidebar.component';
import { Approutes } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpinnerComponent } from './BackOffice/shared/spinner.component';
import { OrderListComponent } from './pages/Orders/order-list/order-list.component';
import { OrderDetailsComponent } from './pages/Orders/order-details/order-details.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { provideCharts } from 'ng2-charts';
import { CouponListComponent } from './pages/Orders/coupon-list/coupon-list.component';
import { CouponFormComponent } from './pages/Orders/coupon-form/coupon-form.component';
import { BackLayoutComponent } from './BackOffice/layouts/back-layout/back-layout.component';
import { CouponAnalyticsComponent } from './pages/Orders/coupon-analytics/coupon-analytics.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { ProduitsComponent } from './pages/produits/produits.component';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { AddressPickerComponent } from './pages/address-picker/address-picker.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

export function playerFactory() {
 
}
@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    OrderListComponent,
    OrderDetailsComponent,
    CouponListComponent,
    CouponFormComponent,
    BackLayoutComponent,
    CouponAnalyticsComponent,
    CartPageComponent,
    ProduitsComponent,
    OrderHistoryComponent,
    PaymentComponent,
    AddressPickerComponent,
  
    
   
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    RouterModule.forRoot(Approutes, { useHash: false }),
    FullComponent,
    NavigationComponent,
    SidebarComponent,
    MatDialogModule,
    MatButtonModule,
    LeafletModule

 
   
  ],
  providers: [provideCharts(),
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,
      
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
