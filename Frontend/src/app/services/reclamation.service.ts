import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ReclamationType } from '../FrontOffice/models/reclamation-type';

export interface Reclamation {
  reclamationId?: number;
  description: string;
  type: String;  
  reclamationDate?: Date;
  status?: string;  
}
@Injectable({
  providedIn: 'root'
})
export class ReclamationService {
  private apiUrl = 'http://localhost:8080/Growthnest/reclamation'; 

  constructor(private http: HttpClient) {}

  getAll(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(`${this.apiUrl}/retrieveAllReclamations`).pipe(
      map(recs => recs.map(rec => ({
        ...rec,
        type: rec.type as ReclamationType
      })))
    );
  };
  

  add(reclamation: Reclamation): Observable<Reclamation> {
    return this.http.post<Reclamation>(`${this.apiUrl}/addReclamation`, reclamation);
  }

  update(reclamation: Reclamation): Observable<Reclamation> {
    return this.http.put<Reclamation>(`${this.apiUrl}/updateReclamation`, reclamation);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteReclamation/${id}`);
  }
  getReclamationTypes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reclamation-types`);
  }
 // generatePdfReport() {
   // const headers = new HttpHeaders({ 'Accept': 'application/pdf' });
    //return this.http.get(`${this.apiUrl}/reports/reclamations`, { 
      //responseType: 'blob',
      //headers: headers
    //});
 // }
}
