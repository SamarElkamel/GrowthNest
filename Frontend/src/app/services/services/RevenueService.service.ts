import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RevenueService {
  private baseUrl = 'http://localhost:8080/Growthnest/api/revenue';

  constructor(private http: HttpClient) {}

  getTotalRevenue(businessId: number, startDate: string, endDate: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/total/${businessId}?startDate=${startDate}T00:00:00&endDate=${endDate}T23:59:59`)
      .pipe(map(bd => Number(bd)));
  }

  getGrossProfit(businessId: number, startDate: string, endDate: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/profit/${businessId}?startDate=${startDate}T00:00:00&endDate=${endDate}T23:59:59`)
      .pipe(map(bd => Number(bd)));
  }

  getSalesByProduct(businessId: number, startDate: string, endDate: string, limit: number = 5): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/sales-by-product/${businessId}?startDate=${startDate}T00:00:00&endDate=${endDate}T23:59:59&limit=${limit}`);
  }

  getRevenueTrends(businessId: number, startDate: string, endDate: string, granularity: 'daily' | 'weekly' | 'monthly'): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/trends/${businessId}?startDate=${startDate}T00:00:00&endDate=${endDate}T23:59:59&granularity=${granularity}`);
  }
}