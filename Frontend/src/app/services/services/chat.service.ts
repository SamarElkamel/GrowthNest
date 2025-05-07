import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ChatService {
  private apiUrl = 'http://localhost:8080/Growthnest/api/chat'; // Adjust to your Spring backend port

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<string> {
    return this.http.post(this.apiUrl, message, { responseType: 'text' });
  }
}