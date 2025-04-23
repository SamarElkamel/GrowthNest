import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/services/models';
import { UserManagementService } from 'src/app/services/services';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent {
  editProfileForm!: FormGroup;
  userId!: number;
  userProfile!: User;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserManagementService,
    private tokenService: TokenService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.tokenService.getUserId());

    // Create the form with optional fields (no Validators.required)
    this.editProfileForm = this.fb.group({
      firstname: [''],
      lastname: [''],
      dateOfBirth: ['']
    });

    // Fetch the user profile to prefill existing data
    this.userService.getProfile(this.userId).subscribe({
      next: (data: User) => {
        this.userProfile = data;
        this.editProfileForm.patchValue({
          firstname: data.firstname,
          lastname: data.lastname,
          dateOfBirth: data.dateOfBirth
        });
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.errorMessage = 'Failed to load user profile.';
      }
    });
  }

  onSubmit(): void {
    if (this.editProfileForm.invalid) return;

    const formData = this.editProfileForm.value;
    const userId = this.tokenService.getUserId();

    // Only include changed values or fall back to current values
    const updatedData: any = {
      id: userId,
      firstname: formData.firstname || this.userProfile.firstname,
      lastname: formData.lastname || this.userProfile.lastname,
      dateOfBirth: formData.dateOfBirth || this.userProfile.dateOfBirth
    };

    this.userService.updateProfile(updatedData).subscribe({
      next: () => {
        this.successMessage = 'Profile updated successfully';
        setTimeout(() => {
          this.router.navigate(['/profile']);
        }, 1500);
      },
      error: (err) => {
        console.error('Update failed:', err);
        this.errorMessage = 'Failed to update profile.';
      }
    });
  }
}
