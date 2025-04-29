import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Wishlist } from 'src/app/services/models/products';
import { WishlistService } from 'src/app/services/services/WishlistService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit, OnDestroy {
  wishlistItems: Wishlist[] = [];
  isLoading: boolean = true;
  errorMessage?: string;
  baseUrl: string = 'http://localhost:8080/Growthnest';
  private wishlistSubscription!: Subscription;

  constructor(private wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.loadWishlist();
    this.wishlistSubscription = this.wishlistService.wishlistItems$.subscribe({
      next: (items) => {
        this.wishlistItems = items;
        this.isLoading = false;
        console.log('WishlistComponent: Wishlist updated:', this.wishlistItems);
      },
      error: (err) => {
        this.errorMessage = 'Failed to load wishlist';
        this.isLoading = false;
        console.error('WishlistComponent: Error loading wishlist:', err);
        Swal.fire('Error', 'Unable to load wishlist', 'error');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.wishlistSubscription) {
      this.wishlistSubscription.unsubscribe();
    }
  }

  loadWishlist(): void {
    this.isLoading = true;
    this.errorMessage = undefined;
    this.wishlistService.loadWishlist();
  }

  removeFromWishlist(wishlistItem: Wishlist): void {
    if (!wishlistItem.productId) {
      Swal.fire('Error', 'Invalid product ID', 'error');
      return;
    }

    this.wishlistService.removeFromWishlist(wishlistItem.productId);
  }

  getLogoUrl(image: string | null | undefined): string {
    return image ? `${this.baseUrl}/uploads/products/${image.split('/').pop()}` : 'assets/images/placeholder.jpg';
  }

  onImageError(event: Event, item: Wishlist): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/placeholder.jpg';
    item.productImage = '';
  }
}