import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderService } from 'src/app/services/services/order.service';

@Component({
  selector: 'app-order-details-modal',
  templateUrl: './order-details-modals.component.html',
})
export class OrderDetailsModalComponent implements OnInit {
  order: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { orderId: number },
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.orderService.getOrderById(this.data.orderId).subscribe((res) => {
      this.order = res;
    });
  }
}
