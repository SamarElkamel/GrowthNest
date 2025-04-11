import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

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
  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  

checkoutCart(): void {
  this.cartService.checkoutCart(
    this.userId,
    this.deliveryAddress,
    this.paymentMethod
  ).subscribe({
    next: () => this.loadCart(),
    error: err => console.error('Checkout failed', err)
  });
}

  get cartItems(): OrderItem[] {
    return this.cart?.items || [];
  }

  get subtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity * item.priceAtTime, 0);
  }

  get total(): number {
    return this.cart?.totalAmount ?? this.subtotal;
  }

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
