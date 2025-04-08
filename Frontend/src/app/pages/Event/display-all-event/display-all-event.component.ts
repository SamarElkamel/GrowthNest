import { Component, OnInit } from '@angular/core';
import { Event } from '../../../services/models';
import { EventManagementService } from '../../../services/services/event-management.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './display-all-event.component.html',
  styleUrls: ['./display-all-event.component.scss']
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  isLoading = true;

  constructor(private eventService: EventManagementService) {}

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
        this.isLoading = false;
      }
    );
  }

  
}