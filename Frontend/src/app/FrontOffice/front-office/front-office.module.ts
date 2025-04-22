import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // ✅ Needed for router-outlet

// Import your components
import { LayoutComponent } from '../layout/layout.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { HomeComponent } from '../home/home.component'; // Import HomeComponent

import { FrontOfficeRoutingModule } from './front-office-routing.module';

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent  
  ],
  imports: [
    CommonModule,
    RouterModule, 
    FrontOfficeRoutingModule
  ],
  exports: [
    LayoutComponent 
  ]
})
export class FrontOfficeModule { }