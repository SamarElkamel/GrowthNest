import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = 'http://localhost:8080/Growthnest/api/cart';

  constructor(private http: HttpClient) {}

  getCart(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${userId}`);
  }

  updateItemQuantity(userId: number, productId: number, quantity: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/item/${productId}`, {
      userId,
      quantity
    });
  }

  removeItemFromCart(userId: number, productId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/item/${productId}`, {
      body: { userId }
    });
  }

  applyCouponToCart(userId: number, couponCode: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/apply-coupon`, {
      userId,
      couponCode
    });
  }

  checkoutCart(userId: number, deliveryAddress: string, paymentMethod: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/checkoutUser`, {
      userId,
      deliveryAddress,
      paymentMethod
    });
  }

  cancelCart(userId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}`, {
      body: { userId }
    });
  }

  // Optional: For adding multiple items
  addItems(userId: number, items: { productId: number; quantity: number }[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/add-items`, {
      userId,
      orderDetails: items
    });
  }
  addItemToCart(userId: number, productId: number, quantity: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/add-items`, {
      userId,
      orderDetails: [{ productId, quantity }]
    });
  }
  applyPoints(userId: number, points: number, cartTotal: number) {
    return this.http.post<any>(`${this.baseUrl}/apply-points`, {
      userId: userId,
      pointsToRedeem: points,
      cartTotal: cartTotal
    });
  }
}
