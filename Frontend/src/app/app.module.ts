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

import { FullComponent } from './layouts/full/full.component';


import { NavigationComponent } from './BackOffice/shared/header/navigation.component';
import { SidebarComponent } from './BackOffice/shared/sidebar/sidebar.component';

import { Approutes } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpinnerComponent } from './BackOffice/shared/spinner.component';
import { OrderListComponent } from './pages/Orders/order-list/order-list.component';
import { HomeComponent } from './FrontOffice/home/home.component';
import { OrderDetailsComponent } from './pages/Orders/order-details/order-details.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    OrderListComponent,
    HomeComponent,
    OrderDetailsComponent,
   
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
    MatButtonModule
   
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
