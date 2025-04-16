// src/app/services/report.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = 'http://localhost:8080/Growthnest'; // Base URL sans /reclamation

  constructor(private http: HttpClient) {}

  generateReclamationsPdf(): Observable<Blob> {
    const headers = new HttpHeaders({ 
      'Accept': 'application/pdf',
      'Authorization': `Bearer ${this.getToken()}` // Ajoutez le token si nécessaire
    });

    return this.http.get(`${this.apiUrl}/reports/reclamations`, {
      responseType: 'blob',
      headers: headers
    });
  }

  private getToken(): string {
    // Implémentez la récupération du token JWT depuis votre système d'authentification
    return localStorage.getItem('auth_token') || '';
  }
}