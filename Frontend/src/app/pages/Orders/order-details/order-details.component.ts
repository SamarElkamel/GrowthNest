import { Component, Input } from '@angular/core';
import { OrderService } from 'src/app/services/services/order.service'; // adjust path as needed

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
})
export class OrderDetailsComponent {
  @Input() orderId!: number;
  order: any;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.fetchOrder();
  }

  fetchOrder() {
    this.orderService.getOrderById(this.orderId).subscribe((res) => {
      this.order = res;
    });
  }
}
