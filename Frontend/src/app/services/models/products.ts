/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { Business } from '../models/business';
export interface Products {
  business?: Business;
  description: string;
  idProduct: number;
  image?: string;
  name: string;
  price?: number;
  stock: number;
  
}
export interface Wishlist {
  id: number;
  userId: number;
  productId: number;
  productName: string;
  productDescription: string;
  productPrice: number;
  productImage?: string;
}
export interface StockMovement {
  id: number;
  product: Products;
  quantity: number;
  movementType: 'ADD' | 'REDUCE';
  timestamp: string;
}