import { Component, OnInit } from '@angular/core';
import { Registration } from '../../../services/models';
import { RegistrationManagementService } from '../../../services/services/registration-management.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-registration',
  templateUrl: './update-reservation.component.html',
  styleUrls: ['./update-reservation.component.scss']
})
export class UpdateRegistrationComponent implements OnInit {
  registration: Registration = {
    status: 'PENDING'
  };

  constructor(
    private registrationService: RegistrationManagementService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const registrationId = this.route.snapshot.params['id'];
    if (registrationId) {
      this.registrationService.displayRegistration({ idR: +registrationId }).subscribe(
        (response) => {
          this.registration = response;
        },
        (error) => {
          console.error('Error fetching registration', error);
        }
      );
    }
  }

  onSubmit() {
    this.registrationService.updateRegistration({ body: this.registration }).subscribe(
      (response) => {
        console.log('Registration updated successfully', response);
      },
      (error) => {
        console.error('Error updating registration', error);
      }
    );
  }
}