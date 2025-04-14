import { Component, OnInit } from '@angular/core';
import { Registration } from '../../../services/models';
import { RegistrationManagementService } from '../../../services/services/registration-management.service';

@Component({
  selector: 'app-user-reservations',
  templateUrl: './user-reservations.component.html'
})
export class UserReservationsComponent implements OnInit {
  reservations: Registration[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private registrationService: RegistrationManagementService) {}

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    const userId = 1; // Static user ID for testing; replace with auth later
    this.isLoading = true;
    this.registrationService.getUserReservations({ userId }).subscribe(
      (response) => {
        this.reservations = response || [];
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading reservations:', error);
        this.error = 'Failed to load reservations';
        this.isLoading = false;
      }
    );
  }

  deleteReservation(id: number) {
    this.registrationService.deleteRegistration({ idR: id }).subscribe(
      () => {
        this.loadReservations();
      },
      (error) => {
        console.error('Error deleting reservation:', error);
        this.error = 'Failed to delete reservation';
      }
    );
  }
}