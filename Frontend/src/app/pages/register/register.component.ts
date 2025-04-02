import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrationRequest } from 'src/app/services/models/registration-request';
import { AuthenticationService } from 'src/app/services/services';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerRequest: RegistrationRequest = {email: '', firstName: '',  image: '', lastname: '', password: '' };

  
  errorMsg: Array<string> = [];
  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {}

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
      
    
    
});
}




  }
  


