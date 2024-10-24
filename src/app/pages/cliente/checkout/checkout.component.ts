import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from '../../../models/cart-item.model';


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  total: number = 0;
  cart: CartItem[] = [];
  shippingCost: number = 0; 
  additionalCost: number = 3.00;

  constructor(private route: ActivatedRoute, 
    private router: Router
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
  
}
