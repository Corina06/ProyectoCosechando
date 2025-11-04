import { Component, OnInit } from '@angular/core';
import { NavcomerComponent } from '../navcomer/navcomer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { PaginacionComponent } from '../../../componentes/paginacion/paginacion.component';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';


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
    purchasePrice: 0,
    image: '',
    description: '',
    location: '',
    CName: '',
    Contact: '',
    stock: true,
    quantity: 0,
    unit: '',
    minStock: 5
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
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    // Inicializar datos del comerciante desde el localStorage o servicio
    this.initializeMerchantData();
  }

  private initializeMerchantData(): void {
    // Intentar obtener datos del usuario logueado
    let userData = localStorage.getItem('userData');
    
    // Si no existe 'userData', intentar con 'user'
    if (!userData) {
      userData = localStorage.getItem('user');
    }
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log('👤 Inicializando datos del comerciante:', user);
        
        // Construir nombre completo
        const nombreCompleto = `${user.name || ''} ${user.apellido || ''}`.trim();
        this.nuevoProducto.CName = nombreCompleto || 'Comerciante';
        
        // Obtener contacto (celular del registro)
        this.nuevoProducto.Contact = user.celular || user.contact || user.phone || '';
        
        // Obtener local (puede ser local o puesto del registro)
        this.nuevoProducto.location = user.local || user.puesto || user.location || 'Mi Local';
        
        console.log('📋 Datos inicializados:', {
          nombre: this.nuevoProducto.CName,
          contacto: this.nuevoProducto.Contact,
          local: this.nuevoProducto.location
        });
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
    
    // Obtener el contacto del usuario actual para filtrar sus productos
    let userData = localStorage.getItem('userData');
    
    // Si no existe 'userData', intentar con 'user' (formato del servicio de auth)
    if (!userData) {
      userData = localStorage.getItem('user');
    }
    
    if (!userData) {
      this.error = 'No se encontraron datos del usuario. Por favor, inicia sesión nuevamente.';
      this.loading = false;
      return;
    }

    try {
      const user = JSON.parse(userData);
      console.log('👤 Datos del usuario encontrados:', user);
      
      // Intentar obtener el contacto de diferentes campos posibles
      const userContact = user.celular || user.contact || user.phone;
      
      if (!userContact) {
        console.log('⚠️ Usuario sin contacto, mostrando lista vacía');
        this.products = [];
        this.applyFilters();
        this.loading = false;
        return;
      }

      console.log('🔍 Cargando productos para usuario con contacto:', userContact);
      
      this.productService.getProductsByUser(userContact).subscribe({
        next: (products) => {
          console.log(`📦 Productos cargados para el usuario: ${products.length}`);
          console.log(`📦 ${products.length} productos cargados exitosamente`);
          
          this.products = products;
          this.applyFilters();
          this.checkStockAlerts();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading user products:', error);
          this.error = 'Error al cargar tus productos';
          this.loading = false;
        }
      });
    } catch (error) {
      console.error('Error parsing user data:', error);
      this.error = 'Error al obtener datos del usuario';
      this.loading = false;
    }
  }

  agregarProducto(): void {
    console.log('🔄 Agregando nuevo producto...');
    
    this.error = '';

    // Validaciones básicas
    if (!this.nuevoProducto.name?.trim()) {
      this.error = 'El nombre del producto es requerido';
      return;
    }

    if (!this.nuevoProducto.description?.trim()) {
      this.error = 'La descripción del producto es requerida';
      return;
    }

    if (this.nuevoProducto.description.trim().length < 3) {
      this.error = 'La descripción debe tener al menos 3 caracteres';
      return;
    }

    if (!this.nuevoProducto.purchasePrice || this.nuevoProducto.purchasePrice <= 0) {
      this.error = 'El precio de compra debe ser mayor a 0';
      return;
    }

    if (!this.nuevoProducto.price || this.nuevoProducto.price <= 0) {
      this.error = 'El precio de venta debe ser mayor a 0';
      return;
    }

    if (this.nuevoProducto.price <= this.nuevoProducto.purchasePrice) {
      this.error = 'El precio de venta debe ser mayor al precio de compra';
      return;
    }

    if (!this.nuevoProducto.unit?.trim()) {
      this.error = 'Selecciona cómo vendes este producto';
      return;
    }



    if (this.nuevoProducto.quantity === null || this.nuevoProducto.quantity === undefined || this.nuevoProducto.quantity < 0) {
      this.error = 'La cantidad en stock es requerida';
      return;
    }

    if (!this.nuevoProducto.category?.trim()) {
      this.error = 'Selecciona una categoría';
      return;
    }

    if (!this.nuevoProducto.CName?.trim()) {
      this.error = 'Falta el nombre del comerciante';
      return;
    }

    if (!this.nuevoProducto.Contact?.toString().trim()) {
      this.error = 'Falta el contacto del comerciante';
      return;
    }

    if (!this.nuevoProducto.location?.trim()) {
      this.error = 'Falta el nombre del local';
      return;
    }

    this.loading = true;

    // Preparar datos del producto
    const productData = {
      ...this.nuevoProducto,
      id: Date.now(), // ID temporal basado en timestamp
      image: (this.imagePreview as string) || this.getDefaultProductImage(), // Usar imagen seleccionada o por defecto
      stock: (this.nuevoProducto.quantity || 0) > 0
    };

    console.log('📤 Agregando nuevo producto:', productData.name);

    this.productService.addProduct(productData).subscribe({
      next: (product) => {
        console.log('✅ Producto agregado exitosamente:', product);
        this.success = 'Producto agregado exitosamente';
        
        // Generar notificación de producto agregado
        this.notificationService.addReminderNotification(
          `Producto agregado: ${product.name}`,
          `Stock inicial: ${product.quantity} ${this.getUnitAbbreviation(product.unit || '')}`
        );
        
        // Verificar margen de ganancia
        if (product.purchasePrice && product.purchasePrice > 0) {
          const margin = this.calculateProfitMargin(product);
          this.notificationService.addProfitAlert(product.name, margin);
        }
        
        this.loadProducts();
        this.resetForm();
        this.cerrarModal();
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
    let userData = localStorage.getItem('userData');
    
    // Si no existe 'userData', intentar con 'user'
    if (!userData) {
      userData = localStorage.getItem('user');
    }
    
    let merchantName = '';
    let merchantContact = '';
    let merchantLocation = '';
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        merchantName = `${user.name || ''} ${user.apellido || ''}`.trim() || 'Comerciante';
        merchantContact = user.celular || user.contact || user.phone || '';
        merchantLocation = user.local || user.puesto || user.location || 'Mi Local';
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    this.nuevoProducto = {
      id: 0,
      name: '',
      category: '',
      price: 0,
      purchasePrice: 0,
      image: '',
      description: '',
      location: merchantLocation,
      CName: merchantName,
      Contact: merchantContact,
      stock: true,
      quantity: 0,
      unit: '',
      minStock: 5
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

  // Nuevos métodos para control de inventario mejorado
  getLowStockProducts(): number {
    return this.products.filter(product => 
      product.stock && 
      (product.quantity || 0) <= (product.minStock || 5) && 
      (product.quantity || 0) > 0
    ).length;
  }

  calculateProfitMargin(product: Product): number {
    if (!product.purchasePrice || product.purchasePrice === 0) return 0;
    return ((product.price - product.purchasePrice) / product.purchasePrice) * 100;
  }

  calculateProfitAmount(product: Product): number {
    if (!product.purchasePrice) return 0;
    return product.price - product.purchasePrice;
  }

  getTotalInventoryValue(): number {
    return this.products.reduce((total, product) => {
      return total + ((product.purchasePrice || 0) * (product.quantity || 0));
    }, 0);
  }

  getTotalPotentialProfit(): number {
    return this.products.reduce((total, product) => {
      const profit = this.calculateProfitAmount(product);
      return total + (profit * (product.quantity || 0));
    }, 0);
  }

  getProductsByProfitability(): Product[] {
    return [...this.products]
      .filter(p => p.purchasePrice && p.purchasePrice > 0)
      .sort((a, b) => this.calculateProfitMargin(b) - this.calculateProfitMargin(a));
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

    if (!this.editedProduct.description || this.editedProduct.description.trim().length < 3) {
      this.error = 'La descripción es requerida (mínimo 3 caracteres)';
      return;
    }

    if (!this.editedProduct.purchasePrice || this.editedProduct.purchasePrice <= 0) {
      this.error = 'El precio de compra debe ser mayor a 0';
      return;
    }

    if (!this.editedProduct.price || this.editedProduct.price <= 0) {
      this.error = 'El precio de venta debe ser mayor a 0';
      return;
    }

    if (this.editedProduct.price <= this.editedProduct.purchasePrice) {
      this.error = 'El precio de venta debe ser mayor al precio de compra';
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

    console.log(`📝 Actualizando producto: ${dataToSend.name} - Unidad: ${dataToSend.unit}`);

    // Llamar directamente al servicio
    this.updateProductDirectly(dataToSend);
  }

  // Método para actualizar producto directamente
  updateProductDirectly(productData: any): void {
    if (!productData.id) {
      this.error = 'Error: ID de producto no válido';
      return;
    }

    console.log(`📤 Enviando actualización del producto ID: ${productData.id}`);

    this.loading = true;
    
    this.productService.updateProduct(productData.id.toString(), productData).subscribe({
      next: (response) => {
        console.log('✅ Producto actualizado exitosamente:', response);
        console.log('🔄 Recargando lista de productos...');
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
    if (!unit || unit === 'undefined' || unit === 'null') {
      return 'unidad';
    }
    
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
    
    return units[unit] || unit;
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
        this.imagePreview = null;
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB máximo
        this.error = 'La imagen no puede ser mayor a 5MB';
        this.imagePreview = null;
        return;
      }

      this.selectedFile = file;
      
      // Comprimir y convertir imagen a Base64
      this.compressAndConvertImage(file, (base64String: string) => {
        this.imagePreview = base64String;
        this.nuevoProducto.image = base64String;
        this.error = '';
        console.log('✅ Imagen cargada y comprimida correctamente para nuevo producto');
      });
    } else {
      // Si no hay archivo seleccionado, limpiar la vista previa
      this.imagePreview = null;
      this.selectedFile = null;
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
      this.compressAndConvertImage(file, (base64String: string) => {
        this.editImagePreview = base64String;
        this.error = '';
        console.log('✅ Nueva imagen cargada y comprimida para edición');
      });
    }
  }



  // Método para obtener imagen por defecto
  getDefaultProductImage(): string {
    // Imagen por defecto en Base64 (un ícono de producto genérico)
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjhGOUZBIi8+CjxwYXRoIGQ9Ik0xMDAgNTBDMTE5LjMzIDUwIDEzNSA2NS42NyAxMzUgODVDMTM1IDEwNC4zMyAxMTkuMzMgMTIwIDEwMCAxMjBDODAuNjcgMTIwIDY1IDEwNC4zMyA2NSA4NUM2NSA2NS42NyA4MC42NyA1MCAxMDAgNTBaIiBmaWxsPSIjMzg1NzIzIi8+CjxwYXRoIGQ9Ik0xMDAgMTMwQzEyNy42MTQgMTMwIDE1MCA5NS4yMjg4IDE1MCA1M0MxNTAgMTAuNzcxMiAxMjcuNjE0IC0yNCAxMDAgLTI0QzcyLjM4NiAtMjQgNTAgMTAuNzcxMiA1MCA1M0M1MCA5NS4yMjg4IDcyLjM4NiAxMzAgMTAwIDEzMFoiIGZpbGw9IiM3RkFEMzkiLz4KPHN2Zz4K';
  }

  // Método para manejar cambios en el nombre del local
  onLocationChange(): void {
    if (this.nuevoProducto.location && this.nuevoProducto.location.trim()) {
      console.log('📍 Nombre del local actualizado:', this.nuevoProducto.location);
      this.updateLocalStorage('local', this.nuevoProducto.location);
      // TODO: Implementar actualización en el backend cuando esté listo
    }
  }

  // Método para manejar cambios en el contacto
  onContactChange(): void {
    if (this.nuevoProducto.Contact && this.nuevoProducto.Contact.toString().trim()) {
      console.log('📞 Contacto actualizado:', this.nuevoProducto.Contact);
      this.updateLocalStorage('celular', this.nuevoProducto.Contact);
      // TODO: Implementar actualización en el backend cuando esté listo
    }
  }

  // Método para cerrar el modal
  cerrarModal(): void {
    this.mostrarFormulario = false;
    this.error = '';
    this.success = '';
  }



  // Método para actualizar localStorage con los cambios
  private updateLocalStorage(field: string, value: any): void {
    try {
      let userData = localStorage.getItem('userData');
      if (!userData) {
        userData = localStorage.getItem('user');
      }
      
      if (userData) {
        const user = JSON.parse(userData);
        user[field] = value;
        
        // Actualizar ambas claves para mantener compatibilidad
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userData', JSON.stringify(user));
        
        console.log(`✅ ${field} actualizado en localStorage:`, value);
      }
    } catch (error) {
      console.error('Error actualizando localStorage:', error);
    }
  }

  // Método para verificar alertas de stock
  private checkStockAlerts(): void {
    this.products.forEach(product => {
      const currentStock = product.quantity || 0;
      const minStock = product.minStock || 5;
      
      // Generar alerta si el stock está bajo o agotado
      if (currentStock === 0) {
        this.notificationService.addStockAlert(product.name, currentStock, minStock);
      } else if (currentStock <= minStock) {
        this.notificationService.addStockAlert(product.name, currentStock, minStock);
      }
    });
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
