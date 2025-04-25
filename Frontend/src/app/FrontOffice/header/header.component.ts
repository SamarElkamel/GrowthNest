
import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Products } from 'src/app/services/models';
import { AuthenticationService } from 'src/app/services/services';
import { TokenService } from 'src/app/services/token/token.service';
import { WishlistService } from 'src/app/services/services/WishlistService';
import { PointsService } from 'src/app/services/services/points.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {
  wishlistItems: Products[] = [];
  private wishlistSubscription!: Subscription;
  isScrolled = false;
  userId = 1; 
  points: number = 0;
  constructor(
    private authService: AuthenticationService,
    private tokenService: TokenService,
    private router: Router,
    private wishlistService: WishlistService,
    private pointsService: PointsService
  ) {
  }

  ngOnInit(): void {
    this.wishlistSubscription = this.wishlistService.wishlistItems$.subscribe({
      next: (items) => {
        this.wishlistItems = items;
        console.log('HeaderComponent: Wishlist updated:', this.wishlistItems);
      },
      error: (err) => {
        console.error('HeaderComponent: Error subscribing to wishlist:', err);
      }
    });
    this.pointsService.getPoints(this.userId).subscribe({
      next: (data) => this.points = data.availablePoints,
      error: () => this.points = 0
    });
  }
  ngOnDestroy(): void {
    if (this.wishlistSubscription) {
      this.wishlistSubscription.unsubscribe();
    }
  }


  onMyAccountClick(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    this.tokenService.clearToken();
    this.router.navigate(['/login']);
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.isScrolled = window.scrollY > 30;
  }

}
