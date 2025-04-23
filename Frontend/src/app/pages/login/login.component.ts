import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationRequest } from 'src/app/services/models/authentication-request';
import { AuthenticationService } from 'src/app/services/services';
import { TokenService } from 'src/app/services/token/token.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';  

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  authRequest: AuthenticationRequest = { email: '', password: '' };
  errorMsg: Array<string> = [];

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private tokenService: TokenService,
    private recaptchaV3Service: ReCaptchaV3Service  
  ) {}

  login() {
    this.errorMsg = [];
   
    this.recaptchaV3Service.execute('login')  
      .subscribe({
        next: (captchaToken) => {
          console.log('Captcha Token:', captchaToken);
          const authRequestWithCaptcha = {
            ...this.authRequest,
            captcha: captchaToken
          };

       
          this.authService.authenticate({
            body: authRequestWithCaptcha
          }).subscribe({
            next: (res) => {
              console.log('Response from backend:', res);

              if (res instanceof Blob) {
                res.text().then((text) => {
                  try {
                    const responseJson = JSON.parse(text);
                    console.log('Parsed response:', responseJson);

                    if (responseJson.token) {
                      this.tokenService.token = responseJson.token;
                    } else {
                      this.errorMsg.push("Token not received from server.");
                    }

                    if (this.authRequest.email.toLowerCase() === 'admin@gmail.com') {
                      this.router.navigate(['dashboard']);
                    } else {
                      this.router.navigate(['/']);
                    }
                  } catch (error) {
                    console.error('Failed to parse response:', error);
                    this.errorMsg.push("Failed to parse response.");
                  }
                }).catch((error) => {
                  console.error('Error reading Blob:', error);
                  this.errorMsg.push("Error reading server response.");
                });
              } else {
                if (res.token) {
                  this.tokenService.token = res.token;
                } else {
                  this.errorMsg.push("Token not received from server.");
                }
              }
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
        },
        error: (captchaError) => {
          console.error('reCAPTCHA Error:', captchaError);
          this.errorMsg.push('Error with reCAPTCHA. Please try again.');
        }
      });
  }

  register() {
    this.router.navigate(['register']);
  }
}
