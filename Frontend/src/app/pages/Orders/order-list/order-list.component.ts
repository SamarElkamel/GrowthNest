import { Component, OnInit } from '@angular/core';
import { OrderResponse } from 'src/app/services/models/order-response.model';
import { OrderService } from 'src/app/services/services/order.service';
import { MatDialog } from '@angular/material/dialog';
import { OrderDetailsModalComponent } from 'src/app/BackOffice/component/order-details-modals/order-details-modals.component';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  orders: OrderResponse[] = [];
  paginatedOrders: OrderResponse[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  pages: number[] = [];

  statuses = ['CART', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELED'];

  filters = {
    status: '',
    startDate: '',
    endDate: ''
  };

  constructor(private orderService: OrderService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.orderService.getOrders().subscribe(data => {
      this.orders = data;
      this.updatePagination();
    });
  }

  applyFilters() {
    const queryParams: any = {};

    if (this.filters.status) {
      queryParams.status = this.filters.status;
    }

    if (this.filters.startDate) {
      queryParams.startDate = new Date(this.filters.startDate).toISOString();
    }

    if (this.filters.endDate) {
      queryParams.endDate = new Date(this.filters.endDate).toISOString();
    }

    this.orderService.getFilteredOrders(queryParams).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.updatePagination();
      },
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

  // Pagination logic
  updatePagination(): void {
    this.totalPages = Math.ceil(this.orders.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedOrders = this.orders.slice(startIndex, endIndex);

    this.pages = Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }
}
