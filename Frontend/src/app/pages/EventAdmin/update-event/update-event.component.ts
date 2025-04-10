import { Component, OnInit } from '@angular/core';
import { Event } from '../../../services/models';
import { EventManagementService } from '../../../services/services/event-management.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-event-update',
  templateUrl: './update-event.component.html',
  styleUrls: ['./update-event.component.scss']
})
export class EventUpdateComponent implements OnInit {
  event: Event = {};
  isLoading = true;
  error: string | null = null;

  constructor(
    private eventService: EventManagementService,
    private route: ActivatedRoute,
    private router: Router
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

  updateEvent() {
    this.isLoading = true;
    this.eventService.updateEvent({ body: this.event }).subscribe(
      () => {
        this.isLoading = false;
        this.router.navigate(['/admin/events']);
      },
      (error) => {
        console.error('Error updating event', error);
        this.error = 'Failed to update event';
        this.isLoading = false;
      }
    );
  }
}