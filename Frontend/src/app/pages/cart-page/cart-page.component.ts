import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';

interface OrderItem {
  productId: number;
  productName: string;
  priceAtTime: number;
  quantity: number;
  productImageUrl?: string;
}

interface Cart {
  orderId: number;
  totalAmount: number;
  status: string;
  deliveryAddress: string;
  paymentMethod: string;
  items: OrderItem[];
  couponCode?: string;
  discountAmount?: number;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss']
})
export class CartPageComponent implements OnInit {
  userId = 1;
  cart: Cart | null = null;
  couponCode: string = '';
  deliveryAddress: string = '';
  paymentMethod: string = 'Cash';
  availablePoints = 0;
  pointsToRedeem = 0;
  redeeming = false;
  discount = 0;
  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  applyPoints() {
    this.cartService.applyPoints(this.userId, this.pointsToRedeem, this.total).subscribe({
      next: res => {
        this.discount = res.discount;
        if (this.cart) {
          this.cart.discountAmount = this.subtotal - res.newTotal;
        }
        this.redeeming = false;
      },
      error: err => {
        alert(err.error?.error || 'Could not redeem points');
      }
    });
  }
  
cancelRedemption() {
  this.pointsToRedeem = 0;
  this.discount = 0;
  this.redeeming = false;
}
  checkoutCart(): void {
    if (this.paymentMethod === 'Cash') {
      this.cartService.checkoutCart(
        this.userId,
        this.deliveryAddress,
        this.paymentMethod
      ).subscribe({
        next: () => {
          alert('Order placed with Cash on Delivery!');
          this.loadCart();
        },
        error: err => console.error('Checkout failed', err)
      });
    } else if (this.paymentMethod === 'Stripe') {
      // Redirect to payment page with queryParams
      window.location.href = `/payment?userId=${this.userId}&cartId=${this.cart?.orderId}&amount=${this.total}`;
    }
  }
  

  get cartItems(): OrderItem[] {
    return this.cart?.items || [];
  }

  get subtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity * item.priceAtTime, 0);
  }

  get total(): number {
    return this.subtotal - (this.cart?.discountAmount || 0);  }

  loadCart(): void {
    this.cartService.getCart(this.userId).subscribe({
      next: data => {
        this.cart = data;
      },
      error: err => console.error('Failed to load cart', err)
    });
  }

  incrementQty(item: OrderItem): void {
    item.quantity++;
    this.updateQuantity(item);
  }

  decrementQty(item: OrderItem): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateQuantity(item);
    }
  }

  updateQuantity(item: OrderItem): void {
    this.cartService.updateItemQuantity(this.userId, item.productId, item.quantity).subscribe({
      next: () => this.loadCart(),
      error: err => console.error('Failed to update quantity', err)
    });
  }

  removeItem(item: OrderItem): void {
    this.cartService.removeItemFromCart(this.userId, item.productId).subscribe({
      next: () => this.loadCart(),
      error: err => console.error('Failed to remove item', err)
    });
  }

  applyCoupon(): void {
    this.cartService.applyCouponToCart(this.userId, this.couponCode).subscribe({
      next: () => {
        this.couponCode = '';
        this.loadCart();
      },
      error: err => console.error('Failed to apply coupon', err)
    });
  }

  updateCart(): void {
    this.loadCart();
  }

  
}
