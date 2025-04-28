import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartComponent } from 'ng-apexcharts';
import { ApexNonAxisChartSeries, ApexChart, ApexLegend } from 'ng-apexcharts';

interface BusinessStatistics {
  totalBusinesses: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  averageRating: number;
  highRatingCount: number;
}

export interface ChartOptions {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  legend: ApexLegend;
}

@Component({
  selector: 'app-admin-statistics',
  templateUrl: './admin-statistics.component.html',
  styleUrls: ['./admin-statistics.component.scss']
})
export class AdminStatisticsComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  statistics: BusinessStatistics | null = null;
  chartOptions: ChartOptions = {
    series: [],
    chart: {
      type: 'pie',
      height: 350
    },
    labels: ['Pending', 'Approved', 'Rejected'],
    colors: ['#FFCA28', '#4CAF50', '#EF5350'],
    legend: {
      position: 'bottom'
    }
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.http.get<BusinessStatistics>('http://localhost:8080/Growthnest/business/statistics').subscribe({
      next: (data) => {
        this.statistics = data;
        this.prepareChartData();
      },
      error: (err) => {
        console.error('Error loading statistics:', err);
      }
    });
  }

  prepareChartData(): void {
    if (this.statistics) {
      this.chartOptions.series = [
        this.statistics.pendingCount,
        this.statistics.approvedCount,
        this.statistics.rejectedCount
      ];
    }
  }
}