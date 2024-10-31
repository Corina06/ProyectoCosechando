import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from '../../../models/cart-item.model';
import { PaymentService } from '../../../services/payment.service';

declare global {
  interface Window {
    paypal: any;
  }
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
  template: `<div id="paypal-button-container"></div>`,
})

export class CheckoutComponent implements AfterViewInit {
  total: number = 0;
  cart: CartItem[] = [];
  shippingCost: number = 0; 
  additionalCost: number = 3.00;

  constructor(private route: ActivatedRoute, 
    private router: Router,
    private paymentService: PaymentService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.total = +params['total']; // Total de la compra
      this.cart = JSON.parse(params['cart']); // Convertir JSON a objeto
    });
  }

  onShippingChange(event: any): void {
    if (event.target.value === 'delivery') {
      this.shippingCost = this.additionalCost; // Agregar costo adicional
    } else {
      this.shippingCost = 0; // Sin costo adicional
    }
    this.updateTotal(); // Actualiza el total
  }

  updateTotal(): void {
    this.total = this.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0) + this.shippingCost;
  }

  navigateToInicio() {
    console.log('Navegando a inicio');
    this.router.navigate(['/inicio']);
  }

  //Pago
  ngAfterViewInit() {
    this.loadPayPalButton();
  }

  loadPayPalButton() {
    (window as any).paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: this.total.toFixed(2) 
            }
          }]
        });
      },
      onApprove: (data:any , actions: any) => {
        return actions.order.capture().then((details: any) => {
          console.log('Pago exitoso:', details);
          // Aquí puedes manejar lo que ocurre después del pago
          alert(`Pago completado exitosamente. ID de la transacción: ${details.id}`);

          // Redirige a la página de inicio
          this.router.navigate(['/inicio']);
        });
      },
      onError: (err: any) => {
        console.error('Error en el pago:', err);
        alert('Ocurrió un error al procesar el pago. Por favor, inténtalo de nuevo.');
      }
    }).render('#paypal-button-container');
  }
  
}
