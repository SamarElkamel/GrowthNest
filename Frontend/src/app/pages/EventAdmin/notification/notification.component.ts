import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationManagementService } from '../../../services/services/notification-management.service';
import { RegistrationManagementService } from '../../../services/services/registration-management.service';
import { EventManagementService } from '../../../services/services/event-management.service';
import {  Event as AppEvent, Registration } from '../../../services/models'; // Rename Event to AppEvent
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
  events: { [key: number]: AppEvent } = {}; // Use AppEvent
  isLoading = false;
  error: string | null = null;
  successMessage: string | null = null;
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  hasSelectedRegistrations = false;

  constructor(
    private notificationService: NotificationManagementService,
    private registrationService: RegistrationManagementService,
    private eventService: EventManagementService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.isLoading = true;
    this.error = null;
    this.successMessage = null;
    this.notificationService.getUnreadNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications.filter(n => n.registration?.status === 'PENDING');
        this.collectionSize = this.notifications.length;
        this.loadEventsForNotifications();
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

  loadEventsForNotifications(): void {
    const eventIds = [...new Set(this.notifications
      .map(n => n.registration?.event?.idEvent)
      .filter(id => id !== undefined))] as number[];
    
    eventIds.forEach(eventId => {
      this.eventService.displayEvent({ idE: eventId }).subscribe({
        next: (event) => {
          this.events[eventId] = event;
          // Fetch registrations for this event
          this.registrationService.displayByEvent({ eventId }).subscribe({
            next: (registrations) => {
              this.events[eventId].registrations = registrations || [];
            },
            error: (err) => {
              console.error(`Error loading registrations for event ${eventId}:`, err);
            }
          });
        },
        error: (err) => {
          console.error(`Error loading event ${eventId}:`, err);
        }
      });
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
    this.successMessage = null;

    this.registrationService.updateRegistrationStatus({ idR: registrationId, status }).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = `Registration ${status.toLowerCase()} successfully`;
        this.loadNotifications();
        setTimeout(() => this.successMessage = null, 3000);
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

  toggleSelectAll(event: Event): void { // Use DOM Event
    const checked = (event as any).target.checked; // Fallback to any
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
    this.successMessage = null;

    this.registrationService.bulkUpdateRegistrationStatus({ body: statusUpdates }).subscribe({
      next: () => {
        this.selectedRegistrations = {};
        this.isLoading = false;
        this.successMessage = `Selected registrations ${status.toLowerCase()} successfully`;
        this.loadNotifications();
        setTimeout(() => this.successMessage = null, 3000);
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
    this.successMessage = null;
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
    this.successMessage = null;
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

  getRemainingPlaces(eventId: number): number {
    const event = this.events[eventId];
    if (!event || event.numberOfPlaces === undefined) {
      return Infinity;
    }
    const confirmedAndPending = (event.registrations || []).filter(
      reg => reg.status === 'CONFIRMED' || reg.status === 'PENDING'
    ).length;
    return Math.max(0, event.numberOfPlaces - confirmedAndPending);
  }
}