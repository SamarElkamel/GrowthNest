// add-reservation.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Event, Registration } from '../../../services/models';
import { RegistrationManagementService } from '../../../services/services/registration-management.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-reservation',
  templateUrl: './add-reservation.component.html'
})
export class AddReservationComponent {
  @Input() event!: Event;
  @Output() reservationAdded = new EventEmitter<void>();
  
  reservation: Registration = {
    status: 'PENDING',
    reservationDate: new Date().toISOString()
  };

  constructor(
    private registrationService: RegistrationManagementService,
    private router: Router
  ) {}

  addReservation() {
    this.reservation.event = this.event;
    this.reservation.user = { id: 1 }; // Static user ID for testing

    console.log('Adding reservation for user 1:', this.reservation); // Debug log
    this.registrationService.addRegistration({ body: this.reservation }).subscribe(
      () => {
        console.log('Reservation added successfully');
        this.reservationAdded.emit();
        this.router.navigate(['/events/user/reservations']);
      },
      (error) => {
        console.error('Error adding reservation:', error);
      }
    );
  }

  cancel() {
    this.reservationAdded.emit();
  }
}