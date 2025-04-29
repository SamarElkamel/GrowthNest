import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/services/cart.service';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { NotificationService } from 'src/app/services/services/notif.service';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token/token.service';
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
  userId!:number;
  cart: Cart | null = null;
  couponCode: string = '';
  deliveryAddress: string = '';
  paymentMethod: string = 'Cash';
  availablePoints = 0;
  pointsToRedeem = 0;
  redeeming = false;
  discount = 0;
  constructor(private cartService: CartService,
    private notification: NotificationService ,
    private router: Router ,
     private tokenService:TokenService,
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.tokenService.getUserId());
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
        this.notification.success('Points redeemed successfully!');
      },
      error: err => {
        this.notification.error(err.message || 'Could not redeem points');
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
        
        this.notification.success('Order placed successfully! Redirecting to your order history...')
          .then(() => {
            this.router.navigate(['/orders/history']);
          });
      },
      error: (err) => {
        this.notification.error(err);
      }
    });
  } else if (this.paymentMethod === 'Stripe') {
    this.router.navigate(['/payment']);
  }
}


isCheckoutValid(): boolean {
  return (
    this.deliveryAddress.trim().length > 0 &&
    typeof this.paymentMethod === 'string' && this.paymentMethod.trim().length > 0 &&
    this.cartItems.length > 0 &&
    this.total > 0
  );
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
        error: err => {
          this.notification.error(err.message || 'Failed to load cart.');
        }
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
      error: err => {
        this.notification.error(err.message || 'Failed to update item quantity.');
      }
    });
  }
  

  removeItem(item: OrderItem): void {
    this.cartService.removeItemFromCart(this.userId, item.productId).subscribe({
      next: () => {
        this.notification.success('Item removed successfully.');
        this.loadCart();
      },
      error: err => {
        this.notification.error(err.message || 'Failed to remove item.');
      }
    });
  }
  

  applyCoupon(): void {
    this.cartService.applyCouponToCart(this.userId, this.couponCode).subscribe({
      next: () => {
        this.notification.success('Coupon applied successfully!');
        this.couponCode = '';
        this.loadCart();
      },
      error: (err) => {
        this.notification.error(err);  
      }
    });
  }
  
  updateCart(): void {
    this.loadCart();
  }

  
}

