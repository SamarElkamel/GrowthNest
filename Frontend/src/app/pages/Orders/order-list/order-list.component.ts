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
  filters = {
    status: '',
    startDate: '',
    endDate: ''
  };
  applyFilters() {
    const queryParams: any = {};
  
    if (this.filters.status) {
      queryParams.status = this.filters.status;
    }
  
    if (this.filters.startDate) {
      queryParams.startDate = new Date(this.filters.startDate).toISOString(); // e.g., 2024-01-01T00:00:00
    }
  
    if (this.filters.endDate) {
      queryParams.endDate = new Date(this.filters.endDate).toISOString();
    }
  
    this.orderService.getFilteredOrders(queryParams).subscribe({
      next: (orders) => this.orders = orders,
      error: (err) => console.error('Failed to fetch filtered orders:', err)
    });
  }
  
  
  resetFilters() {
    this.filters = { status: '', startDate: '', endDate: '' };
    this.applyFilters();
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