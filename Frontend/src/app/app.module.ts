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
import { NgChartsModule } from 'ng2-charts';

import { Approutes } from './app-routing.module';
import { AppComponent } from './app.component';

import { SpinnerComponent } from './BackOffice/shared/spinner.component';
import { NavigationComponent } from './BackOffice/shared/header/navigation.component';
import { SidebarComponent } from './BackOffice/shared/sidebar/sidebar.component';
import { AddResponsComponent } from './pages/respons/add-respons/add-respons.component';
import { ListResponsComponent } from './pages/respons/list-respons/list-respons.component';
import { UpdateResponsComponent } from './pages/respons/update-respons/update-respons.component';
import { DeleteResponsComponent } from './pages/respons/delete-respons/delete-respons.component';
import { AddPostComponent } from './pages/post/add-post/add-post.component';
import { ListPostComponent } from './pages/post/list-post/list-post.component';
import { UpdatePostComponent } from './pages/post/update-post/update-post.component';
import { DeletePostComponent } from './pages/post/delete-post/delete-post.component';
import { FullComponent } from './BackOffice/layouts/full/full.component';    
import { HeaderComponent } from './FrontOffice/header/header.component';
import { FooterComponent } from './FrontOffice/footer/footer.component';
import { HomeComponent } from './FrontOffice/home/home.component';
import { ValidatePostComponent } from './pages/post/validate-post/validate-post.component';
import { AdminStatsComponent } from './pages/admin-stats/admin-stats.component'; // Chemin corrigé

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    AddResponsComponent,
    ListResponsComponent,
    UpdateResponsComponent,
    DeleteResponsComponent,
    AddPostComponent,
    ListPostComponent,
    UpdatePostComponent,
    DeletePostComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ValidatePostComponent,
    AdminStatsComponent
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
    NgChartsModule,
    FullComponent,
    NavigationComponent,
    SidebarComponent
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