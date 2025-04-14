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
  filteredEvents: EventWithReservationCount[] = [];
  isLoading = true;
  error: string | null = null;
  searchQuery: string = '';

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
        this.filteredEvents = [...this.events];
        this.isLoading = false;
        console.log('Loaded events:', this.events);
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

  filterEvents() {
    if (!this.searchQuery) {
      this.filteredEvents = [...this.events];
      return;
    }
    const query = this.searchQuery.toLowerCase();
    this.filteredEvents = this.events.filter(event => 
      event.event?.title?.toLowerCase().includes(query)
    );
  }

  getRemainingPlaces(event: EventWithReservationCount): number {
    if (!event.event?.numberOfPlaces) {
      return Infinity;
    }
    const remaining = event.event.numberOfPlaces - (event.reservationCount || 0);
    return Math.max(0, remaining);
  }
}