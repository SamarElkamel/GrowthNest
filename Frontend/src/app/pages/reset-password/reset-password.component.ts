import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  token: string | null = '';
  newPassword: string = '';
  confirmPassword: string = '';
  isSubmitting = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    console.log("TOKEN IN ANGULAR:", this.token);
    if (!this.token) {
      this.errorMessage = 'Invalid or expired token.';
    }
  }

  onSubmit(): void {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

if (!passwordRegex.test(this.newPassword)) {
  this.errorMessage = 'Password must be at least 8 characters long, contain an uppercase letter and a special character.';
  return;
}

    this.isSubmitting = true;
    this.http.post('http://localhost:8080/Growthnest/users/reset-password', {
      token: this.token,
      newPassword: this.newPassword
    }, { responseType: 'text' })  
    .subscribe({
      next: (response: string) => {
        console.log("✅ Backend success response:", response);
        this.errorMessage = ''; 
        this.successMessage = response || 'Your password has been reset successfully!';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        console.error("❌ Backend error:", err);
        this.successMessage = ''; 
        this.errorMessage = err.error || 'Something went wrong, please try again later.';
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });

    console.log("📤 Sending to backend:", { token: this.token, newPassword: this.newPassword });
  }
}
