import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { LayoutComponent } from '../layout/layout.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { HomeComponent } from '../home/home.component';
import { FrontOfficeRoutingModule } from './front-office-routing.module';
import { BusinessNotificationModule } from 'src/app/business-notification/business-notification.module';

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FrontOfficeRoutingModule,
    BusinessNotificationModule
  ],
  exports: [
    LayoutComponent
  ]
})
export class FrontOfficeModule { }
