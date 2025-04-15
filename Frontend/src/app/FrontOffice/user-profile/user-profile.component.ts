import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserManagementService } from 'src/app/services/services';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {

  profile: any = {}; 
  errorMsg: string = '';

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
}
