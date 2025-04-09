import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestionMarketingRoutingModule } from '../GestionMarketing/gestion-marketing-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CreateOffreComponent } from '../GestionMarketing/offres/create-offre/create-offre.component';
import { ManageOffresComponent } from '../GestionMarketing/offres/manage-offres/manage-offres.component';
import { SendMailComponent } from '../GestionMarketing/offres/send-mail/send-mail.component';




@NgModule({
  declarations: [
    CreateOffreComponent, ManageOffresComponent,SendMailComponent
    
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    GestionMarketingRoutingModule
  ]
})
export class GestionMarketingModule { }
