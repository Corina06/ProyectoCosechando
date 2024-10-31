import { Injectable } from '@angular/core';

import { loadStripe } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor() { }

  private stripePromise = loadStripe('TU_PUBLIC_KEY_DE_STRIPE');

  async pay(amount: number) {
    const stripe = await this.stripePromise;
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    const { clientSecret } = await response.json();

    const result = await stripe!.confirmCardPayment(clientSecret);
    return result;
  }
}
