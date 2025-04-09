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

  registerRequest: RegistrationRequest = { email: '', firstName: '', image: '', lastname: '', password: '', role: '' };
  previewUrl: string | ArrayBuffer | null = null;

  errorMsg: Array<string> = [];
  isMarketingAgent = false;

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    const storedRole = localStorage.getItem('selectedRole');
    if (storedRole) {
      this.registerRequest.role = storedRole;
      this.isMarketingAgent = storedRole === 'MarketingAgent'; // Uppercase match with backend enum
      this.updateFormFieldsBasedOnRole();
    } else {
      this.router.navigate(['/select-role']); // Redirect if role was not selected
    }
  }

  updateFormFieldsBasedOnRole() {
    if (this.isMarketingAgent) {
      // Change form labels for marketing agent
      this.registerRequest.firstName = '';  // Clear firstName as it's not used
      this.registerRequest.lastname = '';   // Clear lastName as it's not used
    } else {
      // Reset for regular user/other roles
      this.registerRequest.firstName = '';  // Make sure this is set if it's empty
      this.registerRequest.lastname = '';   // Same for lastname
    }
  }

  login() {
    this.router.navigate(['login']);
  }

  register() {
    this.errorMsg = [];

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
