import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Coupon, CouponAnalytics, CreateCouponDTO } from '../models/coupons.mode';

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  private baseUrl = 'http://localhost:8080/Growthnest/api/coupons'; // adjust if needed

  constructor(private http: HttpClient) {}

  getAll(): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(this.baseUrl);
  }

  create(coupon: CreateCouponDTO): Observable<Coupon> {
    return this.http.post<Coupon>(this.baseUrl, coupon);
  }

  toggleStatus(id: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/toggle`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  getCouponAnalytics(): Observable<CouponAnalytics[]> {
    return this.http.get<CouponAnalytics[]>(`${this.baseUrl}/admin/coupons/analytics`);
  }
  
}
