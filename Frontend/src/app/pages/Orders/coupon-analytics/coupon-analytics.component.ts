import { Component } from '@angular/core';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import { CouponAnalytics } from 'src/app/models/coupons.mode';
import { CouponService } from 'src/app/services/coupon.service';

@Component({
  selector: 'app-coupon-analytics',
  templateUrl: './coupon-analytics.component.html'
})
export class CouponAnalyticsComponent {
  chartLabels: string[] = [];
  chartData: ChartDataset[] = [];
  chartType: ChartType = 'bar';
  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Coupon Usage Analytics' }
    }
  };

  constructor(private couponService: CouponService) {}

  ngOnInit(): void {
    this.couponService.getCouponAnalytics().subscribe((data: CouponAnalytics[]) => {
      this.chartLabels = data.map(c => c.code);
      this.chartData = [
        {
          label: 'Used',
          data: data.map(c => c.countUsers),
          backgroundColor: 'rgba(54, 162, 235, 0.6)'
        },
        {
          label: 'Remaining',
          data: data.map(c => c.remainingUses),
          backgroundColor: 'rgba(255, 206, 86, 0.6)'
        }
      ];
    });
  }
}
