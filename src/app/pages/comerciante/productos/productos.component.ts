import { Component, OnInit } from '@angular/core';
import { NavcomerComponent } from '../navcomer/navcomer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { PaginacionComponent } from '../../../componentes/paginacion/paginacion.component';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [NavcomerComponent, FormsModule, CommonModule,PaginacionComponent],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  totalProductos: number = 0;
  productosPaginados: Product[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;

  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  
  // Variables para edición de imagen
  editImagePreview: string | ArrayBuffer | null = null;
  editSelectedFile: File | null = null;

  sortDirection: { [key: string]: boolean } = {};
  searchTerm: string = '';
  selectedCategory: string = '';
  categorias: string[] = ['Frutas', 'Verduras', 'Legumbres', 'Raíces', 'Granos', 'Hierbas'];
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
    stock: true,
    quantity: 0,
    unit: ''
  };

  showDeleteModal = false;
  showEditModal = false;
  productToDelete: Product | null = null;
  editedProduct: Product = {} as Product;

  loading: boolean = false;
  error: string = '';
  success: string = '';

  constructor(
    private productService: ProductService,
    private authService: AuthService
  ) {
    // Inicializar datos del comerciante desde el localStorage o servicio
    this.initializeMerchantData();
  }

  private initializeMerchantData(): void {
    // Intentar obtener datos del usuario logueado
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.nuevoProducto.CName = `${user.name || ''} ${user.apellido || ''}`.trim();
        this.nuevoProducto.Contact = user.celular || '';
        this.nuevoProducto.location = user.local || user.puesto || '';
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';
    
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.error = 'Error al cargar productos';
        this.loading = false;
      }
    });
  }

  agregarProducto(): void {
    console.log('🔄 Agregando nuevo producto...');
    
    // Validar que se haya seleccionado una imagen
    if (!this.imagePreview || !this.nuevoProducto.image) {
      this.error = 'Por favor, selecciona una imagen para el producto';
      return;
    }

    this.loading = true;
    this.error = '';

    // Preparar datos del producto
    const productData = {
      ...this.nuevoProducto,
      id: Date.now(), // ID temporal basado en timestamp
      image: this.imagePreview as string, // Usar la imagen en Base64
      stock: (this.nuevoProducto.quantity || 0) > 0
    };

    console.log('📤 Datos del nuevo producto:', productData);

    this.productService.addProduct(productData).subscribe({
      next: (product) => {
        console.log('✅ Producto agregado exitosamente:', product);
        this.success = 'Producto agregado exitosamente';
        this.loadProducts();
        this.resetForm();
        this.mostrarFormulario = false;
        this.loading = false;
        
        // Limpiar mensaje de éxito después de 3 segundos
        setTimeout(() => this.success = '', 3000);
      },
      error: (error) => {
        console.error('❌ Error al agregar producto:', error);
        this.error = 'Error al agregar producto: ' + (error.error?.message || error.message || 'Error desconocido');
        this.loading = false;
      }
    });
  }

  resetForm(): void {
    // Mantener los datos del comerciante
    const userData = localStorage.getItem('userData');
    let merchantName = '';
    let merchantContact = '';
    let merchantLocation = '';
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        merchantName = `${user.name || ''} ${user.apellido || ''}`.trim();
        merchantContact = user.celular || '';
        merchantLocation = user.local || user.puesto || '';
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    this.nuevoProducto = {
      id: 0,
      name: '',
      category: '',
      price: 0,
      image: '',
      description: '',
      location: merchantLocation,
      CName: merchantName,
      Contact: merchantContact,
      stock: true,
      quantity: 0,
      unit: ''
    };
    this.imagePreview = null;
    this.selectedFile = null;
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesTerm = !this.searchTerm || 
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = !this.selectedCategory || 
        product.category === this.selectedCategory;
      
      return matchesTerm && matchesCategory;
    });
    
    this.totalProductos = this.filteredProducts.length;
    this.currentPage = 1; // Reset to first page when filtering
    this.updatePaginatedProducts();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onCategoryChange(): void {
    this.applyFilters();
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


  updatePaginatedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.productosPaginados = this.filteredProducts.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedProducts();
  }

  // Métodos para modal de eliminación
  openDeleteModal(product: Product): void {
    this.productToDelete = product;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.productToDelete = null;
  }

  deleteProduct(): void {
    if (!this.productToDelete || !this.productToDelete.id) {
      this.error = 'Error: Producto no válido para eliminar';
      return;
    }

    this.loading = true;
    this.productService.deleteProduct(this.productToDelete.id!.toString()).subscribe({
      next: () => {
        this.success = 'Producto eliminado exitosamente';
        this.loadProducts();
        this.closeDeleteModal();
        this.loading = false;
        
        setTimeout(() => this.success = '', 3000);
      },
      error: (error) => {
        console.error('Error deleting product:', error);
        this.error = 'Error al eliminar producto';
        this.loading = false;
      }
    });
  }

  // Métodos para modal de edición
  openEditModal(product: Product): void {
    this.editedProduct = { ...product };
    
    // Asegurar que todos los campos tengan valores por defecto
    if (!this.editedProduct.unit) {
      this.editedProduct.unit = 'unidad'; // Valor por defecto
    }
    if (!this.editedProduct.quantity) {
      this.editedProduct.quantity = 0;
    }
    
    this.editImagePreview = null;
    this.editSelectedFile = null;
    this.showEditModal = true;
    
    console.log('📝 Abriendo modal de edición para:', this.editedProduct);
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editedProduct = {} as Product;
    this.editImagePreview = null;
    this.editSelectedFile = null;
  }

  saveChanges(): void {
    console.log('🔄 Ejecutando saveChanges...');
    
    if (!this.editedProduct.id) {
      console.log('❌ Error: ID de producto no válido');
      this.error = 'Error: ID de producto no válido';
      return;
    }

    console.log('📤 Enviando datos actualizados:', this.editedProduct);

    this.loading = true;
    
    this.productService.updateProduct(this.editedProduct.id!.toString(), this.editedProduct).subscribe({
      next: () => {
        console.log('✅ Producto actualizado exitosamente');
        this.success = 'Producto actualizado exitosamente';
        this.loadProducts();
        this.closeEditModal();
        this.loading = false;
        
        setTimeout(() => this.success = '', 3000);
      },
      error: (error) => {
        console.error('❌ Error updating product:', error);
        this.error = 'Error al actualizar producto: ' + (error.error?.message || error.message || 'Error desconocido');
        this.loading = false;
      }
    });
  }

  // Método para debuggear el click del botón de edición
  onEditSubmitClick(event: Event): void {
    console.log('🖱️ Botón "Guardar Cambios" clickeado');
    console.log('📋 Estado del formulario:', {
      valid: (event.target as any).form?.checkValidity(),
      editedProduct: this.editedProduct
    });
  }

  // Método directo para guardar cambios sin depender del ngSubmit
  saveChangesDirectly(): void {
    console.log('📝 Guardando cambios del producto:', this.editedProduct);

    // Limpiar errores previos
    this.error = '';

    // Validar manualmente los campos requeridos
    if (!this.editedProduct.name || this.editedProduct.name.trim().length < 2) {
      this.error = 'El nombre del producto es requerido (mínimo 2 caracteres)';
      return;
    }

    if (!this.editedProduct.description || this.editedProduct.description.trim().length < 10) {
      this.error = 'La descripción es requerida (mínimo 10 caracteres)';
      return;
    }

    if (!this.editedProduct.price || this.editedProduct.price <= 0) {
      this.error = 'El precio debe ser mayor a 0';
      return;
    }

    if (this.editedProduct.quantity === undefined || this.editedProduct.quantity < 0) {
      this.error = 'La cantidad no puede ser negativa';
      return;
    }

    if (!this.editedProduct.category) {
      this.error = 'La categoría es requerida';
      return;
    }

    if (!this.editedProduct.unit) {
      this.editedProduct.unit = 'unidad'; // Valor por defecto
    }

    // IMPORTANTE: NO incluir imagen si no hay una nueva
    // Solo actualizar imagen si se seleccionó una nueva
    if (this.editImagePreview) {
      console.log('🖼️ Actualizando con nueva imagen');
      this.editedProduct.image = this.editImagePreview as string;
    } else {
      console.log('📝 Actualizando solo texto, manteniendo imagen actual');
      // NO modificar this.editedProduct.image para mantener la imagen actual
    }

    // Actualizar el estado de stock basado en la cantidad
    this.editedProduct.stock = (this.editedProduct.quantity || 0) > 0;

    // Crear una copia de los datos
    let dataToSend: any;
    
    // Si no hay nueva imagen y la imagen existente es muy grande, crear payload sin imagen
    if (!this.editImagePreview && this.editedProduct.image && this.editedProduct.image.length > 100000) {
      // Crear objeto sin la propiedad image
      const { image, ...productWithoutImage } = this.editedProduct;
      dataToSend = productWithoutImage;
    } else {
      // Usar todos los datos incluyendo la imagen
      dataToSend = { ...this.editedProduct };
    }

    // Llamar directamente al servicio
    this.updateProductDirectly(dataToSend);
  }

  // Método para actualizar producto directamente
  updateProductDirectly(productData: any): void {
    if (!productData.id) {
      this.error = 'Error: ID de producto no válido';
      return;
    }

    this.loading = true;
    
    this.productService.updateProduct(productData.id.toString(), productData).subscribe({
      next: (response) => {
        console.log('✅ Producto actualizado exitosamente:', response);
        this.success = 'Producto actualizado exitosamente';
        this.loadProducts();
        this.closeEditModal();
        this.loading = false;
        
        setTimeout(() => this.success = '', 3000);
      },
      error: (error) => {
        console.error('❌ Error updating product:', error);
        
        // Manejar diferentes tipos de errores
        if (error.status === 413) {
          this.error = 'La imagen es demasiado grande. Intenta con una imagen más pequeña.';
        } else if (error.status === 0) {
          this.error = 'Error de conexión. Verifica que el servidor esté funcionando.';
        } else {
          this.error = 'Error al actualizar producto: ' + (error.error?.message || error.message || 'Error desconocido');
        }
        
        this.loading = false;
      }
    });
  }

  // Método de prueba para verificar que los clicks funcionan
  testButtonClick(): void {
    console.log('🧪 Botón de prueba clickeado');
    console.log('📝 Producto editado:', this.editedProduct);
    alert('¡El botón funciona! Revisa la consola para más detalles.');
  }

  // Método para manejar errores de carga de imágenes
  onImageError(event: any) {
    console.log('Error loading image:', event.target.src);
    // Crear una imagen placeholder con CSS
    event.target.style.display = 'none';
    const placeholder = event.target.parentElement.querySelector('.image-placeholder');
    if (!placeholder) {
      const div = document.createElement('div');
      div.className = 'image-placeholder';
      div.innerHTML = '<i class="fas fa-image fa-2x text-muted"></i>';
      div.style.cssText = `
        width: 50px; 
        height: 50px; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        background-color: #f8f9fa; 
        border: 1px solid #ddd; 
        border-radius: 8px;
      `;
      event.target.parentElement.appendChild(div);
    }
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

  // Método para validar si una imagen es Base64 válida
  isValidBase64Image(str: string): boolean {
    if (!str) return false;
    return str.startsWith('data:image/') && str.includes('base64,');
  }

  // Método para obtener una imagen placeholder
  getPlaceholderImage(): string {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjRjhGOUZBIiBzdHJva2U9IiNEREQiLz4KPHN2ZyB4PSIxNSIgeT0iMTUiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzZDNzU3RCI+CjxwYXRoIGQ9Ik0xMCAyQzUuNTggMiAyIDUuNTggMiAxMFMxNC40MiAxOCAxOCAxOFMxOCAxNC40MiAxOCAxMFMxNC40MiAyIDEwIDJaTTEwIDRDMTMuMzEgNCAxNiA2LjY5IDE2IDEwUzEzLjMxIDE2IDEwIDE2UzQgMTMuMzEgNCAxMFM2LjY5IDQgMTAgNFoiLz4KPC9zdmc+Cjwvc3ZnPgo=';
  }

  // Método para manejar selección de imagen para nuevo producto
  onImageSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];

      // Validar tipo y tamaño de archivo
      if (!file.type.startsWith('image/')) {
        this.error = 'Por favor, selecciona un archivo de imagen válido (JPG, PNG, GIF)';
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB máximo (aumentado)
        this.error = 'La imagen no puede ser mayor a 5MB';
        return;
      }

      this.selectedFile = file;
      
      // Comprimir y convertir imagen a Base64
      this.compressAndConvertImage(file, (base64String) => {
        this.imagePreview = base64String;
        this.nuevoProducto.image = base64String;
        this.error = '';
        console.log('✅ Imagen cargada y comprimida correctamente para nuevo producto');
      });
    }
  }

  // Método para manejar selección de imagen en edición
  onEditImageSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];

      // Validar tipo y tamaño de archivo
      if (!file.type.startsWith('image/')) {
        this.error = 'Por favor, selecciona un archivo de imagen válido (JPG, PNG, GIF)';
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB máximo (aumentado)
        this.error = 'La imagen no puede ser mayor a 5MB';
        return;
      }

      this.editSelectedFile = file;
      
      // Comprimir y convertir imagen a Base64
      this.compressAndConvertImage(file, (base64String) => {
        this.editImagePreview = base64String;
        this.error = '';
        console.log('✅ Nueva imagen cargada y comprimida para edición');
      });
    }
  }

  // Método para comprimir y convertir imagen a Base64
  compressAndConvertImage(file: File, callback: (base64: string) => void): void {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calcular nuevas dimensiones manteniendo la proporción
      const maxWidth = 800;
      const maxHeight = 600;
      let { width, height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      // Configurar canvas
      canvas.width = width;
      canvas.height = height;

      // Dibujar imagen redimensionada
      ctx?.drawImage(img, 0, 0, width, height);

      // Convertir a Base64 con compresión
      const base64String = canvas.toDataURL('image/jpeg', 0.8); // 80% calidad
      callback(base64String);
    };

    img.onerror = () => {
      this.error = 'Error al procesar la imagen';
      console.error('❌ Error al cargar la imagen para compresión');
    };

    // Cargar imagen
    img.src = URL.createObjectURL(file);
  }
  
}
