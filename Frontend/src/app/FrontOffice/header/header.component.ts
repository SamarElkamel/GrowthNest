import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Wishlist } from 'src/app/services/models/products'; // Corrected import path
import { AuthenticationService } from 'src/app/services/services';
import { TokenService } from 'src/app/services/token/token.service';
import { WishlistService } from 'src/app/services/services/WishlistService';
import { PointsService } from 'src/app/services/services/points.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  wishlistItems: Wishlist[] = [];
  private wishlistSubscription!: Subscription;
  isScrolled = false;
  userId: number | null = null;
  points: number = 0;
  role: string | null = '';

  constructor(
    private authService: AuthenticationService,
    private tokenService: TokenService,
    private router: Router,
    private wishlistService: WishlistService,
    private pointsService: PointsService
  ) {}

  ngOnInit(): void {
    // Get userId from TokenService
    this.userId = Number(this.tokenService.getUserId());
    this.role = this.tokenService.getUserRole();

    // Load wishlist
    this.loadWishlist();

    // Subscribe to wishlist updates
    this.wishlistSubscription = this.wishlistService.wishlistItems$.subscribe({
      next: (items) => {
        this.wishlistItems = items;
        console.log('HeaderComponent: Wishlist updated:', this.wishlistItems);
      },
      error: (err) => {
        console.error('HeaderComponent: Error subscribing to wishlist:', err);
        Swal.fire('Error', 'Failed to load wishlist', 'error');
      }
    });

    // Load points if user is authenticated
    if (this.userId && this.authService.isAuthenticated()) {
      this.pointsService.getPoints(this.userId).subscribe({
        next: (data) => {
          this.points = data.availablePoints || 0;
          console.log('HeaderComponent: Points loaded:', this.points);
        },
        error: (err) => {
          console.error('HeaderComponent: Error loading points:', err);
          this.points = 0;
          Swal.fire('Error', 'Failed to load points', 'error');
        }
      });
    } else {
      console.warn('HeaderComponent: User not authenticated, skipping points load');
      this.points = 0;
    }
  }

  ngOnDestroy(): void {
    if (this.wishlistSubscription) {
      this.wishlistSubscription.unsubscribe();
    }
  }

  loadWishlist(): void {
    if (this.userId && this.authService.isAuthenticated()) {
      this.wishlistService.loadWishlist();
    } else {
      console.warn('HeaderComponent: User not authenticated, clearing wishlist');
      this.wishlistItems = [];
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
    this.wishlistItems = [];
 // Use public method
    this.points = 0;
    this.userId = null;
    this.role = null;
    this.router.navigate(['/login']);
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.isScrolled = window.scrollY > 30;
  }
}