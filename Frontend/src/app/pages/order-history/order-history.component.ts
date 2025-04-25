import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/services/order.service';
import { OrderResponse } from 'src/app/services/models/order-response.model';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
  userId! : number;
  orders: OrderResponse[] = [];

  constructor(private orderService: OrderService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.tokenService.getUserId());
    this.orderService.getOrderHistory(this.userId).subscribe({
      next: data => this.orders = data,
      error: err => console.error('Failed to load order history', err)
    });
  }

  reorder(originalOrderId: number): void {
    this.orderService.reorder(originalOrderId).subscribe({
      next: () => alert('Cart updated with re-order!'),
      error: err => console.error('Failed to re-order', err)
    });
  }
}
