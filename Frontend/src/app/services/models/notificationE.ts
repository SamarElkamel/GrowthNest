
export interface NotificationE {
    businessId: number;
    businessName: string;
    message: string;
    ownerId?: string;
    timestamp?: string;
  }



import { Registration } from '../models/registration';
export interface Notification {
  createdAt?: string;
  idNotification?: number;
  message?: string;
  read?: boolean;
  registration?: Registration;
}
