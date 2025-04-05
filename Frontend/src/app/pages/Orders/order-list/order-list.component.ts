import { Component, OnInit } from '@angular/core';
import { OrderResponse } from 'src/app/models/order-response.model';
import { OrderService } from 'src/app/services/order.service';
import { MatDialog } from '@angular/material/dialog';
import { OrderDetailsModalComponent } from 'src/app/BackOffice/component/order-details-modals/order-details-modals.component';
@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  orders: OrderResponse[] = [];

  constructor(private orderService: OrderService,private dialog: MatDialog) {}
  statuses = ['CART', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELED'];

  
  ngOnInit(): void {
    this.orderService.getOrders().subscribe(data => {
      this.orders = data;
    });
  }

  updateStatus(order: OrderResponse, newStatus: string): void {
    this.orderService.updateOrderStatus(order.orderId, newStatus).subscribe({
      next: () => {
        order.status = newStatus;
        console.log('Order status updated successfully');
      },
      error: (err) => {
        console.error('Error updating status:', err);
      }
    });
  }
  openOrderDetails(orderId: number) {
    this.dialog.open(OrderDetailsModalComponent, {
      width: '600px',
      data: { orderId },
    });
}
}