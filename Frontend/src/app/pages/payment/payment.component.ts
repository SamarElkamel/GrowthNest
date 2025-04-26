import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Stripe, StripeElements, StripeCardNumberElement, StripeCardExpiryElement, StripeCardCvcElement } from '@stripe/stripe-js';
import { PaymentService } from 'src/app/services/services/payment.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit, AfterViewInit {
  stripe!: Stripe | null;
  elements!: StripeElements;
  cardNumber!: StripeCardNumberElement;
  cardExpiry!: StripeCardExpiryElement;
  cardCvc!: StripeCardCvcElement;
  clientSecret!: string;
  loading = false;
  paymentSuccess = false;

  userId: number = 0;
  cartId: number = 0;
  amount: number = 0;
  deliveryAddress: string = '';

  constructor(
    private stripeService: PaymentService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userId = +params['userId'];
      this.cartId = +params['cartId'];
      this.amount = +params['amount'];
      this.deliveryAddress = params['deliveryAddress'] || '';
    });
  }

  async ngAfterViewInit() {
    this.stripe = await this.stripeService.getStripe();
    if (!this.stripe) return;

    this.elements = this.stripe.elements();

    this.cardNumber = this.elements.create('cardNumber');
    this.cardNumber.mount('#card-number');

    this.cardExpiry = this.elements.create('cardExpiry');
    this.cardExpiry.mount('#card-expiry');

    this.cardCvc = this.elements.create('cardCvc');
    this.cardCvc.mount('#card-cvc');

    // Fetch clientSecret from your backend
    const res: any = await this.http.post('http://localhost:8080/Growthnest/api/payment/create-intent', {
      amount: this.amount,
      userId: this.userId,
      cartId: this.cartId
    }).toPromise();

    this.clientSecret = res.clientSecret;
  }

  async handlePayment() {
    if (!this.stripe || !this.clientSecret) return;

    this.loading = true;
    const result = await this.stripe.confirmCardPayment(this.clientSecret, {
      payment_method: {
        card: this.cardNumber
      }
    });

    this.loading = false;

    if (result.paymentIntent?.status === 'succeeded') {
      this.paymentSuccess = true;

      // Notify backend to confirm order
      this.http.post('http://localhost:8080/Growthnest/api/payment/confirm-order', {
        userId: this.userId,
        cartId: this.cartId,
        paymentMethod: 'Stripe',
        deliveryAddress: this.deliveryAddress
      }).subscribe({
        next: () => {
          this.router.navigate(['/thank-you']);
        },
        error: err => {
          console.error('Order confirmation failed:', err);
          alert('Payment succeeded but order confirmation failed. Please contact support.');
        }
      });
    } else {
      alert(result.error?.message || 'Payment failed');
    }
  }
}
