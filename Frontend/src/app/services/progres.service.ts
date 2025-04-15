import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProgressDTO } from '../models/progress.model';

@Injectable({
  providedIn: 'root'
})
export class ProgresService {
  private baseUrl = 'http://localhost:8080/Growthnest/api/cart'; 
  private progressSubject = new BehaviorSubject<ProgressDTO | null>(null);

  constructor(private http: HttpClient) {}

  fetchProgress(userId: number): void {
    this.http.get<ProgressDTO>(`${this.baseUrl}/user-progress/${userId}`).subscribe(
      (data) => this.progressSubject.next(data),
      (err) => console.error('Failed to load user progress', err)
    );
  }

  getProgress(): Observable<ProgressDTO | null> {
    return this.progressSubject.asObservable();
  }
}
