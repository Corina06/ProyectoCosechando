import { Component, OnInit } from '@angular/core';
import { NavcomerComponent } from '../navcomer/navcomer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';


@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [NavcomerComponent, FormsModule, CommonModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit {
  products: Product[] = [];
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

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
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
    return this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (this.selectedCategory ? product.category === this.selectedCategory : true)
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
}
