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
import { DisplayAllDeliveryAgencyComponent } from './pages/Delivery-agency/display-all-delivery-agency/display-all-delivery-agency.component';
import { DisplayByIdDeliveryAgencyComponent } from './pages/Delivery-agency/display-by-id-delivery-agency/display-by-id-delivery-agency.component';
import { AddReclamationComponent } from './pages/Reclamation/add-reclamation/add-reclamation.component';
import { DeleteReclamationComponent } from './pages/Reclamation/delete-reclamation/delete-reclamation.component';
import { UpdateReclamationComponent } from './pages/Reclamation/update-reclamation/update-reclamation.component';
import { DisplayReclamationComponent } from './pages/Reclamation/display-reclamation/display-reclamation.component';
import { HeaderComponent } from './FrontOffice/header/header.component';
@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    DisplayAllDeliveryAgencyComponent,
    DisplayByIdDeliveryAgencyComponent,
    AddReclamationComponent,
    DeleteReclamationComponent,
    UpdateReclamationComponent,
    DisplayReclamationComponent,
    HeaderComponent,
    
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
