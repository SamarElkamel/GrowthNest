import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateOffreComponent } from './offres/create-offre/create-offre.component';
import { ManageOffresComponent } from '../GestionMarketing/offres/manage-offres/manage-offres.component';
import { SendMailComponent } from '../GestionMarketing/offres//send-mail/send-mail.component'; 


const routes: Routes = [
  { path: 'create-offre', component: CreateOffreComponent },
  {
    path: 'manage-offres',component: ManageOffresComponent},
    { path: 'send-mail', component: SendMailComponent },

    
  
  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionMarketingRoutingModule {}
