// update-reservation.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Registration } from '../../../services/models';
import { RegistrationManagementService } from '../../../services/services/registration-management.service';

@Component({
  selector: 'app-update-reservation',
  templateUrl: './update-reservation.component.html'
})
export class UpdateReservationComponent {
  @Input() reservation: Registration | null = null; // Changed to allow null
  @Output() reservationUpdated = new EventEmitter<void>();

  constructor(private registrationService: RegistrationManagementService) {}

  updateReservation() {
    if (this.reservation) { // Add null check
      this.registrationService.updateRegistration({ body: this.reservation }).subscribe(
        () => {
          this.reservationUpdated.emit();
        },
        (error) => {
          console.error('Error updating reservation', error);
        }
      );
    }
  }

  cancel() {
    this.reservationUpdated.emit();
  }
}