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

import { FullCalendarModule } from '@fullcalendar/angular';
import { StatisticsComponent } from './pages/EventUser/statistics/statistics.component';
import { NotificationComponent } from './pages/EventAdmin/notification/notification.component';





@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    EventListComponent,
    EventDetailsComponent,
    EventHistoryComponent,
    EventRegistrationsComponent,
    EventAddComponent,
    EventUpdateComponent,
    UserReservationsComponent,
    AddReservationComponent,
    UpdateReservationComponent,
    EventUserDetailsComponent,
    EventUserListComponent,
    ManageEventRegistrationsComponent,
    StatisticsComponent,
    NotificationComponent,
    
    
    
   
 
    
   
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
    FullCalendarModule,

    
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
