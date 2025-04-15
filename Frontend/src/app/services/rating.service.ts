import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Rating } from "../FrontOffice/models/rating";

@Injectable({ providedIn: 'root' })
export class RatingService {
  private baseUrl = 'http://localhost:8080/Growthnest/rating';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Rating[]> {
    return this.http.get<Rating[]>(this.baseUrl);
  }

  add(rating: Rating): Observable<Rating> {
    return this.http.post<Rating>(this.baseUrl, rating);
  }
  update(rating: Rating): Observable<Rating> {
    return this.http.put<Rating>(this.baseUrl, rating);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}