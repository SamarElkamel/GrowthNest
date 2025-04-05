export interface OrderItemDTO {
    productId: number;
    productName: string;
    priceAtTime: number;
    quantity: number;
  }
  
  export interface OrderResponse {
    orderId: number;
    totalAmount: number;
    status: string;
    deliveryAddress: string;
    paymentMethod: string;
    items: OrderItemDTO[];
    couponCode?: string;
    discountAmount?: number;
  }
  