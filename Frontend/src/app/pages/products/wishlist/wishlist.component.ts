import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Products } from 'src/app/services/models';
import { WishlistService } from 'src/app/services/services/WishlistService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit, OnDestroy {
  wishlistItems: Products[] = [];
  isLoading: boolean = true;
  errorMessage?: string;
  baseUrl: string = 'http://localhost:8080/Growthnest';
  private wishlistSubscription!: Subscription;

  constructor(private wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.loadWishlist(); // Load wishlist explicitly on component init
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

  removeFromWishlist(product: Products): void {
    if (!product.idProduct) {
      Swal.fire('Error', 'Invalid product ID', 'error');
      return;
    }

    this.wishlistService.removeFromWishlist(product.idProduct);
    Swal.fire(product.name, 'Removed from wishlist!', 'info');
  }

  getLogoUrl(image: string | null | undefined): string {
    return image ? `${this.baseUrl}/uploads/products/${image.split('/').pop()}` : 'assets/images/placeholder.jpg';
  }

  onImageError(event: Event, product: Products): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/placeholder.jpg';
    product.image = '';
  }
}