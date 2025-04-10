// user-reservations.component.ts
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
  showUpdateForm = false;
  selectedReservation: Registration | null = null;

  constructor(private registrationService: RegistrationManagementService) {}

  ngOnInit() {
    console.log('UserReservationsComponent initialized');
    this.loadReservations();
  }

  loadReservations() {
    const userId = 1; // Static user ID for testing
    console.log('Loading reservations for user:', userId);
    this.isLoading = true;
    this.registrationService.getUserReservations({ userId }).subscribe(
      (response) => {
        console.log('Raw response from server:', response);
        this.reservations = response || [];
        console.log('Assigned reservations:', this.reservations);
        console.log('Reservations length:', this.reservations.length);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading reservations:', error);
        this.error = 'Failed to load reservations: ' + (error.statusText || 'Unknown error');
        this.isLoading = false;
      }
    );
  }

  deleteReservation(id: number) {
    this.registrationService.deleteRegistration({ idR: id }).subscribe(
      () => {
        console.log('Reservation deleted:', id);
        this.loadReservations();
      },
      (error) => console.error('Error deleting reservation:', error)
    );
  }

 
  
}