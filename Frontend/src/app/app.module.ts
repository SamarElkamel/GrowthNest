import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { CodeInputModule } from 'angular-code-input';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { provideCharts } from 'ng2-charts';

// Angular Material
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';

// Routing & Components
import { Approutes } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpinnerComponent } from './BackOffice/shared/spinner.component';
import { FullComponent } from './BackOffice/layouts/full/full.component';
import { BackLayoutComponent } from './BackOffice/layouts/back-layout/back-layout.component';
import { NavigationComponent } from './BackOffice/shared/header/navigation.component';
import { SidebarComponent } from './BackOffice/shared/sidebar/sidebar.component';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ActivateAccountComponent } from './pages/activate-account/activate-account.component';
import { SelectRoleComponent } from './pages/select-role/select-role.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { UserProfileComponent } from './FrontOffice/user-profile/user-profile.component';
import { EditProfileComponent } from './FrontOffice/edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './FrontOffice/change-password/change-password.component';
import { LayoutComponent } from './FrontOffice/layout/layout.component';

import { OrderListComponent } from './pages/Orders/order-list/order-list.component';
import { OrderDetailsComponent } from './pages/Orders/order-details/order-details.component';
import { CouponListComponent } from './pages/Orders/coupon-list/coupon-list.component';
import { CouponFormComponent } from './pages/Orders/coupon-form/coupon-form.component';
import { CouponAnalyticsComponent } from './pages/Orders/coupon-analytics/coupon-analytics.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { AddressPickerComponent } from './pages/address-picker/address-picker.component';

import { BusinessListComponent } from './pages/business/business-list/business-list.component';
import { AddBusinessComponent } from './pages/business/add-business/add-business.component';
import { BusinessListFrontComponent } from './pages/business/business-list-front/business-list-front.component';
import { BusinessDetailCardComponent } from './pages/business-detail-card/business-detail-card.component';
import { BusinessDetailBComponent } from './pages/business/business-detail-b/business-detail-b.component';
import { BusinessDetailsComponent } from './pages/business/business-details/business-details.component';
import { UpdateBusinessDialogComponent } from './pages/business/update-business-dialog/update-business-dialog.component';
import { RatingComponent } from './pages/business/rating/rating.component';
import { AdminDashboardComponent } from './pages/business/admin-dashboard/admin-dashboard.component';

import { BusinessproductsComponent } from './pages/products/businessproducts/businessproducts.component';
import { QuickViewProductFComponent } from './pages/products/quick-view-product-f/quick-view-product-f.component';
import { AddProductComponent } from './pages/products/add-product/add-product.component';
import { UpdateProductDialogComponent } from './pages/products/update-product-dialog/update-product-dialog.component';
import { WishlistComponent } from './pages/products/wishlist/wishlist.component';

import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { UserListComponent } from './BackOffice/component/users-list/users-list.component';

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
  
    OrderHistoryComponent,
    PaymentComponent,
    AddressPickerComponent,
    LoginComponent,
    RegisterComponent,
    ActivateAccountComponent,
    SelectRoleComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    UserProfileComponent,
    EditProfileComponent,
    ChangePasswordComponent,
    BusinessListComponent,
    AddBusinessComponent,
    BusinessListFrontComponent,
    BusinessDetailCardComponent,
    BusinessproductsComponent,
    QuickViewProductFComponent,
    BusinessDetailBComponent,
    AddProductComponent,
    UpdateProductDialogComponent,
    UpdateBusinessDialogComponent,
    BusinessDetailsComponent,
    RatingComponent,
    AdminDashboardComponent,
    WishlistComponent, 
 

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(Approutes, { useHash: false }),
    LeafletModule,
    CodeInputModule,
    RecaptchaV3Module,
    SweetAlert2Module.forRoot(),
    NgbModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSelectModule,
    MatPaginatorModule,
    NavigationComponent,
    FullComponent,
    SidebarComponent
   
  ],
  providers: [
    provideCharts(),
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,
    },
    HttpClient,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoggingInterceptor,
      multi: true
    },
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: '6LfIuhsrAAAAAIK8Zpv-E_7v8SrOXEUIEntvIP1Z'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
