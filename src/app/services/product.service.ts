import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

    //Agregar productos
    products: Product[] = [
      { id: 1, name: 'Fresa', category: 'Frutas', price: 30.00, image: 'fresa.jpg', description: 'Fresas frescas y jugosas, perfectas para postres y batidos.', location: 'Local A', CName: 'Comerciante 1',  Contact: '63900495', stock: true},
      { id: 2, name: 'Maíz', category: 'Legumbres', price: 20.00, image: 'maiz.jpg', description: 'Maíz dulce, ideal para ensaladas y asados.', location: 'Local B', CName: 'Comerciante 2',  Contact: '63990495', stock: true},
      { id: 3, name: 'Brócoli', category: 'Verduras', price: 25.00, image: 'brocoli.jpg', description: 'Brócoli fresco, lleno de nutrientes y vitaminas.', location: 'Local C', CName: 'Comerciante 3',  Contact: '63990490', stock: false },
      { id: 4, name: 'Yuca', category: 'Raíces', price: 15.00, image: 'yuca.jpg', description: 'Yuca tierna, excelente para hervir o freír.', location: 'Local A', CName: 'Comerciante 1',  Contact: '63900495', stock: true },
      { id: 5, name: 'Ají', category: 'Verduras', price: 10.00, image: 'aji.jpg', description: 'Ají picante, ideal para dar sabor a tus platos.', location: 'Local D', CName: 'Comerciante 4',  Contact: '60990490', stock: true },
      { id: 6, name: 'Manzana', category: 'Frutas', price: 12.00, image: 'manzana.jpg', description: 'Manzanas crujientes y dulces, perfectas para snacks.', location: 'Local E', CName: 'Comerciante 5',  Contact: '60995490', stock: true  },
      { id: 7, name: 'Guandú', category: 'Legumbres', price: 18.00, image: 'guandu.jpg', description: 'Guandú fresco, ideal para guisos y acompañamientos.', location: 'Local A', CName: 'Comerciante 1',  Contact: '63900495', stock: true },
      { id: 8, name: 'Guineo', category: 'Frutas', price: 22.00, image: 'banana1.jpg', description: 'Guineos amarillos y dulces, perfectos para desayunos.', location: 'Local B', CName: 'Comerciante 2',  Contact: '63990495', stock: false },
      { id: 9, name: 'Naranja', category: 'Frutas', price: 12.00, image: 'naranja.jpg', description: 'Naranjas jugosas, ricas en vitamina C.', location: 'Local C', CName: 'Comerciante 3',  Contact: '63990490', stock: true },
      { id: 10, name: 'Tomate', category: 'Verduras', price: 12.00, image: 'tomate.jpg', description: 'Tomates frescos, ideales para ensaladas y salsas.', location: 'Local D', CName: 'Comerciante 4',  Contact: '60990490', stock: true  },
      { id: 11, name: 'Papa', category: 'Raíces', price: 10.00, image: 'papa.jpg', description: 'Papas versátiles, perfectas para hervir, asar o freír.', location: 'Local A', CName: 'Comerciante 1',  Contact: '63900495', stock: true },
      { id: 12, name: 'Uvas', category: 'Frutas', price: 6.00, image: 'uvas.jpg', description: 'Uvas dulces, ideales para picar o hacer jugo.', location: 'Local C', CName: 'Comerciante 3',  Contact: '63990490', stock: true },
      { id: 13, name: 'Melocotón', category: 'Frutas', price: 2.00, image: 'melocoton.jpg', description: 'Melocotones jugosos, perfectos para postres y ensaladas.', location: 'Local B', CName: 'Comerciante 2',  Contact: '63990495', stock: true },
  ];

  private productSource = new BehaviorSubject<any>(null);
  currentProduct = this.productSource.asObservable();

  constructor() { }

  // Método para establecer el producto seleccionado
  setProduct(product: Product): void {
    console.log('Estableciendo producto:', product);
    this.productSource.next(product);
  }

  // Método para agregar un producto
  addProduct(product: Product): void {
    this.products.push(product);
    this.productSource.next(this.products); // Actualiza la lista de productos
  }

  // Devuelve la lista de productos
  getProducts(): Product[] {
    return this.products; 
  }
}
