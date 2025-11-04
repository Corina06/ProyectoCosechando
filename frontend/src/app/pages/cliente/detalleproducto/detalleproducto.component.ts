import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-detalleproducto',
  standalone: true,
  imports: [NavComponent, CommonModule, FormsModule],
  templateUrl: './detalleproducto.component.html'
})
export class DetalleproductoComponent implements OnInit{
  product: Product | null = null;
  quantity: number = 1;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.productService.currentProduct.subscribe(data => {
      console.log('Detalles del producto recibidos:', data); 
      this.product = data; // Obtiene el producto almacenado en el servicio
    });
  }

  increaseQuantity(): void {
    this.quantity++;
    console.log('Cantidad aumentada a:', this.quantity);
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
      console.log('Cantidad disminuida a:', this.quantity);
    }
  }

  validateQuantity(): void {
    // Asegurar que la cantidad esté entre 1 y 99
    if (this.quantity < 1) {
      this.quantity = 1;
    } else if (this.quantity > 99) {
      this.quantity = 99;
    }
    // Asegurar que sea un número entero
    this.quantity = Math.floor(this.quantity);
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity);
      this.showAddedToCartNotification(this.product.name);
    }
  }

  showAddedToCartNotification(productName: string): void {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <span>${productName} añadido al carrito</span>
    `;
    
    // Agregar al body
    document.body.appendChild(notification);
    
    // Mostrar con animación
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  }

  // Métodos para unidades de medida
  getUnitName(unit: string): string {
    const units: { [key: string]: string } = {
      'unidad': 'unidad',
      'libra': 'libra',
      'kilo': 'kilogramo',
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
