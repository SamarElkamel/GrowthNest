import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Client, StompSubscription } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { AuthenticationService } from './authentication.service';
import { TokenService } from '../token/token.service';
import { NotificationE } from '../models/notificationE';

@Injectable({
  providedIn: 'root'
})
export class BusinessNotificationService {
  private apiUrl = 'http://localhost:8080/business';
 // private wsUrl = 'http://localhost:8080/ws';
  private stompClient: Client | null = null;
  private subscription: StompSubscription | null = null;
  private notificationsSubject = new BehaviorSubject<NotificationE[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private tokenService: TokenService
  ) {}

  initializeWebSocket(): void {
    if (!this.authService.isAuthenticated() || this.stompClient?.active) {
      return;
    }
    const userId = this.tokenService.getUserId();
    if (!userId) {
      console.error('No user ID found');
      return;
    }
    /*this.stompClient = new Client({
      webSocketFactory: () => new SockJS(this.wsUrl),
      connectHeaders: {
        Authorization: `Bearer ${this.tokenService.getToken()}`
      },
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    this.stompClient.onConnect = () => {
      this.subscription = this.stompClient!.subscribe(
        `/topic/business-notifications-${userId}`,
        (message) => {
          const notification: NotificationE = JSON.parse(message.body);
          const currentNotifications = this.notificationsSubject.getValue();
          this.notificationsSubject.next([notification, ...currentNotifications]);
        }
      );
    };

    this.stompClient.onStompError = (frame) => {
      console.error('STOMP error:', frame);
    };

    this.stompClient.activate();
  }

  disconnectWebSocket(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
    }
  }

  getNotifications(): Observable<NotificationE[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.tokenService.getToken()}`
    });
    return this.http.get<NotificationE[]>(`${this.apiUrl}/business-notifications`, { headers });
  }

  getUnreadNotifications(): Observable<NotificationE[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.tokenService.getToken()}`
    });
    return this.http.get<NotificationE[]>(`${this.apiUrl}/business-notifications/unread`, { headers });
  }

  markAsRead(notificationId: number): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.tokenService.getToken()}`
    });
    return this.http.post<void>(`${this.apiUrl}/business-notifications/${notificationId}/read`, {}, { headers });
  }

  approveBusiness(businessId: number): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.tokenService.getToken()}`
    });
    return this.http.post<void>(`${this.apiUrl}/approve/${businessId}`, {}, { headers });
  }

  rejectBusiness(businessId: number): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.tokenService.getToken()}`
    });
    return this.http.post<void>(`${this.apiUrl}/reject/${businessId}`, {}, { headers });
  }

  loadInitialNotifications(): void {
    this.getNotifications().subscribe({
      next: (notifications) => {
        this.notificationsSubject.next(notifications.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      },
      error: (err) => console.error('Error loading notifications:', err)
    });
  }*/
}}