import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  CommonModule, LocationStrategy,
  PathLocationStrategy
} from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { CodeInputModule } from 'angular-code-input';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FullComponent } from './BackOffice/layouts/full/full.component';




import { Approutes } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ActivateAccountComponent } from './pages/activate-account/activate-account.component';
import { SelectRoleComponent } from './pages/select-role/select-role.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { UserProfileComponent } from './FrontOffice/user-profile/user-profile.component';
import { EditProfileComponent } from './FrontOffice/edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './FrontOffice/change-password/change-password.component';
import { NavigationComponent } from './BackOffice/shared/header/navigation.component';
import { SidebarComponent } from './BackOffice/shared/sidebar/sidebar.component';
import { SpinnerComponent } from './BackOffice/shared/spinner.component';
import { BusinessListComponent } from './pages/business/business-list/business-list.component';
import { AddBusinessComponent } from './pages/business/add-business/add-business.component';
import { BusinessListFrontComponent } from './pages/business/business-list-front/business-list-front.component';
import { HomeComponent } from './FrontOffice/home/home.component';
import { FooterComponent } from './FrontOffice/footer/footer.component';
import { HeaderComponent } from './FrontOffice/header/header.component';
import { BusinessDetailCardComponent } from './pages/business-detail-card/business-detail-card.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BusinessproductsComponent } from './pages/products/businessproducts/businessproducts.component';
import { QuickViewProductFComponent } from './pages/products/quick-view-product-f/quick-view-product-f.component';
import { BusinessDetailBComponent } from './pages/business/business-detail-b/business-detail-b.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AddProductComponent } from './pages/products/add-product/add-product.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UpdateProductDialogComponent } from './pages/products/update-product-dialog/update-product-dialog.component';
import { UpdateBusinessDialogComponent } from './pages/business/update-business-dialog/update-business-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { BusinessDetailsComponent } from './pages/business/business-details/business-details.component';
import { RatingComponent } from './pages/business/rating/rating.component';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { AdminDashboardComponent } from './pages/business/admin-dashboard/admin-dashboard.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { WishlistComponent } from './pages/products/wishlist/wishlist.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { LayoutComponent } from './FrontOffice/layout/layout.component';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
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
    NgbModule,
    FullComponent,
    NavigationComponent,
    SidebarComponent,
    RouterModule.forRoot(Approutes, { useHash: false }),
    CodeInputModule,
    RecaptchaV3Module,
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
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    },
    HttpClient,
    { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: '6LfIuhsrAAAAAIK8Zpv-E_7v8SrOXEUIEntvIP1Z'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
