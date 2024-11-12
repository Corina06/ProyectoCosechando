import { Component, OnInit } from '@angular/core';
import { NavcomerComponent } from '../navcomer/navcomer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { PaginacionComponent } from '../../../componentes/paginacion/paginacion.component';


@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [NavcomerComponent, FormsModule, CommonModule,PaginacionComponent],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit {
  products: Product[] = [];
  totalProductos: number = 0;
  productosPaginados: Product[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;


  imagePreview: string | ArrayBuffer | null = null; // Para la vista previa

  sortDirection: { [key: string]: boolean } = {};
  searchTerm: string = '';
  selectedCategory: string = '';
  categorias: string[] = ['Frutas', 'Verduras', 'Legumbres', 'Raíces']; // Ejemplo de categorías
  mostrarFormulario: boolean = false;
  nuevoProducto: Product = {
    id: 0,
    name: '',
    category: '',
    price: 0,
    image: '',
    description: '',
    location: '',
    CName: '',
    Contact: '',
    stock: true
  };

  showDeleteModal = false; // Estado del modal de eliminación
  showEditModal = false; // Estado del modal de edición
  productToDelete: any; // Producto seleccionado para eliminar
  editedProduct: any = {}; // Producto a editar

  constructor(private productService: ProductService) {
    this.products = this.productService.getProducts();
    this.updatePaginatedProducts();
  }

  ngOnInit(): void {
    this.loadProducts();
    this.totalProductos = this.products.length;
  }

  loadProducts(): void {
    this.products = this.productService.getProducts();
  }

  agregarProducto(): void {
    this.nuevoProducto.id = this.products.length + 1;
    this.productService.addProduct(this.nuevoProducto);
    this.loadProducts(); // Recargar lista de productos
    this.imagePreview = null;

    // Reiniciar el formulario
    this.nuevoProducto = {
      id: 0,
      name: '',
      category: '',
      price: 0,
      image: '',
      description: '',
      location: '',
      CName: '',
      Contact: '',
      stock: true
    };
  }

  

  filterProducts(): Product[] {
    return this.products.filter(product => {
      const matchesTerm = product.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.selectedCategory ? product.category === this.selectedCategory : true;
      return matchesTerm && matchesCategory;
    }
      //product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      //(this.selectedCategory ? product.category === this.selectedCategory : true)
    );
  }

  getTotalProducts(): number {
    return this.products.length;
  }

  getAvailableProducts(): number {
    return this.products.filter(product => product.stock).length;
  }

  getOutOfStockProducts(): number {
    return this.products.filter(product => !product.stock).length;
  }
 
  onImageSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];

      // Validar tipo de archivo
      if (file.type.startsWith('image/')) {
        this.nuevoProducto.image = file.name; // Solo almacena el nombre del archivo

        // Crear una vista previa de la imagen
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result; // Guarda la vista previa
        };
        reader.readAsDataURL(file);
      } else {
        alert('Por favor, selecciona un archivo de imagen.');
      }
    }
  }

  updatePaginatedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.productosPaginados = this.products.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedProducts();
  }

  // Método para abrir el modal de eliminación
  openDeleteModal(product: any) {
    this.productToDelete = product;
    this.showDeleteModal = true;
  }

  // Método para cerrar el modal de eliminación
  closeDeleteModal() {
    this.showDeleteModal = false;
  }

  // Método para confirmar la eliminación
  deleteProduct() {
    if (this.productToDelete) {
      // Aquí debes realizar la lógica para eliminar el producto
      const index = this.productosPaginados.indexOf(this.productToDelete);
      if (index !== -1) {
        this.productosPaginados.splice(index, 1); // Eliminar producto de la lista
        this.showDeleteModal = false; // Cerrar modal
      }
    }
  }

  // Método para abrir el modal de edición
  openEditModal(product: any) {
    this.editedProduct = { ...product }; // Crear una copia del producto
    this.showEditModal = true;
  }

  // Método para cerrar el modal de edición
  closeEditModal() {
    this.showEditModal = false;
  }

  // Método para guardar los cambios
  saveChanges() {
    // Aquí puedes realizar la lógica para actualizar el producto
    const index = this.productosPaginados.findIndex(p => p.id === this.editedProduct.id);
    if (index !== -1) {
      this.productosPaginados[index] = { ...this.editedProduct }; // Actualizar producto
      this.showEditModal = false; // Cerrar modal
    }
  }
  
}
