import { Component, OnInit } from '@angular/core';
import { Registration } from '../../../services/models';
import { RegistrationManagementService } from '../../../services/services/registration-management.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-registration-detail',
  templateUrl: './display-reservation-by-id.component.html',
  styleUrls: ['./display-reservation-by-id.component.scss']
})
export class RegistrationDetailComponent implements OnInit {
  registration: Registration | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private registrationService: RegistrationManagementService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const registrationId = this.route.snapshot.params['id'];
    if (registrationId) {
      this.loadRegistration(+registrationId);
    } else {
      this.error = 'No registration ID provided';
      this.isLoading = false;
    }
  }

  loadRegistration(registrationId: number) {
    this.isLoading = true;
    this.registrationService.displayRegistration({ idR: registrationId }).subscribe(
      (response) => {
        this.registration = response;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading registration', error);
        this.error = 'Failed to load registration';
        this.isLoading = false;
      }
    );
  }
}