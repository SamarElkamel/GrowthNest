import { Component, OnInit } from '@angular/core';
import { Event, Registration } from '../../../services/models';
import { EventManagementService } from '../../../services/services/event-management.service';
import { RegistrationManagementService } from '../../../services/services/registration-management.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  event: Event | null = null;
  registrations: Registration[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private eventService: EventManagementService,
    private registrationService: RegistrationManagementService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const eventId = this.route.snapshot.params['id'];
    if (eventId) {
      this.loadEvent(+eventId);
      this.loadRegistrations(+eventId);
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

  loadRegistrations(eventId: number) {
    this.registrationService.displayByEvent({ eventId }).subscribe(
      (response) => {
        this.registrations = response;
      },
      (error) => {
        console.error('Error loading registrations', error);
        this.error = 'Failed to load registrations';
      }
    );
  }
}