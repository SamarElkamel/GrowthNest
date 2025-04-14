import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Event, Registration } from '../../../services/models';
import { RegistrationManagementService } from '../../../services/services/registration-management.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-reservation',
  templateUrl: './add-reservation.component.html'
})
export class AddReservationComponent implements OnInit {
  @Input() event!: Event;
  @Output() reservationAdded = new EventEmitter<void>();
  
  reservation: Registration = {
    status: 'PENDING',
    reservationDate: new Date().toISOString()
  };
  confirmedAndPendingReservations: number = 0; // Renamed for clarity
  isLoading: boolean = false;
  error: string | null = null;

  constructor(
    private registrationService: RegistrationManagementService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.event?.idEvent) {
      this.loadConfirmedAndPendingReservations(this.event.idEvent);
    }
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

  addReservation() {
    if (this.remainingPlaces <= 0) {
      this.error = 'No places remaining for this event';
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.reservation.event = this.event;
    this.reservation.user = { id: 1 }; // Static user ID for testing; replace with auth

    this.registrationService.addRegistration({ body: this.reservation }).subscribe(
      () => {
        this.isLoading = false;
        this.reservationAdded.emit();
        this.router.navigate(['/events/user/reservations']);
      },
      (error) => {
        console.error('Error adding reservation:', error);
        this.error = error.error?.message || 'Failed to add reservation';
        this.isLoading = false;
      }
    );
  }

  cancel() {
    this.reservationAdded.emit();
  }

  get remainingPlaces(): number {
    if (!this.event.numberOfPlaces) {
      return Infinity; // Unlimited
    }
    const remaining = this.event.numberOfPlaces - this.confirmedAndPendingReservations;
    return Math.max(0, remaining); // Prevent negative display
  }
}