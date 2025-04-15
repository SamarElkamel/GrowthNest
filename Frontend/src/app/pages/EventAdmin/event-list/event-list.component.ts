import { Component, OnInit } from '@angular/core';
import { Event } from '../../../services/models';
import { EventManagementService } from '../../../services/services/event-management.service';
import { Router } from '@angular/router';

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
  pageSize = 6; // 6 events per page
  collectionSize = 0;

  constructor(
    private eventService: EventManagementService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.isLoading = true;
    this.eventService.display1().subscribe(
      (response) => {
        this.events = response;
        this.collectionSize = this.events.length;
        this.refreshEvents();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading events', error);
        this.error = 'Failed to load events';
        this.isLoading = false;
      }
    );
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