import { Component, OnInit } from '@angular/core';
import { Event } from '../../../services/models';
import { EventManagementService } from '../../../services/services/event-management.service';

@Component({
  selector: 'app-event-history',
  templateUrl: './event-history.component.html',
  styleUrls: ['./event-history.component.scss']
})
export class EventHistoryComponent implements OnInit {
  events: Event[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private eventService: EventManagementService) {}

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.isLoading = true;
    this.eventService.displayEventHistory().subscribe(
      (response) => {
        this.events = response;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading event history', error);
        this.error = 'Failed to load event history';
        this.isLoading = false;
      }
    );
  }
}