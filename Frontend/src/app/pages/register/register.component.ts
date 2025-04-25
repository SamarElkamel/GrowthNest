import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrationRequest } from 'src/app/services/models';
import { AuthenticationService } from 'src/app/services/services';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerRequest: RegistrationRequest = {
    email: '',
    firstName: '',
    image: '',
    lastname: '',
    password: '',
    role: '',
    dateOfBirth: '',
  };

  previewUrl: string | ArrayBuffer | null = null;
  errorMsg: Array<string> = [];
  isMarketingAgent = false;

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.registerRequest.role = ''; // No role selected initially
  }

  onRoleChange() {
    this.isMarketingAgent = this.registerRequest.role === 'MarketingAgent';
    this.updateFormFieldsBasedOnRole();
  }

  updateFormFieldsBasedOnRole() {
    if (this.isMarketingAgent) {
      this.registerRequest.firstName = '';
      this.registerRequest.lastname = '';
    } else {
      this.registerRequest.firstName = '';
      this.registerRequest.lastname = '';
    }
  }

  login() {
    this.router.navigate(['login']);
  }

  register() {
    this.errorMsg = [];

    if (!this.registerRequest.role) {
      this.errorMsg.push("Please select a role.");
      return;
    }

    this.authService.register({
      body: this.registerRequest
    }).subscribe({
      next: () => {
        this.router.navigate(['activate-account']);
      },
      error: (err) => {
        this.handleError(err);
      }
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
        const base64String = reader.result?.toString().split(',')[1];
        if (base64String) {
          this.registerRequest.image = base64String;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  private handleError(err: any) {
    if (err.error instanceof Blob) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const errorResponse = JSON.parse(reader.result as string);
          if (errorResponse.errors) {
            this.errorMsg = Object.values(errorResponse.errors);
          } else if (errorResponse.error) {
            this.errorMsg.push(errorResponse.error);
          } else {
            this.errorMsg.push("An unexpected error occurred.");
          }
        } catch (jsonError) {
          this.errorMsg.push("An unexpected error occurred.");
        }
      };
      reader.readAsText(err.error);
    } else {
      if (err.error?.errors) {
        this.errorMsg = Object.values(err.error.errors);
      } else if (err.error?.error) {
        this.errorMsg.push(err.error.error);
      } else {
        this.errorMsg.push("An unexpected error occurred.");
      }
    }
  }
}
