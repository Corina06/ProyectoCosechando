import {Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms'; 
import { CartService } from '../../../services/cart.service';
import { CartItem } from '../../../models/cart-item.model';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent {
  cart: CartItem[] = [];
  quantity: number = 1; // Inicializa el contador
  notificationMessage: string = '';

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
    
}

  clearCart(): void {
    this.cartService.clearCart();
    this.cart = [];
  }

  removeFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item);
    this.cart = this.cartService.getCart(); // Actualiza el carrito visual
    this.notificationMessage = `${item.product.name} ha sido eliminado del carrito.`;
    setTimeout(() => this.notificationMessage = '', 3000); // Limpia el mensaje después de 3 segundos
  }
  
  //Volver a la lista de productos
  goToProducts(): void {
    this.router.navigate(['/producto']); 
  }

  //Cantidad
  increment(item: CartItem): void {
    item.quantity++;
  }

  decrement(item: CartItem): void {
    if (item.quantity > 1) {
        item.quantity--;
    }
    
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

  //Checkout
  goToCheckout(): void {
    const total = this.total(); // Llama al método total()
    this.router.navigate(['/checkout'], { queryParams: { total, cart: JSON.stringify(this.cart) } });
  }
  
  navigateToInicio() {
    console.log('Navegando a inicio');
    this.router.navigate(['/inicio']);
  }
}
