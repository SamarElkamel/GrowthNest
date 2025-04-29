import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/services/order.service';
import { OrderResponse } from 'src/app/services/models/order-response.model';
import { NotificationService } from 'src/app/services/services/notif.service';
import { TokenService } from 'src/app/services/token/token.service';


@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
  userId!:number;
  orders: OrderResponse[] = [];

  constructor(private orderService: OrderService,
              private notification: NotificationService, 
              private tokenService:TokenService,
              
            
  ) {}
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'badge badge-warning';   
      case 'CONFIRMED' :
        return 'badge badge-primary';   
      case 'SHIPPED':
        return 'badge badge-info';   
      case 'DELIVERED':
        return 'badge badge-success';   
      case 'CANCELLED':
        return 'badge badge-danger';    
      default:
        return 'badge badge-secondary';
    }
  }
  
  ngOnInit(): void {
    this.userId = Number(this.tokenService.getUserId());
    this.orderService.getOrderHistory(this.userId).subscribe({
      next: data => this.orders = data,
      error: err => console.error('Failed to load order history', err)
    });
  }

  reorder(originalOrderId: number): void {
    this.notification.confirm('Are you sure you want to re-order this?').then(result => {
      if (result.isConfirmed) {
        this.orderService.reorder(originalOrderId).subscribe({
          next: () => {
            this.notification.success('✅ Cart updated successfully with your previous order! 🎉');
          },
          error: (err) => {
            this.notification.error(err.error?.message || '❌ Failed to re-order. Please try again later.');
          }
        });
      }
    });
  }
  
}
