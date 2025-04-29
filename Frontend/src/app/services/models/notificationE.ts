
export interface NotificationE {
  id: number;
  message: string;
  type: 'BUSINESS_SUBMITTED' | 'BUSINESS_APPROVED' | 'BUSINESS_REJECTED';
  recipient: { id: number };
  business: { idBusiness: number; name: string } | null;
  isRead: boolean;
  createdAt: string;
}



import { Registration } from '../models/registration';
export interface Notification {
  createdAt?: string;
  idNotification?: number;
  message?: string;
  read?: boolean;
  registration?: Registration;
}
