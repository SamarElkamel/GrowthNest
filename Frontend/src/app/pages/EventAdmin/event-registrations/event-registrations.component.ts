import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Event, Registration } from '../../../services/models';
import { EventManagementService } from '../../../services/services/event-management.service';
import { RegistrationManagementService } from '../../../services/services/registration-management.service';

@Component({
  selector: 'app-event-registrations',
  templateUrl: './event-registrations.component.html',
  styleUrls: ['./event-registrations.component.scss']
})
export class EventRegistrationsComponent implements OnInit {
  registrations: Registration[] = [];
  event: Event | null = null;
  loading = true;
  error: string | null = null;
  isUpdating = false;
  eventId?: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventManagementService,
    private registrationService: RegistrationManagementService
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.eventId) {
      this.loadEvent(this.eventId);
      this.loadRegistrations(this.eventId);
    } else {
      this.error = 'No event ID provided';
      this.loading = false;
    }
  }

  loadEvent(eventId: number): void {
    this.eventService.displayEvent({ idE: eventId }).subscribe({
      next: (response) => {
        this.event = response;
      },
      error: (err) => {
        console.error('Error loading event', err);
        this.error = 'Failed to load event details';
      }
    });
  }

  loadRegistrations(eventId: number): void {
    this.loading = true;
    this.registrationService.displayByEvent({ eventId }).subscribe({
      next: (registrations) => {
        this.registrations = registrations || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load registrations';
        this.loading = false;
        console.error(err);
      }
    });
  }

  updateRegistrationStatus(registrationId: number, status: 'CONFIRMED' | 'CANCELED'): void {
    this.isUpdating = true;
    this.error = null;

    this.registrationService.updateRegistrationStatus({ idR: registrationId, status }).subscribe({
      next: () => {
        this.isUpdating = false;
        if (this.eventId) {
          this.loadRegistrations(this.eventId); // Refresh registrations
        }
      },
      error: (err) => {
        this.error = `Failed to update registration status to ${status}`;
        this.isUpdating = false;
        console.error(err);
      }
    });
  }

  backToEvent(): void {
    this.router.navigate([`/admin/events/${this.eventId}`]);
  }

  get remainingPlaces(): number {
    if (!this.event || this.event.numberOfPlaces === undefined) {
      return Infinity;
    }
    const confirmedAndPending = this.registrations.filter(
      reg => reg.status === 'CONFIRMED' || reg.status === 'PENDING'
    ).length;
    return this.event.numberOfPlaces - confirmedAndPending;
  }
}