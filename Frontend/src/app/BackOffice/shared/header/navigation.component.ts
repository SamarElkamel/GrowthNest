import { Component, EventEmitter, Output } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { BusinessNotificationModule } from '../../../business-notification/business-notification.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AuthenticationService } from 'src/app/services/services/authentication.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    NgbDropdownModule,
    BusinessNotificationModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './navigation.component.html'
  
})
export class NavigationComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(private authService: AuthenticationService) {}

  logout(): void {
    this.authService.logout();
  }
}