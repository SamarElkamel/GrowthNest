import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private stripePromise = loadStripe('pk_test_51RDRnbQ6caEr3vkSH46hglCg55uQyT3XtrcvpjmjJKJnxHiiCRNlRYQWT1nzvtf62Z67PsrAqjC5Fzi0NtCBNi2J00pJSnlyd6'); 
  getStripe(): Promise<Stripe | null> {
    return this.stripePromise;
  }
}
