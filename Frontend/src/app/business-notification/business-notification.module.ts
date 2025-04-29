import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BusinessNotificationDropdownComponent } from './components/business-notification-dropdown/business-notification-dropdown.component';
import { BusinessNotificationItemComponent } from './components/business-notification-item/business-notification-item.component';
import { DateUtilsService } from '../services/services/dateUtilsService.Service';


@NgModule({
  declarations: [
    BusinessNotificationDropdownComponent,
    BusinessNotificationItemComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [
    BusinessNotificationDropdownComponent
  ],
  providers: [DateUtilsService]
})
export class BusinessNotificationModule { }