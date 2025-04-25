import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Event } from '../../../services/models';
import { EventManagementService } from '../../../services/services/event-management.service';
import { NotificationManagementService } from '../../../services/services/notification-management.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  paginatedEvents: Event[] = [];
  isLoading = true;
  error: string | null = null;
  page = 1;
  pageSize = 6;
  collectionSize = 0;
  unreadNotificationCount = 0;

  constructor(
    private eventService: EventManagementService,
    private notificationService: NotificationManagementService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadEvents();
    this.loadNotificationCount();
  }

  loadEvents() {
    this.isLoading = true;
    this.eventService.display1().subscribe({
      next: (response) => {
        this.events = response;
        this.collectionSize = this.events.length;
        this.refreshEvents();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading events', error);
        this.error = 'Failed to load events';
        this.isLoading = false;
      }
    });
  }

  loadNotificationCount(): void {
    this.notificationService.getUnreadNotificationCount().subscribe({
      next: (count) => {
        this.unreadNotificationCount = count;
      },
      error: (err) => {
        console.error('Failed to load notification count', err);
        this.unreadNotificationCount = 0; // Fallback to 0
      }
    });
  }

  refreshEvents() {
    this.paginatedEvents = this.events
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  viewDetails(id: number): void {
    this.router.navigate(['admin/events/', id]);
  }

  updateEvent(event: Event): void {
    this.router.navigate(['admin/events/update', event.idEvent]);
  }

  addEvent(): void {
    this.router.navigate(['admin/events/add']);
  }

  viewHistory(): void {
    this.router.navigate(['admin/events/history']);
  }
}