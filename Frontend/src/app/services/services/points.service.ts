// src/app/services/points.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface UserPoints {
  totalPoints: number;
  redeemedPoints: number;
  availablePoints: number;
}

@Injectable({ providedIn: 'root' })
export class PointsService {
  private baseUrl = 'http://localhost:8080/Growthnest/api/cart';

  constructor(private http: HttpClient) {}

  getPoints(userId: number): Observable<UserPoints> {
    return this.http.get<UserPoints>(`${this.baseUrl}/points/${userId}`);
  }
}
