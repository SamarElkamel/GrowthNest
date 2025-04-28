import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexStroke, ApexTitleSubtitle, ApexXAxis, ApexYAxis, ChartComponent } from 'ng-apexcharts';
import { formatDate } from '@angular/common';
import Swal from 'sweetalert2';
import { RevenueService } from 'src/app/services/services/RevenueService.service';

export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  fill: ApexFill;
}

@Component({
  selector: 'app-revenue-dashboard',
  templateUrl: './revenue-dashboard.component.html',
  styleUrls: ['./revenue-dashboard.component.scss']
})
export class RevenueDashboardComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;

  businessId: number;
  totalRevenue: number = 0;
  grossProfit: number = 0;
  topProducts: any[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  // Date range
  startDate: string = formatDate(new Date(new Date().setMonth(new Date().getMonth() - 1)), 'yyyy-MM-dd', 'en');
  endDate: string = formatDate(new Date(), 'yyyy-MM-dd', 'en');

  // Chart configuration
  public chartOptions: ChartOptions = {
    series: [{
      name: 'Chiffre d\'Affaires',
      data: []
    }],
    chart: {
      type: 'area',
      height: 350,
      zoom: { enabled: false }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.4
      }
    },
    xaxis: {
      categories: []
    },
    yaxis: {
      labels: {
        formatter: (value) => `€${value.toFixed(2)}`
      }
    },
    title: {
      text: 'Tendances des Revenus',
      align: 'left'
    }
  };

  granularity: 'daily' | 'weekly' | 'monthly' = 'monthly';

  constructor(
    private route: ActivatedRoute,
    private revenueService: RevenueService
  ) {
    this.businessId = +this.route.snapshot.paramMap.get('businessId')!;
  }

  ngOnInit(): void {
    this.loadRevenueData();
  }

  loadRevenueData(): void {
    this.isLoading = true;
    Promise.all([
      this.revenueService.getTotalRevenue(this.businessId, this.startDate, this.endDate).toPromise(),
      this.revenueService.getGrossProfit(this.businessId, this.startDate, this.endDate).toPromise(),
      this.revenueService.getSalesByProduct(this.businessId, this.startDate, this.endDate).toPromise(),
      this.revenueService.getRevenueTrends(this.businessId, this.startDate, this.endDate, this.granularity).toPromise()
    ]).then(([totalRevenue, grossProfit, topProducts, trends]) => {
      this.totalRevenue = totalRevenue || 0;
      this.grossProfit = grossProfit || 0;
      this.topProducts = topProducts || [];
      this.chartOptions.series = [{
        name: 'Chiffre d\'Affaires',
        data: trends ? trends.map(t => Number(t.revenue)) : []
      }];
      this.chartOptions.xaxis = {
        categories: trends ? trends.map(t => t.date) : []
      };
      this.isLoading = false;
    }).catch(err => {
      this.errorMessage = 'Erreur lors du chargement des données.';
      this.isLoading = false;
      Swal.fire('Erreur', 'Impossible de charger les données de revenu', 'error');
    });
  }

  updateDateRange(): void {
    if (this.startDate && this.endDate) {
      this.loadRevenueData();
    }
  }

  changeGranularity(granularity: 'daily' | 'weekly' | 'monthly'): void {
    this.granularity = granularity;
    this.loadRevenueData();
  }
}