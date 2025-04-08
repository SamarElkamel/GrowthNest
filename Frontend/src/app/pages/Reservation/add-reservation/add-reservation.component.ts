import { Component } from '@angular/core';
import { Registration } from '../../../services/models';
import { RegistrationManagementService } from '../../../services/services/registration-management.service';

@Component({
  selector: 'app-add-registration',
  templateUrl: './add-reservation.component.html',
  styleUrls: ['./add-reservation.component.scss']
})
export class AddRegistrationComponent {
  newRegistration: Registration = {
    status: 'PENDING'
  };

  constructor(private registrationService: RegistrationManagementService) {}

  onSubmit() {
    this.registrationService.addRegistration({ body: this.newRegistration }).subscribe(
      (response) => {
        console.log('Registration added successfully', response);
        this.newRegistration = { status: 'PENDING' };
      },
      (error) => {
        console.error('Error adding registration', error);
      }
    );
  }
}