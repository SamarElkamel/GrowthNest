import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserManagementService } from 'src/app/services/services';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  profile: any = {}; 
  errorMsg: string = '';
  imageChangeModalVisible: boolean = false; // To control modal visibility
  selectedImage: File | null = null; // To hold the selected image file for upload
  imagePreview: string | ArrayBuffer | null = null; // To hold the image preview (base64 or URL)

  constructor(
    private userService: UserManagementService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit() {
    const userId = this.tokenService.getUserId();  

    if (!userId) {
      this.router.navigate(['/login']); 
      return;
    }

    const userIdAsNumber = Number(userId);  

    this.userService.getProfile(userIdAsNumber).subscribe({
      next: (data) => {
        this.profile = data;
      },
      error: (err) => {
        this.errorMsg = 'Failed to load profile';
        console.error(err);
      }
    });
  }

  logout() {
    this.tokenService.clearToken(); 
    this.router.navigate(['/login']);
  }

  goToEditProfile(): void {
    this.router.navigate(['/updateprofile']); 
  }

  goTochangepassword(): void {
    this.router.navigate(['/EditPassword']); 
  }

  // Open the modal to change the profile picture
  openImageChangeDialog(): void {
    this.imageChangeModalVisible = true;
  }

  // Close the modal
  closeImageChangeDialog(): void {
    this.imageChangeModalVisible = false;
    this.selectedImage = null; // Reset the selected image for upload
    this.imagePreview = null; // Reset the image preview
  }

  // Handle image selection
  onImageSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file; // Store the File object for upload
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result; // Set the base64 string for preview
      };
      reader.readAsDataURL(file);
    }
  }

  // Upload the selected image to the backend
  uploadImage(): void {
    if (!this.selectedImage) return;

    const userId = Number(this.tokenService.getUserId());
    const formData = new FormData();
    formData.append('image', this.selectedImage, this.selectedImage.name); // Pass the File object directly
    
    this.userService.updateProfileImage(userId, formData).subscribe({
      next: (response) => {
        // After uploading, update the profile with the new image URL or base64 string
        this.profile.image = response.image;  // Assuming the backend sends the image URL or base64 string
        this.selectedImage = null; // Clear the selected image for upload
        this.imagePreview = null; // Clear the preview after successful upload
        this.closeImageChangeDialog();
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Failed to upload image';
      }
    });
  }
}
