import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavComponent } from '../nav/nav.component';
import { FilterPipe } from '../../../componentes/filter.pipe';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [NavComponent,CommonModule, FilterPipe],
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})

export class ProductoComponent implements OnInit{
  selectedFilter: string = 'Todos'

  products: Product[] = []; // Inicializa el array de productos

  itemsPerPage: number = 8; // Número de productos por página
  currentPage: number = 1; // Página actual

  quantity: number = 1;

  get filteredProducts() {
    return this.selectedFilter === 'Todos' 
     ? this.products
     : this.products.filter(product => product.category === this.selectedFilter);
  }

  get paginatedProducts() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(start, start + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

   // Filtro
   setFilter(filter: string) {
    this.selectedFilter = filter;
    this.currentPage = 1; // Reiniciar a la primera página al cambiar el filtro
  }

  constructor(private productService: ProductService, 
              private cartService: CartService,
              private router: Router) { } 

  ngOnInit(): void {
    this.products = this.productService.getProducts(); 
    console.log('ProductoComponent inicializado'); // Para verificar que el componente se carga
  }

  //Detalle del producto
  viewDetails(product: Product): void {
    this.productService.setProduct(product);
    this.router.navigate(['/detalleproducto']);
  }

  //Añadir producto
  addToCart(product: Product): void {
    console.log('Intentando añadir al carrito:', product);
    this.cartService.addToCart(product, this.quantity);
    this.router.navigate(['/carrito']);

 }

  
}
