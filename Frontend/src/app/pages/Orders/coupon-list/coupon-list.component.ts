import { Component, OnInit } from '@angular/core';
import { Coupon, CouponAnalytics } from 'src/app/services/models/coupons.mode';
import { CouponService } from 'src/app/services/services/coupon.service';

@Component({
  selector: 'app-coupon-list',
  templateUrl: './coupon-list.component.html',
  styleUrls: ['./coupon-list.component.scss']
})
export class CouponListComponent implements OnInit {
  coupons: Coupon[] = [];
  analyticsList: CouponAnalytics[] = [];
  paginatedCoupons: Coupon[] = []; // For current page coupons
  currentPage: number = 1;
  itemsPerPage: number = 10; // Number of items per page
  totalPages: number = 0; // Total pages
  pages: number[] = []; // Pages array for pagination

  constructor(private couponService: CouponService) {}

  ngOnInit(): void {
    this.loadCoupons();
    this.fetchCouponAnalytics();
  }

  // Fetch analytics data
  fetchCouponAnalytics() {
    this.couponService.getCouponAnalytics().subscribe({
      next: (data) => {
        this.analyticsList = data;
      },
      error: (err) => {
        console.error('Error fetching analytics', err);
      }
    });
  }

  // Load coupons with pagination
  loadCoupons() {
    this.couponService.getAll().subscribe(res => {
      this.coupons = res;
      this.updatePagination();
    });
  }

  // Update pagination data
  updatePagination(): void {
    this.totalPages = Math.ceil(this.coupons.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCoupons = this.coupons.slice(startIndex, endIndex);

    // Generate pages for pagination
    this.pages = Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  // Toggle the status of the coupon
  toggleActive(id: number) {
    this.couponService.toggleStatus(id).subscribe(() => this.loadCoupons());
  }

  // Delete the coupon
  deleteCoupon(id: number) {
    if (confirm('Are you sure?')) {
      this.couponService.delete(id).subscribe(() => this.loadCoupons());
    }
  }

  // Pagination methods
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
