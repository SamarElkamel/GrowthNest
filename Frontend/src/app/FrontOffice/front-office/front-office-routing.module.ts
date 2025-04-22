import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { RoleGuard } from 'src/app/role.guard';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,

  },
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_USER', 'ROLE_BusinessOwner', 'ROLE_MarketingAgent'] }
  },
  {
    path: 'updateprofile',
    component: EditProfileComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_USER', 'ROLE_BusinessOwner', 'ROLE_MarketingAgent'] }
  },
  {
    path: 'EditPassword',
    component: ChangePasswordComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_USER', 'ROLE_BusinessOwner', 'ROLE_MarketingAgent'] }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontOfficeRoutingModule { }
