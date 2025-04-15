import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component'; // Import HomeComponent
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';

const routes: Routes = [
  { path: '', component: HomeComponent } ,
  { path: 'profile', component: UserProfileComponent },
  { path: 'updateprofile', component: EditProfileComponent },
  { path: 'EditPassword', component: ChangePasswordComponent },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontOfficeRoutingModule { }
