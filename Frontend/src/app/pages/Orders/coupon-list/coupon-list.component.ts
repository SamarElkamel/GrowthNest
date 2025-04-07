import { Component, OnInit } from '@angular/core';
import { Coupon } from 'src/app/models/coupons.mode';
import { CouponService } from 'src/app/services/coupon.service';

@Component({
  selector: 'app-coupon-list',
  templateUrl: './coupon-list.component.html',
  styleUrls: ['./coupon-list.component.scss']
})
export class CouponListComponent implements OnInit {
  coupons: Coupon[] = [];

  constructor(private couponService: CouponService) {}

  ngOnInit(): void {
    this.loadCoupons();
  }

  loadCoupons() {
    this.couponService.getAll().subscribe(res => this.coupons = res);
  }

  toggleActive(id: number) {
    this.couponService.toggleStatus(id).subscribe(() => this.loadCoupons());
  }

  deleteCoupon(id: number) {
    if (confirm('Are you sure?')) {
      this.couponService.delete(id).subscribe(() => this.loadCoupons());
    }
  }
}

