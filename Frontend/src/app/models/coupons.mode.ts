export interface Coupon {
    id: number;
    code: string;
    discountPercentage: number;
    expiryDate: string;
    active: boolean;
    global: boolean;
    ownerName: string;
    maxUses: number;
    usageCount: number;
    productNames: string[];
  }
  
  export interface CreateCouponDTO {
    code: string;
    discountPercentage: number;
    expiryDate: string;
    global: boolean;
    productIds: number[];
    ownerId: number;
    maxUses: number;
    usageCount?: number;
  }
  export interface CouponAnalytics {
    code: string;
    countUsers: number;
    maxUses: number;
    remainingUses: number;
    expired: boolean;
  }
  