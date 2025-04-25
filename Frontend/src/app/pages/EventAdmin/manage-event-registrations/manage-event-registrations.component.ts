import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Event, Registration } from '../../../services/models';
import { EventManagementService } from '../../../services/services/event-management.service';
import { RegistrationManagementService } from '../../../services/services/registration-management.service';

@Component({
  selector: 'app-manage-event-registrations',
  templateUrl: './manage-event-registrations.component.html',
  styleUrls: ['./manage-event-registrations.component.scss']
})
export class ManageEventRegistrationsComponent implements OnInit {
  registrations: Registration[] = [];
  event: Event | null = null;
  loading = true;
  error: string | null = null;
  successMessage: string | null = null;
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
        console.error('Error loading event:', err);
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
        console.error('Error loading registrations:', err);
        this.error = 'Failed to load registrations';
        this.loading = false;
      }
    });
  }

  updateRegistrationStatus(registrationId: number, status: 'CONFIRMED' | 'CANCELED'): void {
    if (this.isUpdating) return;

    this.isUpdating = true;
    this.error = null;
    this.successMessage = null;

    this.registrationService.updateRegistrationStatus({ idR: registrationId, status }).subscribe({
      next: () => {
        this.isUpdating = false;
        this.successMessage = `Registration ${status.toLowerCase()} successfully`;
        if (this.eventId) {
          this.loadRegistrations(this.eventId);
        }
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (err) => {
        this.isUpdating = false;
        this.error = `Failed to update registration to ${status}: ${err.error?.message || 'Unknown error'}`;
        console.error('Error updating registration:', err);
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
    return Math.max(0, this.event.numberOfPlaces - confirmedAndPending);
  }
}