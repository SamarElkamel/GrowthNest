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
import { CodeInputModule } from 'angular-code-input';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FullComponent } from './BackOffice/layouts/full/full.component';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';



import { Approutes } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpinnerComponent } from './BackOffice/shared/spinner.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ActivateAccountComponent } from './pages/activate-account/activate-account.component';
import { SelectRoleComponent } from './pages/select-role/select-role.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { UserProfileComponent } from './FrontOffice/user-profile/user-profile.component';
import { EditProfileComponent } from './FrontOffice/edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './FrontOffice/change-password/change-password.component';
import { NavigationComponent } from './BackOffice/shared/header/navigation.component';
import { SidebarComponent } from './BackOffice/shared/sidebar/sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    LoginComponent,
    RegisterComponent,
    ActivateAccountComponent,
    SelectRoleComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    UserProfileComponent,
    EditProfileComponent,
    ChangePasswordComponent,
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
    CodeInputModule,
    RecaptchaV3Module,
  ],
  providers: [
    HttpClient,
    
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    },
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: '6LfIuhsrAAAAAIK8Zpv-E_7v8SrOXEUIEntvIP1Z' 
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
