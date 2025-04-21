import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Products } from 'src/app/services/models';
import { WishlistService } from 'src/app/services/services/WishlistService';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  wishlistItems: Products[] = [];
  private wishlistSubscription!: Subscription;

  constructor(private wishlistService: WishlistService) {}

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
  }

  ngOnDestroy(): void {
    if (this.wishlistSubscription) {
      this.wishlistSubscription.unsubscribe();
    }
  }

  isScrolled = false;

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.isScrolled = window.scrollY > 30;
  }
}