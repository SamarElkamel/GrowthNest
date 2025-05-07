import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { CodeInputModule } from 'angular-code-input';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { provideCharts } from 'ng2-charts';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgModule } from '@angular/core';


//Angular Material
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { FullComponent } from './BackOffice/layouts/full/full.component';
import { NavigationComponent } from './BackOffice/shared/header/navigation.component';
import { SidebarComponent } from './BackOffice/shared/sidebar/sidebar.component';
import { AppComponent } from './app.component';
import { SpinnerComponent } from './BackOffice/shared/spinner.component';
import { BackLayoutComponent } from './BackOffice/layouts/back-layout/back-layout.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';




// Pages Auth/User
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ActivateAccountComponent } from './pages/activate-account/activate-account.component';
import { SelectRoleComponent } from './pages/select-role/select-role.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { UserProfileComponent } from './FrontOffice/user-profile/user-profile.component';
import { EditProfileComponent } from './FrontOffice/edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './FrontOffice/change-password/change-password.component';

// Orders/Paiement
import { OrderListComponent } from './pages/Orders/order-list/order-list.component';
import { OrderDetailsComponent } from './pages/Orders/order-details/order-details.component';
import { CouponListComponent } from './pages/Orders/coupon-list/coupon-list.component';
import { CouponFormComponent } from './pages/Orders/coupon-form/coupon-form.component';
import { CouponAnalyticsComponent } from './pages/Orders/coupon-analytics/coupon-analytics.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { AddressPickerComponent } from './pages/address-picker/address-picker.component';

// Business/Products
import { BusinessListComponent } from './pages/business/business-list/business-list.component';
import { AddBusinessComponent } from './pages/business/add-business/add-business.component';
import { BusinessListFrontComponent } from './pages/business/business-list-front/business-list-front.component';
import { BusinessDetailCardComponent } from './pages/business-detail-card/business-detail-card.component';
import { BusinessproductsComponent } from './pages/products/businessproducts/businessproducts.component';
import { QuickViewProductFComponent } from './pages/products/quick-view-product-f/quick-view-product-f.component';
import { BusinessDetailBComponent } from './pages/business/business-detail-b/business-detail-b.component';
import { UpdateBusinessDialogComponent } from './pages/business/update-business-dialog/update-business-dialog.component';
import { BusinessDetailsComponent } from './pages/business/business-details/business-details.component';
import { RatingComponent } from './pages/business/rating/rating.component';
import { AdminDashboardComponent } from './pages/business/admin-dashboard/admin-dashboard.component';
import { WishlistComponent } from './pages/products/wishlist/wishlist.component';

// Events/Reservations
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
import { CalendarEventComponent } from './pages/EventUser/calendar-event/calendar-event.component';

// Autres
import { UserListComponent } from './BackOffice/component/users-list/users-list.component';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import {Approutes} from "./app-routing.module";
import { AddProductComponent } from './pages/products/add-product/add-product.component';
import { UpdateProductDialogComponent } from './pages/products/update-product-dialog/update-product-dialog.component';
import { BusinessTodoListComponent } from './pages/business/business-todo-list/business-todo-list.component';
import { TaskDialogComponent } from './pages/business/task-dialog/task-dialog.component';
import { AdminStatisticsComponent } from './pages/business/admin-statistics/admin-statistics.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { StockManagementComponent } from './pages/products/stock-management/stock-management.component';
import { MyBusinessListComponent } from './pages/business/my-business-list/my-business-list.component';
import { RevenueDashboardComponent } from './pages/business/revenue-dashboard/revenue-dashboard.component';
import { BusinessNotificationModule } from './business-notification/business-notification.module';
import { BusinessNotificationDropdownComponent } from './business-notification/components/business-notification-dropdown/business-notification-dropdown.component';

//
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core';
import { OrderDetailsModalComponent } from './BackOffice/component/order-details-modals/order-details-modals.component';
import { ChatComponent } from './chat/chat.component';



@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    //order
    OrderDetailsModalComponent,
    OrderListComponent,
    OrderDetailsComponent,
    CouponListComponent,
    CouponFormComponent,
    CouponAnalyticsComponent,
    CartPageComponent,
    OrderHistoryComponent,
    PaymentComponent,
    AddressPickerComponent,
    //user
    LoginComponent,
    RegisterComponent,
    ActivateAccountComponent,
    SelectRoleComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    UserProfileComponent,
    EditProfileComponent,
    ChangePasswordComponent,
    UserListComponent,
    //business
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

    BackLayoutComponent,
    //Event
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
    CalendarEventComponent,
    BusinessTodoListComponent,
    TaskDialogComponent,
    AdminStatisticsComponent,
    StockManagementComponent,
    MyBusinessListComponent,
    RevenueDashboardComponent,
ChatComponent,


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
    FullComponent,
    NavigationComponent,
    SidebarComponent,
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
    FullCalendarModule,
    NgbPaginationModule,
    MatCheckboxModule,
    DragDropModule,
    NgApexchartsModule,
    MatChipsModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatDividerModule,
    MatChipsModule,
    MatListModule,
    MatDatepickerModule,
    MatMenuModule,
    MatNativeDateModule

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
