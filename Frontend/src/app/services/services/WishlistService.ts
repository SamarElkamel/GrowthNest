import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { GestionDesProduitsService } from 'src/app/services/services/gestion-des-produits.service';
import { TokenService } from '../token/token.service';
import Swal from 'sweetalert2';
import { Wishlist } from '../models/products';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItemsSubject = new BehaviorSubject<Wishlist[]>([]);
  wishlistItems$: Observable<Wishlist[]> = this.wishlistItemsSubject.asObservable();

  constructor(
    private produitsService: GestionDesProduitsService,
    private tokenService: TokenService
  ) {}

  loadWishlist(): void {
    const userId = Number(this.tokenService.getUserId());
    if (!userId) {
      console.error('User not logged in');
      this.wishlistItemsSubject.next([]);
      Swal.fire('Error', 'Please log in to view your wishlist', 'error');
      return;
    }
    this.produitsService.getWishlist(userId).pipe(
      catchError(err => {
        console.error('WishlistService: Error loading wishlist:', err);
        Swal.fire('Error', err.error?.message || 'Failed to load wishlist', 'error');
        return of([]);
      })
    ).subscribe((wishlist: Wishlist[]) => {
      this.wishlistItemsSubject.next(wishlist);
      console.log('WishlistService: Wishlist loaded:', wishlist);
    });
  }

  addToWishlist(productId: number): void {
    const userId = Number(this.tokenService.getUserId());
    if (!userId) {
      console.error('User not logged in');
      Swal.fire('Error', 'Please log in to add to wishlist', 'error');
      return;
    }
    this.produitsService.addToWishlist(userId, productId).pipe(
      catchError(err => {
        console.error('WishlistService: Error adding to wishlist:', err);
        Swal.fire('Error', err.error?.message || 'Failed to add to wishlist', 'error');
        return of(null);
      })
    ).subscribe(() => {
      this.loadWishlist();
      Swal.fire('Success', 'Added to wishlist!', 'success');
    });
  }

  removeFromWishlist(productId: number): void {
    const userId = Number(this.tokenService.getUserId());
    if (!userId) {
      console.error('User not logged in');
      Swal.fire('Error', 'Please log in to remove from wishlist', 'error');
      return;
    }
    this.produitsService.removeFromWishlist(userId, productId).pipe(
      catchError(err => {
        console.error('WishlistService: Error removing from wishlist:', err);
        Swal.fire('Error', err.error?.message || 'Failed to remove from wishlist', 'error');
        return of(null);
      })
    ).subscribe(() => {
      this.loadWishlist();
      Swal.fire('Success', 'Removed from wishlist!', 'success');
    });
  }
}