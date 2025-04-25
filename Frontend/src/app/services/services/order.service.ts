import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderResponse } from '../models/order-response.model'; // Adjust the path as needed
import { TokenService } from '../token/token.service';


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'http://localhost:8080/Growthnest/api/orders'; 

  constructor(private http: HttpClient,
  private tokenService : TokenService
  ) {}
 
  getOrders(status?: string, userId?: number, fromDate?: string, toDate?: string): Observable<OrderResponse[]> {
    if (!userId) {
      userId = Number(this.tokenService.getUserId());
      console.log('userId1:', userId);
    }
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    if (userId) params = params.set('userId', userId.toString());
    if (fromDate) params = params.set('fromDate', fromDate);
    if (toDate) params = params.set('toDate', toDate);

    return this.http.get<OrderResponse[]>(`${this.baseUrl}/admin`, { params });
  }
  getFilteredOrders(params: any): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${this.baseUrl}/admin/orders`, { params });
  }
  updateOrderStatus(orderId: number, status: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/admin/orders/${orderId}/status`, { status });
  }
  getOrderDetails(orderId: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.baseUrl}/orders/${orderId}`);
  }  
  getOrderById(orderId: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.baseUrl}/${orderId}`);
  }
  reorder(originalOrderId: number): Observable<OrderResponse> {
    const userId = 1; // or dynamically pull this later
    return this.http.post<OrderResponse>(
      `${this.baseUrl}/reorder/${originalOrderId}?userId=${userId}`,
      {}
    );
  }
  getOrderHistory(userId: number): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${this.baseUrl}/user/${userId}`);
  }  
}