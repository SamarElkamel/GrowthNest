import { Component, OnInit } from '@angular/core';
import { Registration } from '../../../services/models';
import { RegistrationManagementService } from '../../../services/services/registration-management.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-user-reservations',
  templateUrl: './user-reservations.component.html'
})
export class UserReservationsComponent implements OnInit {
  reservations: Registration[] = [];
  isLoading = true;
  error: string | null = null;
  pdfLoading: { [key: number]: boolean } = {};

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
    if (confirm('Are you sure you want to delete this reservation?')) {
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

  downloadInvitation(reservation: Registration) {
    const reservationId = reservation.idRegist;
    if (!reservationId) return;
    
    this.pdfLoading[reservationId] = true;
    
    this.registrationService.downloadInvitation({ idR: reservationId }).subscribe(
      (response: any) => {
        // Convert the response to a Blob
        const pdfBlob = new Blob([response], { type: 'application/pdf' });
        const eventTitle = reservation.event?.title 
          ? reservation.event.title.replace(/[^a-zA-Z0-9]/g, '_') 
          : 'event';
        const filename = `Invitation_${eventTitle}.pdf`;
        saveAs(pdfBlob, filename);
        this.pdfLoading[reservationId] = false;
      },
      (error: any) => {
        console.error('Error downloading invitation:', error);
        this.error = 'Failed to download invitation';
        this.pdfLoading[reservationId] = false;
      }
    );
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'bg-warning';
      case 'CONFIRMED':
        return 'bg-success';
      case 'CANCELED':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }
}