import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { NotificationE } from 'src/app/services/models/notificationE';
import { AuthenticationService } from 'src/app/services/services/authentication.service';
import { BusinessNotificationService } from 'src/app/services/services/BusinessNotificationService.service';
import { TokenService } from 'src/app/services/token/token.service';


@Component({
  selector: 'app-business-notification-dropdown',
  templateUrl: './business-notification-dropdown.component.html',
  styleUrls: ['./business-notification-dropdown.component.scss']
})
export class BusinessNotificationDropdownComponent implements OnInit, OnDestroy {
  notifications: NotificationE[] = [];
  isDropdownOpen = false;
  unreadCount = 0;
  private subscription: Subscription = new Subscription();

  constructor(
    private notificationService: BusinessNotificationService,
    private authService: AuthenticationService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      //this.notificationService.initializeWebSocket();
      //this.notificationService.loadInitialNotifications();
      this.subscription.add(
        this.notificationService.notifications$.subscribe((notifications) => {
          this.notifications = notifications;
          this.unreadCount = notifications.filter(n => !n.isRead).length;
        })
      );
    }
  }

  ngOnDestroy(): void {
    //this.notificationService.disconnectWebSocket();
    this.subscription.unsubscribe();
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

 /* markAsRead(notification: NotificationE): void {
    if (!notification.isRead) {
      //this.notificationService.markAsRead(notification.id).subscribe({
        next: () => {
          notification.isRead = true;
          this.unreadCount = this.notifications.filter(n => !n.isRead).length;
        },
        error: (err) => console.error('Error marking notification as read:', err)
      });
    }
  }

  approveBusiness(notification: NotificationE): void {
    if (notification.business) {
      this.notificationService.approveBusiness(notification.business.idBusiness).subscribe({
        next: () => {
          this.markAsRead(notification);
        },
        error: (err) => console.error('Error approving business:', err)
      });
    }
  }

  rejectBusiness(notification: NotificationE): void {
    if (notification.business) {
      this.notificationService.rejectBusiness(notification.business.idBusiness).subscribe({
        next: () => {
          this.markAsRead(notification);
        },
        error: (err) => console.error('Error rejecting business:', err)
      });
    }
  }

  isAdmin(): boolean {
    const role = this.tokenService.getUserRole();
    return role === 'ROLE_ADMIN';
  }*/
}