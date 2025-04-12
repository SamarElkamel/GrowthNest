import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationRequest } from 'src/app/services/models/authentication-request';
import { AuthenticationService } from 'src/app/services/services';
import { TokenService } from 'src/app/services/token/token.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  authRequest: AuthenticationRequest = {email: '', password: ''};
  errorMsg: Array<string> = [];

  constructor(
              private router: Router,
              private authService:AuthenticationService,
              private tokenService:TokenService) 
              
              {}
            

                login() {
                  this.errorMsg = [];
                  this.authService.authenticate({
                    body: this.authRequest
                  }).subscribe({
                    next: (res) => {
                      this.tokenService.token = res.token as string;
                      this.router.navigate(['dashboard']);
                    },

                    
                        error: (err) => {
                          
                        
                          if (err.error instanceof Blob) {
                           
                            const reader = new FileReader();
                            reader.onload = () => {
                              try {
                                const errorResponse = JSON.parse(reader.result as string);
                            
                        
                                if (errorResponse.errors) {
                                  this.errorMsg = Object.values(errorResponse.errors);
                                } else if (errorResponse.error) {  // 🔥 Handle bad credentials error
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

   register ()
   {
       this.router.navigate(['register']);
      // this.router.navigate(['select-role']);
       
   }
}
