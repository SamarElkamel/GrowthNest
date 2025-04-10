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

  // Minimal additions for template compatibility
  filteredEvents: EventWithReservationCount[] = [];
  categories: string[] = []; // Empty array since we won't use filtering
  featuredEvent: EventWithReservationCount | null = null;

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
        this.filteredEvents = [...this.events]; // For template compatibility
        this.setFeaturedEvent(); // For template compatibility
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

  // Minimal additions for template compatibility
  private setFeaturedEvent(): void {
    if (this.events.length > 0) {
      this.featuredEvent = this.events[0]; // Just use first event as featured
    }
  }
  searchQuery: string = '';

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

}