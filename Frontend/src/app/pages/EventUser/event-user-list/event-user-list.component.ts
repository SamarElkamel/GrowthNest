// event-list.component.ts (unchanged)
import { Component, OnInit } from '@angular/core';
import { EventWithReservationCount } from '../../../services/models';
import { EventManagementService } from '../../../services/services/event-management.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-user-list',
  templateUrl: './event-user-list.component.html'
})
export class EventUserListComponent implements OnInit {
  events: EventWithReservationCount[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private eventService: EventManagementService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.isLoading = true;
    this.eventService.getAvailableEventsWithReservationCount().subscribe(
      (response) => {
        this.events = response;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading events', error);
        this.error = 'Failed to load events';
        this.isLoading = false;
      }
    );
  }

  viewEventDetails(id: number): void {
    this.router.navigate(['/events/user', id]);
  }
}