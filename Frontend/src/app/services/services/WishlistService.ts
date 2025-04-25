import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GestionDesProduitsService } from 'src/app/services/services/gestion-des-produits.service';
import { Products} from 'src/app/services/models';
import { Wishlist } from '../models/products';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItemsSubject = new BehaviorSubject<Products[]>([]);
  wishlistItems$: Observable<Products[]> = this.wishlistItemsSubject.asObservable();
  private currentUserId: number = 1; // Static user ID for now

  constructor(private produitsService: GestionDesProduitsService) {
    this.loadWishlist(); // Load wishlist on service initialization
  }

  loadWishlist(): void {
    this.produitsService.getWishlist(this.currentUserId).subscribe({
      next: (wishlist: Wishlist[]) => {
        const items = wishlist.map(item => item.product);
        this.wishlistItemsSubject.next(items);
      },
      error: (err) => {
        console.error('WishlistService: Error loading wishlist:', err);
      }
    });
  }

  addToWishlist(productId: number): void {
    this.produitsService.addToWishlist(this.currentUserId, productId).subscribe({
      next: () => {
        this.loadWishlist(); // Reload wishlist to refresh the state
      },
      error: (err) => {
        console.error('WishlistService: Error adding to wishlist:', err);
      }
    });
  }

  removeFromWishlist(productId: number): void {
    this.produitsService.removeFromWishlist(this.currentUserId, productId).subscribe({
      next: () => {
        this.loadWishlist(); // Reload wishlist to refresh the state
      },
      error: (err) => {
        console.error('WishlistService: Error removing from wishlist:', err);
      }
    });
  }
}