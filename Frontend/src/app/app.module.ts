
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

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FullComponent } from './BackOffice/layouts/full/full.component';


import { NavigationComponent } from './BackOffice/shared/header/navigation.component';
import { SidebarComponent } from './BackOffice/shared/sidebar/sidebar.component';

import { Approutes } from './app-routing.module';
import { AppComponent } from './app.component';
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

@NgModule({
  declarations: [
    AppComponent,
   
    SpinnerComponent,
    BusinessListComponent,
    AddBusinessComponent,
    BusinessListFrontComponent,
    HomeComponent,
    FooterComponent,
    HeaderComponent,
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
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    RouterModule.forRoot(Approutes, { useHash: false }),
    FormsModule,
    FullComponent,
    NavigationComponent,
    SidebarComponent,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatFormFieldModule, // Pour mat-form-field
    MatInputModule, // Pour mat-input et textarea
    MatCardModule,
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
    { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
