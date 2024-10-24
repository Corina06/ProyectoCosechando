import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

    //Agregar productos
    products: Product[] = [
      { name: 'Fresa', category: 'Frutas', price: 30.00, image: 'fresa.jpg', description: 'Fresas frescas y jugosas, perfectas para postres y batidos.', location: 'Local A', CName: 'Comerciante 1',  Contact: '63900495'},
      { name: 'Maíz', category: 'Legumbres', price: 20.00, image: 'maiz.jpg', description: 'Maíz dulce, ideal para ensaladas y asados.', location: 'Local B', CName: 'Comerciante 2',  Contact: '63990495'},
      { name: 'Brócoli', category: 'Verduras', price: 25.00, image: 'brocoli.jpg', description: 'Brócoli fresco, lleno de nutrientes y vitaminas.', location: 'Local C', CName: 'Comerciante 3',  Contact: '63990490' },
      { name: 'Yuca', category: 'Raíces', price: 15.00, image: 'yuca.jpg', description: 'Yuca tierna, excelente para hervir o freír.', location: 'Local A', CName: 'Comerciante 1',  Contact: '63900495' },
      { name: 'Ají', category: 'Verduras', price: 10.00, image: 'aji.jpg', description: 'Ají picante, ideal para dar sabor a tus platos.', location: 'Local D', CName: 'Comerciante 4',  Contact: '60990490' },
      { name: 'Manzana', category: 'Frutas', price: 12.00, image: 'manzana.jpg', description: 'Manzanas crujientes y dulces, perfectas para snacks.', location: 'Local E', CName: 'Comerciante 5',  Contact: '60995490'  },
      { name: 'Guandú', category: 'Legumbres', price: 18.00, image: 'guandu.jpg', description: 'Guandú fresco, ideal para guisos y acompañamientos.', location: 'Local A', CName: 'Comerciante 1',  Contact: '63900495' },
      { name: 'Guineo', category: 'Frutas', price: 22.00, image: 'banana1.jpg', description: 'Guineos amarillos y dulces, perfectos para desayunos.', location: 'Local B', CName: 'Comerciante 2',  Contact: '63990495' },
      { name: 'Naranja', category: 'Frutas', price: 12.00, image: 'naranja.jpg', description: 'Naranjas jugosas, ricas en vitamina C.', location: 'Local C', CName: 'Comerciante 3',  Contact: '63990490' },
      { name: 'Tomate', category: 'Verduras', price: 12.00, image: 'tomate.jpg', description: 'Tomates frescos, ideales para ensaladas y salsas.', location: 'Local D', CName: 'Comerciante 4',  Contact: '60990490'  },
      { name: 'Papa', category: 'Raíces', price: 10.00, image: 'papa.jpg', description: 'Papas versátiles, perfectas para hervir, asar o freír.', location: 'Local A', CName: 'Comerciante 1',  Contact: '63900495' },
      { name: 'Uvas', category: 'Frutas', price: 6.00, image: 'uvas.jpg', description: 'Uvas dulces, ideales para picar o hacer jugo.', location: 'Local C', CName: 'Comerciante 3',  Contact: '63990490' },
      { name: 'Melocotón', category: 'Frutas', price: 2.00, image: 'melocoton.jpg', description: 'Melocotones jugosos, perfectos para postres y ensaladas.', location: 'Local B', CName: 'Comerciante 2',  Contact: '63990495' },
  ];

  private productSource = new BehaviorSubject<any>(null);
  currentProduct = this.productSource.asObservable();

  constructor() { }

  // Método para establecer el producto seleccionado
  setProduct(product: Product): void {
    console.log('Estableciendo producto:', product);
    this.productSource.next(product);
  }

  // Devuelve la lista de productos
  getProducts(): Product[] {
    return this.products; 
  }
}
