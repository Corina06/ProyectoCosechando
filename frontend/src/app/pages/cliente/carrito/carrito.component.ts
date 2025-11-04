import {Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms'; 
import { CartService } from '../../../services/cart.service';
import { CartItem } from '../../../models/cart-item.model';

import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule, NavComponent],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  cart: CartItem[] = [];
  quantity: number = 1; // Inicializa el contador
  notificationMessage: string = '';

  constructor(private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCart();
  }

  ionViewWillEnter() {
    this.loadCart(); // Recargar cuando se entra a la página
  }

  loadCart() {
    this.cart = this.cartService.getCart();
    this.cart.forEach(item => {
      if (!item.quantity) {
        item.quantity = 1; 
      }
    });
    console.log('Carrito cargado:', this.cart);
    console.log('Número de productos en carrito:', this.cart.length);
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
    console.log('Cantidad incrementada:', item.quantity);
  }

  decrement(item: CartItem): void {
    if (item.quantity > 1) {
        item.quantity--;
        console.log('Cantidad decrementada:', item.quantity);
    }
  }

  //Totales
  total(): number {
    const totalValue = this.cart.reduce((sum, item) => {
      const itemTotal = item.product.price * item.quantity;
      console.log(`Producto: ${item.product.name}, Precio: ${item.product.price}, Cantidad: ${item.quantity}, Unidad: ${item.product.unit}, Total: ${itemTotal}`);
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

  // Métodos para unidades de medida
  getUnitName(unit: string): string {
    const units: { [key: string]: string } = {
      'unidad': 'unidad',
      'libra': 'libra',
      'kilo': 'kilo',
      'gramo': 'gramo',
      'onza': 'onza',
      'docena': 'docena',
      'paquete': 'paquete',
      'bolsa': 'bolsa',
      'caja': 'caja',
      'litro': 'litro',
      'galon': 'galón'
    };
    return units[unit] || unit || 'unidad';
  }

  getUnitAbbreviation(unit: string): string {
    const abbreviations: { [key: string]: string } = {
      'unidad': 'u',
      'libra': 'lb',
      'kilo': 'kg',
      'gramo': 'g',
      'onza': 'oz',
      'docena': 'doc',
      'paquete': 'paq',
      'bolsa': 'bolsa',
      'caja': 'caja',
      'litro': 'L',
      'galon': 'gal'
    };
    return abbreviations[unit] || unit || 'u';
  }


}
