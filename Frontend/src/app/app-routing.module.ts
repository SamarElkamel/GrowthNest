import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FullComponent } from 'src/app/BackOffice/layouts/full/full.component';
import { EventListComponent } from './pages/Event/display-all-event/display-all-event.component';
import { AddEventComponent } from './pages/Event/add-event/add-event.component';
import { EventDetailComponent } from './pages/Event/display-event-by-id/display-event-by-id.component';
import { UpdateEventComponent } from './pages/Event/update-event/update-event.component';
import { RegistrationListComponent } from './pages/Reservation/display-all-reservation/display-all-reservation.component';
import { AddRegistrationComponent } from './pages/Reservation/add-reservation/add-reservation.component';
import { RegistrationDetailComponent } from './pages/Reservation/display-reservation-by-id/display-reservation-by-id.component';
import { UpdateRegistrationComponent } from './pages/Reservation/update-reservation/update-reservation.component';

export const Approutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () => import('src/app/BackOffice/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'about',
        loadChildren: () => import('src/app/BackOffice/about/about.module').then(m => m.AboutModule)
      },
      {
        path: 'component',
        loadChildren: () => import('src/app/BackOffice/component/component.module').then(m => m.ComponentsModule)
      },
      {
        path: 'events', component: EventListComponent
      },
      {
        path: 'events/add', component: AddEventComponent
      },
      {
        path: 'events/:id', component: EventDetailComponent
      },
      {
        path: 'events/edit/:id', component: UpdateEventComponent
      },
      { path: 'registrations', component: RegistrationListComponent },
      { path: 'registrations/add', component: AddRegistrationComponent },
      { path: 'registrations/:id', component: RegistrationDetailComponent },
      { path: 'registrations/edit/:id', component: UpdateRegistrationComponent },
      
      
    ]
  },
  {
    path: '**',
    redirectTo: '/starter'
  }
];
