import { Component, OnInit } from '@angular/core';
import { Event, Registration } from '../../../services/models';
import { EventManagementService } from '../../../services/services/event-management.service';
import { RegistrationManagementService } from '../../../services/services/registration-management.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-event-user-details',
  templateUrl: './event-user-details.component.html'
})
export class EventUserDetailsComponent implements OnInit {
  event: Event | null = null;
  userReservations: Registration[] = [];
  confirmedAndPendingReservations: number = 0;
  isLoading = true;
  error: string | null = null;
  showAddForm = false;
  hasReservation = false;
  notification: string | null = null;

  constructor(
    private eventService: EventManagementService,
    private registrationService: RegistrationManagementService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const eventId = this.route.snapshot.params['id'];
    if (eventId) {
      this.loadEventDetails(+eventId);
      this.checkUserReservation(+eventId);
      this.loadConfirmedAndPendingReservations(+eventId);
    } else {
      this.error = 'No event ID provided';
      this.isLoading = false;
    }
  }

  loadEventDetails(id: number) {
    this.isLoading = true;
    this.eventService.displayEvent({ idE: id }).subscribe(
      (response) => {
        this.event = response;
        this.isLoading = false;
        console.log('Loaded event:', this.event);
      },
      (error) => {
        this.error = 'Failed to load event details';
        this.isLoading = false;
        console.error('Error loading event details:', error);
      }
    );
  }

  loadConfirmedAndPendingReservations(eventId: number) {
    this.registrationService.displayByEvent({ eventId }).subscribe(
      (reservations) => {
        this.confirmedAndPendingReservations = reservations.filter(
          r => r.status === 'CONFIRMED' || r.status === 'PENDING'
        ).length;
        console.log(`Confirmed and pending reservations for event ${eventId}:`, this.confirmedAndPendingReservations);
      },
      (error) => {
        console.error('Error loading reservations:', error);
        this.error = 'Failed to load reservation count';
      }
    );
  }

  checkUserReservation(eventId: number) {
    const userId = 1; // Static user ID for testing; replace with auth later
    this.registrationService.getUserReservations({ userId }).subscribe(
      (reservations) => {
        this.userReservations = reservations || [];
        // Consider any registration (PENDING, CONFIRMED, CANCELED) for hasReservation
        this.hasReservation = reservations.some(r => r.event?.idEvent === eventId);
        console.log('User reservations:', this.userReservations);
      },
      (error) => {
        console.error('Error checking reservations:', error);
      }
    );
  }

  showAddReservationForm() {
    if (this.hasReservation) {
      // Check if the reservation is CANCELED
      const currentReservation = this.userReservations.find(r => r.event?.idEvent === this.event?.idEvent);
      if (currentReservation?.status === 'CANCELED') {
        this.notification = 'Your reservation was canceled by the admin. You cannot re-register for this event.';
      } else {
        this.notification = 'You have already made a reservation for this event';
      }
      setTimeout(() => this.notification = null, 3000);
    } else if (this.remainingPlaces <= 0) {
      this.notification = 'No places remaining for this event';
      setTimeout(() => this.notification = null, 3000);
    } else {
      this.showAddForm = true;
    }
  }

  onReservationAdded() {
    this.showAddForm = false;
    this.hasReservation = true;
    if (this.event?.idEvent) {
      this.checkUserReservation(this.event.idEvent);
      this.loadConfirmedAndPendingReservations(this.event.idEvent);
    }
  }

  goToReservations() {
    this.router.navigate(['/events/user/reservations']);
  }

  get remainingPlaces(): number {
    if (!this.event || this.event.numberOfPlaces === undefined) {
      return Infinity;
    }
    const remaining = this.event.numberOfPlaces - this.confirmedAndPendingReservations;
    console.log(`Remaining places: ${this.event.numberOfPlaces} - ${this.confirmedAndPendingReservations} = ${remaining}`);
    return Math.max(0, remaining);
  }
}