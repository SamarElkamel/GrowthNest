import { Component, OnInit } from '@angular/core';
import { Registration } from '../../../services/models';
import { RegistrationManagementService } from '../../../services/services/registration-management.service';

@Component({
  selector: 'app-registration-list',
  templateUrl: './display-all-reservation.component.html',
  styleUrls: ['./display-all-reservation.component.css']
})
export class RegistrationListComponent implements OnInit {
  registrations: Registration[] = [];
  isLoading = true;

  constructor(private registrationService: RegistrationManagementService) {}

  ngOnInit() {
    this.loadRegistrations();
  }

  loadRegistrations() {
    this.isLoading = true;
    this.registrationService.display().subscribe(
      (response) => {
        this.registrations = response;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading registrations', error);
        this.isLoading = false;
      }
    );
  }

  deleteRegistration(registrationId: number) {
    if (confirm('Are you sure you want to delete this registration?')) {
      this.registrationService.deleteRegistration({ idR: registrationId }).subscribe(
        () => {
          this.registrations = this.registrations.filter(r => r.idRegist !== registrationId);
        },
        (error) => {
          console.error('Error deleting registration', error);
        }
      );
    }
  }
}