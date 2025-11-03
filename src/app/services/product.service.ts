// frontend/src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private API_URI = environment.apiUrl;
  
  // BehaviorSubject para manejar el producto actual
  private productSource = new BehaviorSubject<Product | null>(null);
  currentProduct = this.productSource.asObservable();

  constructor(private http: HttpClient) { }

  // Método para establecer el producto actual
  setProduct(product: Product): void {
    this.productSource.next(product);
  }

  // Obtener todos los productos
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URI}/products`);
  }

  // Obtener un producto por ID
  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.API_URI}/products/${id}`);
  }

  // Agregar producto
  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.API_URI}/products`, product);
  }

  // Actualizar producto
  updateProduct(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.API_URI}/products/${id}`, product);
  }

  // Eliminar producto
  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.API_URI}/products/${id}`);
  }

  // Obtener productos por usuario
  getProductsByUser(userId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URI}/products/user/${userId}`);
  }
}