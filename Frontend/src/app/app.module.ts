import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';

import { CodeInputModule } from 'angular-code-input';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
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

import { FullComponent } from './BackOffice/layouts/full/full.component';
import { NavigationComponent } from './BackOffice/shared/header/navigation.component';
import { SidebarComponent } from './BackOffice/shared/sidebar/sidebar.component';

// Routing & Components
import { Approutes } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpinnerComponent } from './BackOffice/shared/spinner.component';
import { BackLayoutComponent } from './BackOffice/layouts/back-layout/back-layout.component';

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
import { HomeComponent } from './FrontOffice/home/home.component';
import { FooterComponent } from './FrontOffice/footer/footer.component';
import { HeaderComponent } from './FrontOffice/header/header.component';

import { EventListComponent } from './pages/EventAdmin/event-list/event-list.component';
import { EventDetailsComponent } from './pages/EventAdmin/event-details/event-details.component';
import { EventHistoryComponent } from './pages/EventAdmin/event-history/event-history.component';
import { EventRegistrationsComponent } from './pages/EventAdmin/event-registrations/event-registrations.component';
import { EventAddComponent } from './pages/EventAdmin/add-event/add-event.component';
import { EventUpdateComponent } from './pages/EventAdmin/update-event/update-event.component';
import { UserReservationsComponent } from './pages/EventUser/user-reservations/user-reservations.component';
import { AddReservationComponent } from './pages/EventUser/add-reservation/add-reservation.component';
import { UpdateReservationComponent } from './pages/EventUser/update-reservation/update-reservation.component';
import { EventUserListComponent } from './pages/EventUser/event-user-list/event-user-list.component';
import { EventUserDetailsComponent } from './pages/EventUser/event-user-details/event-user-details.component';
import { ManageEventRegistrationsComponent } from './pages/EventAdmin/manage-event-registrations/manage-event-registrations.component';
import { StatisticsComponent } from './pages/EventUser/statistics/statistics.component';
import { NotificationComponent } from './pages/EventAdmin/notification/notification.component';

import { FullCalendarModule } from '@fullcalendar/angular';

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    OrderListComponent,
    OrderDetailsComponent,
    CouponListComponent,
    CouponFormComponent,
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
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    FullComponent,
    NavigationComponent,
    SidebarComponent,
    BackLayoutComponent,
    EventListComponent,
    EventDetailsComponent,
    EventHistoryComponent,
    EventRegistrationsComponent,
    EventAddComponent,
    EventUpdateComponent,
    UserReservationsComponent,
    AddReservationComponent,
    UpdateReservationComponent,
    EventUserListComponent,
    EventUserDetailsComponent,
    ManageEventRegistrationsComponent,
    StatisticsComponent,
    NotificationComponent,
    UserListComponent,
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
    FullCalendarModule
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
      multi: true,
    },
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: '6LfIuhsrAAAAAIK8Zpv-E_7v8SrOXEUIEntvIP1Z',
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
