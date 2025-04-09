import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DeliveryAgency {
  idAgency: number;
  agencyName: string;
  address: string;
  phoneNumber: string;
}

@Injectable({
  providedIn: 'root'
})
export class DeliveryAgencyService {
  private apiUrl = 'http://localhost:8080/api/delivery-agencies'; 

  constructor(private http: HttpClient) {}

  getAll(): Observable<DeliveryAgency[]> {
    return this.http.get<DeliveryAgency[]>(this.apiUrl);
  }
}
