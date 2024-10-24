import {Component, OnInit } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms'; 
import { CartService } from '../../../services/cart.service';
import { CartItem } from '../../../models/cart-item.model';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [NavComponent, CommonModule, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent {
  cart: CartItem[] = [];
  quantity: number = 1; // Inicializa el contador

  constructor(private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cart = this.cartService.getCart();
    this.cart.forEach(item => {
      if (!item.quantity) {
        item.quantity = 1; 
      }
    });
    console.log('Contenido del carrito en CarritoComponent:', this.cart);
}



  clearCart(): void {
    this.cartService.clearCart();
    this.cart = [];
  }

  removeFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item);
    this.cart = this.cartService.getCart(); // Actualiza el carrito visual
  }
  
  //Volver a la lista de productos
  goToProducts(): void {
    this.router.navigate(['/producto']); 
  }

  //Cantidad
  increment(item: CartItem): void {
    console.log('Antes de incrementar:', item);
    item.quantity++;
    console.log('Después de incrementar:', item);
  }

  decrement(item: CartItem): void {
    console.log('Antes de decrementar:', item);
    if (item.quantity > 1) {
        item.quantity--;
    }
    console.log('Después de decrementar:', item);
    
  }

  //Totales
  total(): number {
    const totalValue = this.cart.reduce((sum, item) => {
      const itemTotal = item.product.price * item.quantity;
      console.log(`Producto: ${item.product.name}, Precio: ${item.product.price}, Cantidad: ${item.quantity}, Total: ${itemTotal}`);
      return sum + itemTotal;
    }, 0);
    
    console.log('Total calculado:', totalValue);
    return totalValue;
  }
}
