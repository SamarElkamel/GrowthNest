import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { NotificationE } from '../models/notificationE';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private client: Client;
  private notificationsSubject = new BehaviorSubject<NotificationE[]>(this.loadNotifications());
  notifications$: Observable<NotificationE[]> = this.notificationsSubject.asObservable();
  private isConnected = false;

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      debug: (str) => console.log('WebSocket Debug:', str)
    });

    this.client.onConnect = () => {
      console.log('WebSocket Connected');
      this.isConnected = true;
      this.subscribeToTopic('/topic/admin-notifications');
      this.subscribeToTopic('/topic/owner-notifications-1');
    };

    this.client.onStompError = (frame) => {
      console.error('WebSocket Error:', frame);
      this.isConnected = false;
    };

    this.client.onWebSocketError = (error) => {
      console.error('WebSocket Connection Error:', error);
      this.isConnected = false;
    };

    this.client.onWebSocketClose = () => {
      console.log('WebSocket Disconnected');
      this.isConnected = false;
    };

    try {
      this.client.activate();
    } catch (e) {
      console.error('Error activating WebSocket client:', e);
    }
  }

  subscribeToTopic(topic: string): void {
    if (this.isConnected) {
      this.subscribeToTopicInternal(topic);
    } else {
      this.client.onConnect = () => {
        console.log(`Connected to WebSocket, subscribing to ${topic}`);
        this.isConnected = true;
        this.subscribeToTopicInternal(topic);
      };
    }
  }

  private subscribeToTopicInternal(topic: string): void {
    this.client.subscribe(topic, (message) => {
      try {
        const notification: NotificationE = {
          ...JSON.parse(message.body),
          timestamp: new Date().toISOString()
        };
        console.log('Received notification:', notification);
        const currentNotifications = this.notificationsSubject.getValue();
        const updatedNotifications = [...currentNotifications, notification];
        this.notificationsSubject.next(updatedNotifications);
        this.saveNotifications(updatedNotifications);
      } catch (e) {
        console.error('Error parsing WebSocket message:', e);
      }
    });
  }

  disconnect(): void {
    try {
      this.client.deactivate();
      this.isConnected = false;
    } catch (e) {
      console.error('Error deactivating WebSocket client:', e);
    }
  }

  clearNotifications(): void {
    this.notificationsSubject.next([]);
    this.saveNotifications([]);
  }

  private saveNotifications(notifications: NotificationE[]): void {
    try {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    } catch (e) {
      console.error('Error saving notifications:', e);
    }
  }

  private loadNotifications(): NotificationE[] {
    try {
      const saved = localStorage.getItem('notifications');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading notifications:', e);
      return [];
    }
  }
}
