import { Injectable } from '@angular/core';
import { Product} from '../models/product.model';
import { CartItem } from '../models/cart-item.model'

@Injectable({
  providedIn: 'root'
})

export class CartService {

  private cart: CartItem[] = []; // Cambiar a CartItem[]

  constructor() { }

  addToCart(product: Product, quantity: number): void {
    const existingItem = this.cart.find(item => item.product.name === product.name);
    if (existingItem) {
      existingItem.quantity += quantity; 
    } else {
      this.cart.push({ product, quantity}); 
    }
    console.log('Contenido del carrito:', this.cart); 
  }

  getCart(): CartItem[] {
    console.log('getCart llamado. Contenido actual:', this.cart);
    return this.cart;
  }

  clearCart(): void {
    this.cart = [];
  }

  removeFromCart(item: CartItem): void {
    this.cart = this.cart.filter(cartItem => cartItem.product.name !== item.product.name);
  }

  getTotal(): number {
    return this.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

}
