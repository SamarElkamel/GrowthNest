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
    this.eventService.display1().subscribe(
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
    console.log('Attempting to navigate to /admin/events/history');
    this.router.navigate(['admin/events/history']).then(success => {
      console.log('Navigation successful:', success);
    }).catch(err => {
      console.error('Navigation failed:', err);
    });
  }
}