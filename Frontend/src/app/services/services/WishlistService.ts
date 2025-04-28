import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GestionDesProduitsService } from 'src/app/services/services/gestion-des-produits.service';
import { Products } from 'src/app/services/models';
import { Wishlist } from '../models/products';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItemsSubject = new BehaviorSubject<Products[]>([]);
  wishlistItems$: Observable<Products[]> = this.wishlistItemsSubject.asObservable();

  constructor(
    private produitsService: GestionDesProduitsService,
    private tokenService: TokenService
  ) {
    // Removed loadWishlist() from constructor; will be called from component
  }

  

  loadWishlist(): void {
    const userId =  Number(this.tokenService.getUserId());
    if (!userId) {
      console.error('User not logged in');
      this.wishlistItemsSubject.next([]);
      return;
    }
    this.produitsService.getWishlist(userId).subscribe({
      next: (wishlist: Wishlist[]) => {
        const items = wishlist.map(item => item.product);
        this.wishlistItemsSubject.next(items);
      },
      error: (err) => {
        console.error('WishlistService: Error loading wishlist:', err);
        this.wishlistItemsSubject.next([]);
      }
    });
  }

  addToWishlist(productId: number): void {
    const userId = Number(this.tokenService.getUserId());
    if (!userId) {
      console.error('User not logged in');
      return;
    }
    this.produitsService.addToWishlist(userId, productId).subscribe({
      next: () => {
        this.loadWishlist(); // Reload wishlist to refresh the state
      },
      error: (err) => {
        console.error('WishlistService: Error adding to wishlist:', err);
      }
    });
  }

  removeFromWishlist(productId: number): void {
    const userId = Number(this.tokenService.getUserId());
    if (!userId) {
      console.error('User not logged in');
      return;
    }
    this.produitsService.removeFromWishlist(userId, productId).subscribe({
      next: () => {
        this.loadWishlist(); // Reload wishlist to refresh the state
      },
      error: (err) => {
        console.error('WishlistService: Error removing from wishlist:', err);
      }
    });
  }
}