
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  CommonModule, LocationStrategy,
  PathLocationStrategy
} from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FullComponent } from './backoffice/layouts/full/full.component';


import { NavigationComponent } from './backoffice/shared/header/navigation.component';
import { SidebarComponent } from './backoffice/shared/sidebar/sidebar.component';

import { Approutes } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpinnerComponent } from './backoffice/shared/spinner.component';
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
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    },
    HttpClient
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
