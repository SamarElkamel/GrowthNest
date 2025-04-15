import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/services';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(
    private authService: AuthenticationService,
     private tokenService: TokenService,
    private router: Router
  ) {}

  onMyAccountClick(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/profile']); 
    } else {
      this.router.navigate(['/login']); 
    }
  }

  logout() {
    this.tokenService.clearToken(); 
    this.router.navigate(['/login']);
  }
}
