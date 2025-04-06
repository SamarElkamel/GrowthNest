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

import { FullComponent } from 'src/app/BackOffice/layouts/full/full.component';


import { NavigationComponent } from 'src/app/BackOffice/shared/header/navigation.component';
import { SidebarComponent } from 'src/app/BackOffice/shared/sidebar/sidebar.component';

import { Approutes } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpinnerComponent } from 'src/app/BackOffice/shared/spinner.component';
import { HomeComponent } from './FrontOffice/home/home.component';
import { FooterComponent } from './FrontOffice/footer/footer.component';
import { HeaderComponent } from 'src/app/FrontOffice/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    HomeComponent,
    FooterComponent,
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
