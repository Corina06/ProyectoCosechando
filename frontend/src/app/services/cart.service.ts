import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product} from '../models/product.model';
import { CartItem } from '../models/cart-item.model'

@Injectable({
  providedIn: 'root'
})

export class CartService {

  private cart: CartItem[] = []; // Cambiar a CartItem[]
  private cartItemCount = new BehaviorSubject<number>(0);
  public cartItemCount$ = this.cartItemCount.asObservable();

  constructor() { 
    // Cargar carrito desde localStorage al inicializar
    this.loadCartFromStorage();
  }

  addToCart(product: Product, quantity: number): void {
    const existingItem = this.cart.find(item => item.product.name === product.name);
    if (existingItem) {
      existingItem.quantity += quantity; 
    } else {
      this.cart.push({ 
        product, 
        quantity,
        selectedUnit: product.unit || 'unidad' // Inicializar con la unidad del producto
      }); 
    }
    this.updateCartCount();
    this.saveCartToStorage(); // Guardar en localStorage
    console.log('Contenido del carrito:', this.cart); 
  }

  getCart(): CartItem[] {
    console.log('getCart llamado. Contenido actual:', this.cart);
    return this.cart;
  }

  clearCart(): void {
    this.cart = [];
    this.updateCartCount();
    this.saveCartToStorage(); // Guardar en localStorage
  }

  removeFromCart(item: CartItem): void {
    this.cart = this.cart.filter(cartItem => cartItem.product.name !== item.product.name);
    this.updateCartCount();
    this.saveCartToStorage(); // Guardar en localStorage
  }

  updateCartItem(updatedItem: CartItem): void {
    const index = this.cart.findIndex(item => item.product.name === updatedItem.product.name);
    if (index !== -1) {
      this.cart[index] = updatedItem;
      this.saveCartToStorage(); // Guardar en localStorage
      console.log('Item del carrito actualizado:', updatedItem);
    }
  }

  getTotal(): number {
    return this.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  private updateCartCount(): void {
    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    this.cartItemCount.next(totalItems);
  }

  getCartItemCount(): number {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  // Guardar carrito en localStorage
  private saveCartToStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  // Cargar carrito desde localStorage
  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
      this.updateCartCount();
      console.log('Carrito cargado desde localStorage:', this.cart);
    }
  }

}
