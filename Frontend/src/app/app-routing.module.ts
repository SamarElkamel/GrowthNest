import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FullComponent } from 'src/app/layouts/full/full.component';

import { HomeComponent } from './FrontOffice/home/home.component';
import { EventListComponent } from './pages/EventAdmin/event-list/event-list.component';

import { EventUpdateComponent } from './pages/EventAdmin/update-event/update-event.component';
import { EventRegistrationsComponent } from './pages/EventAdmin/event-registrations/event-registrations.component';
import { EventHistoryComponent } from './pages/EventAdmin/event-history/event-history.component';
import { EventAddComponent } from './pages/EventAdmin/add-event/add-event.component';
import { EventDetailsComponent } from './pages/EventAdmin/event-details/event-details.component';

export const Approutes: Routes = [
  // Front Office Routes (Public)
  {
    path: '',
    component: HomeComponent
  },

  // Admin Routes (Protected)
  {
    path: 'admin',
    component: FullComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
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
      { path: 'events', component: EventListComponent },
      { path: 'events/add', component:EventAddComponent },
      { path: 'events/history', component: EventHistoryComponent },
      { path: 'events/:id', component: EventDetailsComponent},
      { path: 'events/update/:id', component: EventUpdateComponent },
      { path: 'events/registrations/:id', component: EventRegistrationsComponent },
     
    
    ]
  },

  // Fallback Route
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(Approutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }