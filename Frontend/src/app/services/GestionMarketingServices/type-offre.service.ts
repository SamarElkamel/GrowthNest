import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TypeOffre } from '../../models/GestionMarketingModels/type-offre.model';

@Injectable({
  providedIn: 'root'
})
export class TypeOffreService {
  private baseUrl = '/Growthnest/types-offres';


  constructor(private http: HttpClient) {}

  createTypeOffre(type: TypeOffre): Observable<TypeOffre> {
    return this.http.post<TypeOffre>(`${this.baseUrl}/addType`, type);
  }
  
  getAllTypes(): Observable<TypeOffre[]> {
    return this.http.get<TypeOffre[]>(`${this.baseUrl}/retrieveAllTypes`);
  }
  deleteTypeOffre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteType/${id}`);
  }
  
  
}
