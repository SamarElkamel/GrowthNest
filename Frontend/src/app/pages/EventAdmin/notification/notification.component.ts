import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationManagementService } from '../../../services/services/notification-management.service';
import { RegistrationManagementService } from '../../../services/services/registration-management.service';
import { Notification } from 'src/app/services/models/notificationE';


@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];
  paginatedNotifications: Notification[] = [];
  selectedRegistrations: { [key: number]: boolean } = {};
  isLoading = false; // Initialize as false to avoid initial loading state
  error: string | null = null;
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  hasSelectedRegistrations = false;

  constructor(
    private notificationService: NotificationManagementService,
    private registrationService: RegistrationManagementService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.isLoading = true;
    this.error = null;
    this.notificationService.getUnreadNotifications().subscribe({
      next: (notifications) => {
        // Filter notifications to show only those for PENDING registrations
        this.notifications = notifications.filter(n => 
          n.registration?.status === 'PENDING'
        );
        this.collectionSize = this.notifications.length;
        this.refreshNotifications();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load notifications';
        this.isLoading = false;
        console.error('Error loading notifications:', err);
      }
    });
  }

  refreshNotifications(): void {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedNotifications = this.notifications.slice(start, end);
    this.updateHasSelectedRegistrations();
  }

  updateStatus(registrationId: number, status: 'CONFIRMED' | 'CANCELED'): void {
    if (this.isLoading) return;

    this.isLoading = true;
    this.error = null;

    this.registrationService.updateRegistrationStatus({ 
      idR: registrationId, 
      status 
    }).subscribe({
      next: () => {
        this.isLoading = false;
        console.log(`Registration ${status.toLowerCase()} successfully`);
        // Refresh notifications
        this.loadNotifications();
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 403) {
          this.error = 'Permission denied. Please log in again.';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        } else if (err.status === 404) {
          this.error = 'Registration not found.';
        } else {
          this.error = `Failed to update registration: ${err.error?.message || 'Unknown error'}`;
        }
        console.error('Error updating registration:', err);
        setTimeout(() => this.error = null, 5000);
      }
    });
  }

  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.paginatedNotifications.forEach(notification => {
      if (notification.registration?.idRegist) {
        this.selectedRegistrations[notification.registration.idRegist] = checked;
      }
    });
    this.updateHasSelectedRegistrations();
  }

  updateSelection(registrationId: number): void {
    this.updateHasSelectedRegistrations();
  }

  updateHasSelectedRegistrations(): void {
    this.hasSelectedRegistrations = Object.values(this.selectedRegistrations).some(selected => selected);
  }

  bulkUpdate(status: 'CONFIRMED' | 'CANCELED'): void {
    const statusUpdates: { [key: string]: 'CONFIRMED' | 'CANCELED' } = {};
    Object.keys(this.selectedRegistrations).forEach(id => {
      if (this.selectedRegistrations[Number(id)]) {
        statusUpdates[id] = status;
      }
    });

    this.isLoading = true;
    this.error = null;
    this.registrationService.bulkUpdateRegistrationStatus({ body: statusUpdates }).subscribe({
      next: () => {
        this.selectedRegistrations = {};
        this.isLoading = false;
        this.loadNotifications();
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Failed to bulk update registrations';
        console.error('Error bulk updating registrations:', err);
        setTimeout(() => this.error = null, 5000);
      }
    });
  }

  markAsRead(id: number): void {
    this.isLoading = true;
    this.error = null;
    this.notificationService.markAsRead({ id }).subscribe({
      next: () => {
        this.isLoading = false;
        this.loadNotifications();
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Failed to mark notification as read';
        console.error('Error marking notification as read:', err);
        setTimeout(() => this.error = null, 5000);
      }
    });
  }

  markAllAsRead(): void {
    this.isLoading = true;
    this.error = null;
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.isLoading = false;
        this.loadNotifications();
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Failed to mark all notifications as read';
        console.error('Error marking all notifications as read:', err);
        setTimeout(() => this.error = null, 5000);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/events']);
  }

  getSelectedCount(): number {
    return Object.values(this.selectedRegistrations).filter(Boolean).length;
  }
}