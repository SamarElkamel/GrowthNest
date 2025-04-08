import { Component, OnInit } from '@angular/core';
import { Event } from '../../../services/models';
import { EventManagementService } from '../../../services/services/event-management.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event-detail',
  templateUrl: './display-event-by-id.component.html',
  styleUrls: ['./display-event-by-id.component.scss']
})
export class EventDetailComponent implements OnInit {
  event: Event | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private eventService: EventManagementService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const eventId = this.route.snapshot.params['id'];
    if (eventId) {
      this.loadEvent(+eventId);
    } else {
      this.error = 'No event ID provided';
      this.isLoading = false;
    }
  }

  loadEvent(eventId: number) {
    this.isLoading = true;
    this.eventService.displayEvent({ idE: eventId }).subscribe(
      (response) => {
        this.event = response;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading event', error);
        this.error = 'Failed to load event';
        this.isLoading = false;
      }
    );
  }
}