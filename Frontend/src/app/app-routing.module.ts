import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListPostComponent } from './pages/post/list-post/list-post.component';
import { HomeComponent } from './frontoffice/home/home.component';
import { AddPostComponent } from './pages/post/add-post/add-post.component';
import { FullComponent } from './layouts/full/full.component';
import { ValidatePostComponent } from './pages/post/validate-post/validate-post.component';


export const Approutes: Routes = [
   // Front Office Routes (Public)
   {
    path: '',
    component: ListPostComponent,
    children: [
      { path: 'posts', component: ListPostComponent },
    ]
  },

  // Admin Routes (Protected)
  {
    path: 'admin',
    component: FullComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () => import('src/app/backoffice/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'about',
        loadChildren: () => import('src/app/backoffice/about/about.module').then(m => m.AboutModule)
      },
      {
        path: 'component',
        loadChildren: () => import('src/app/backoffice/component/component.module').then(m => m.ComponentsModule)
      },
      { path: 'posts', component: ListPostComponent },
      { path: 'post/add', component: AddPostComponent },
      { path: 'post/validate', component: ValidatePostComponent },
      //{ path: 'events/:id', component: EventDetailComponent },
      //{ path: 'events/edit/:id', component: UpdateEventComponent },
      //{ path: 'registrations', component: RegistrationListComponent },
      //{ path: 'registrations/add', component: AddRegistrationComponent },
      //{ path: 'registrations/:id', component: RegistrationDetailComponent },
      //{ path: 'registrations/edit/:id', component: UpdateRegistrationComponent }
 
    ]
  },
  {
    path: '**',
    redirectTo: '/starter'
  }
];
