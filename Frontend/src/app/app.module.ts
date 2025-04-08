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

import { FullComponent } from 'src/app/layouts/full/full.component';


import { NavigationComponent } from 'src/app/BackOffice/shared/header/navigation.component';
import { SidebarComponent } from 'src/app/BackOffice/shared/sidebar/sidebar.component';

import { Approutes } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpinnerComponent } from 'src/app/BackOffice/shared/spinner.component';
import { HomeComponent } from './FrontOffice/home/home.component';
import { FooterComponent } from './FrontOffice/footer/footer.component';
import { HeaderComponent } from 'src/app/FrontOffice/header/header.component';
import { AddEventComponent } from './pages/Event/add-event/add-event.component';
import { UpdateEventComponent } from './pages/Event/update-event/update-event.component';
import { EventListComponent } from './pages/Event/display-all-event/display-all-event.component';
import { EventDetailComponent } from './pages/Event/display-event-by-id/display-event-by-id.component';
import { AddRegistrationComponent } from './pages/Reservation/add-reservation/add-reservation.component';
import { UpdateRegistrationComponent } from './pages/Reservation/update-reservation/update-reservation.component';
import { RegistrationListComponent } from './pages/Reservation/display-all-reservation/display-all-reservation.component';
import { RegistrationDetailComponent } from './pages/Reservation/display-reservation-by-id/display-reservation-by-id.component';



@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    AddEventComponent,
    UpdateEventComponent,
    EventListComponent,
    EventDetailComponent,
    AddRegistrationComponent,
    UpdateRegistrationComponent,
    RegistrationListComponent,
    RegistrationDetailComponent,
 
    
   
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
