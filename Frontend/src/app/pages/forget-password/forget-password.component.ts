import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent {
  email: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.email) {
      this.errorMessage = 'Please enter your email.';
      return;
    }

    this.http.post('http://localhost:8080/Growthnest/users/forgot-password', { email: this.email }).subscribe({
      next: () => {
        this.successMessage = 'Reset link sent! Please check your inbox.';
        this.email = '';
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'This user dosent exist.';
      }
    });
  }
}
