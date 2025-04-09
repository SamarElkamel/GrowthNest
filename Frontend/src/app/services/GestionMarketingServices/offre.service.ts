import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Offre } from '../../models/GestionMarketingModels/offre.model';
import { TypeOffre } from '../../models/GestionMarketingModels/type-offre.model';

@Injectable({
  providedIn: 'root'
})
export class OffreService {
  private baseUrl = '/Growthnest/offres';

  constructor(private http: HttpClient) {}

  createOffre(offre: Offre): Observable<Offre> {
    return this.http.post<Offre>(`${this.baseUrl}/addOffre`, offre);
  }

  getTypesOffre(): Observable<TypeOffre[]> {
    return this.http.get<TypeOffre[]>(`${this.baseUrl}/types`);
  }
  getAllOffres(): Observable<Offre[]> {
    return this.http.get<Offre[]>(`${this.baseUrl}/retrieveAllOffres`);
  }
  
  deleteOffre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteOffre/${id}`);
  }
  updateOffre(id: number, offre: Offre): Observable<Offre> {
    return this.http.put<Offre>(`${this.baseUrl}/updateOffre/${id}`, offre);
  }
  
  
}
