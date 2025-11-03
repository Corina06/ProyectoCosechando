import { Product } from './product.model';

export interface CartItem {
    product: Product;
    quantity: number;
    selectedUnit?: string; // Unidad seleccionada por el usuario en el carrito
  }