import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavComponent } from '../nav/nav.component';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { SearchService } from '../../../services/search.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [NavComponent,CommonModule],
  templateUrl: './producto.component.html'
})

export class ProductoComponent implements OnInit{
  selectedFilter: string = 'Todos'
  searchTerm: string = '';
  searchExecuted: boolean = false;

  products: Product[] = []; // Inicializa el array de productos

  itemsPerPage: number = 8; // Número de productos por página
  currentPage: number = 1; // Página actual

  quantity: number = 1;

  get filteredProducts() {
    // Empezar con todos los productos
    let filtered = this.products;

    // Aplicar filtro por categoría
    if (this.selectedFilter !== 'Todos') {
      filtered = filtered.filter(product => product.category === this.selectedFilter);
    }

    // Aplicar filtro de búsqueda
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        (product.name || '').toLowerCase().includes(searchLower) ||
        (product.description || '').toLowerCase().includes(searchLower) ||
        (product.category || '').toLowerCase().includes(searchLower)
      );
    }

    return filtered;
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

  // Limpiar búsqueda
  clearSearch(): void {
    this.searchService.clearSearch();
  }

  // Verificar si debe mostrar información de búsqueda
  shouldShowSearchInfo(): boolean {
    return this.searchExecuted && this.searchTerm.trim() !== '';
  }

  constructor(private productService: ProductService, 
              private cartService: CartService,
              private searchService: SearchService,
              private router: Router) { } 

  ngOnInit(): void {
    this.loadProducts();

    // Suscribirse a cambios en el término de búsqueda
    this.searchService.searchTerm$.subscribe(term => {
      this.searchTerm = term;
      this.currentPage = 1; // Reiniciar a la primera página al buscar
    });

    // Suscribirse a cambios en el estado de búsqueda ejecutada
    this.searchService.searchExecuted$.subscribe(executed => {
      this.searchExecuted = executed;
    });

    console.log('ProductoComponent inicializado');
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data || [];
        console.log('Productos cargados:', this.products.length, this.products);
        if (this.products.length === 0) {
          console.warn('No se encontraron productos en la base de datos');
        }
      },
      error: (error: any) => {
        console.error('Error al cargar productos:', error);
        this.products = [];
        // Mostrar mensaje de error al usuario si es necesario
        if (error.status === 0) {
          console.error('No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.');
        }
      }
    });
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
    
    // Mostrar notificación sutil
    this.showAddedToCartNotification(product.name || 'Producto');
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

  // Método para manejar errores de carga de imágenes
  onImageError(event: any) {
    event.target.src = 'assets/images/placeholder.svg';
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
