import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavcomerComponent } from "../navcomer/navcomer.component";
import { jsPDF } from 'jspdf';
import { Compra, Producto } from '../../../models/compra.model';
import { DateUtilsService } from '../../../services/date-utils.service';
import { PaginacionComponent } from '../../../componentes/paginacion/paginacion.component';
import { ExpenseService, Expense } from '../../../services/expense.service';
import { NotificationService } from '../../../services/notification.service';
import 'jspdf-autotable';  // Importa el módulo autoTable para usarlo



@Component({
  selector: 'app-compra',
  standalone: true,
  imports: [CommonModule, NavcomerComponent, FormsModule, PaginacionComponent],
  templateUrl: './compra.component.html',
  styleUrl: './compra.component.css'
})
export class CompraComponent implements OnInit {

  // Lista de compras del comerciante (inicialmente vacía para nuevos comerciantes)
  compras: Compra[] = [];

  showModal = false;  // Controla la visibilidad del modal
  selectedCompra: any;

  // Variables para paginación
  filteredCompras: Compra[] = [];
  selectedStatus: string = '';
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalCompras: number = 0;
  currentCompras: Compra[] = [];

  // Estados de carga y error
  loading: boolean = false;
  error: string = '';

  constructor(
    private dateUtils: DateUtilsService,
    private expenseService: ExpenseService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadCompras();
  }

  loadCompras(): void {
    this.loading = true;
    this.error = '';
    
    // Obtener el contacto del usuario actual
    let userData = localStorage.getItem('userData');
    
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
      const userContact = user.celular || user.contact || user.phone;
      
      if (!userContact) {
        console.log('⚠️ Usuario sin contacto, mostrando lista vacía');
        this.compras = [];
        this.applyFilters();
        this.loading = false;
        return;
      }

      console.log('📦 Cargando gastos para comerciante con contacto:', userContact);
      
      this.expenseService.getExpensesByUser(userContact).subscribe({
        next: (expenses: Expense[]) => {
          console.log(`📦 ${expenses.length} gastos encontrados`);
          
          // Convertir expenses a formato Compra para compatibilidad
          this.compras = expenses.map(expense => this.convertExpenseToCompra(expense));
          
          this.applyFilters();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading expenses:', error);
          this.error = 'Error al cargar los gastos';
          this.loading = false;
        }
      });
    } catch (error) {
      console.error('Error parsing user data:', error);
      this.error = 'Error al obtener datos del usuario';
      this.loading = false;
    }
  }

  // Método para convertir Expense a Compra (compatibilidad)
  private convertExpenseToCompra(expense: Expense): Compra {
    return {
      id: expense.id || 0,
      comercianteContact: expense.comercianteContact,
      proveedor: expense.proveedor,
      tipoGasto: expense.tipoGasto,
      fecha: expense.fecha,
      estado: expense.estado,
      metodoPago: expense.metodoPago,
      factura: expense.factura,
      descripcion: expense.descripcion,
      productos: expense.items || [], // items -> productos
      total: expense.total
    };
  }

  // Paginación
  updateCompras(): void {
    this.totalCompras = this.filteredCompras.length;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.currentCompras = this.filteredCompras.slice(startIndex, endIndex);
  }

  // Método que se llama cuando el usuario cambia de página
  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateCompras();
  }

  // Método unificado para aplicar todos los filtros
  applyFilters(): void {
    this.filteredCompras = this.compras.filter(compra => {
      // Filtro por estado
      const matchesStatus = !this.selectedStatus || compra.estado === this.selectedStatus;
      
      // Filtro por búsqueda (proveedor, factura, productos)
      const matchesSearch = !this.searchTerm || 
        compra.proveedor.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        compra.factura.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        compra.productos.some(producto => 
          producto.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      
      return matchesStatus && matchesSearch;
    });
    
    this.currentPage = 1; // Resetear a la primera página
    this.updateCompras(); // Actualizar la paginación
  }

  // Método para filtrar por estado
  filterCompras(): void {
    this.applyFilters();
  }

  // Método para búsqueda
  onSearchChange(): void {
    this.applyFilters();
  }
  

  showAddModal = false; // Modal para agregar compra
  newCompra: any = {
    proveedor: '',
    tipoGasto: 'Compra de Productos',
    fecha: '',
    fechaInput: '', // Para el input HTML (formato yyyy-mm-dd)
    metodoPago: '',
    factura: '',
    estado: 'Pendiente',
    descripcion: '',
    totalManual: 0, // Para gastos que no son compra de productos
    productos: []
  }; // Nueva compra

  // Abrir modal de agregar compra
  openAddPurchaseModal() {
    this.newCompra.fechaInput = this.dateUtils.getCurrentInputDate();
    
    // Si es compra de productos y no hay productos, agregar uno por defecto
    if (this.newCompra.tipoGasto === 'Compra de Productos' && this.newCompra.productos.length === 0) {
      this.newCompra.productos = [{ nombre: '', cantidad: 1, precio: 0, unit: '', subtotal: 0 }];
    }
    
    this.showAddModal = true;
  }

  // Cerrar modal de agregar compra
  closeAddModal() {
    this.showAddModal = false;
    this.resetNewCompra(); // Resetear el formulario al cerrar
  }

  // Método para limpiar filtros
  clearAllFilters() {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.currentPage = 1;
    this.applyFilters();
  }

  // Función para agregar un producto vacío al formulario
  addProduct() {
    this.newCompra.productos.push({ nombre: '', cantidad: 1, precio: 0, unit: '', subtotal: 0 });
  }

  // Eliminar producto del formulario
  removeProduct(index: number) {
    this.newCompra.productos.splice(index, 1);
  }

  // Función para enviar los datos de la nueva compra
  submitAddPurchase() {
    console.log('🔄 Guardando nuevo gasto...');
    console.log('📋 Datos del formulario:', this.newCompra);
    
    // Solo validar campos básicos
    if (!this.newCompra.proveedor || !this.newCompra.factura || !this.newCompra.fechaInput) {
      alert('Por favor, completa al menos: Proveedor, Factura y Fecha');
      return;
    }
    
    // Obtener contacto del usuario
    let userData = localStorage.getItem('userData') || localStorage.getItem('user');
    if (!userData) {
      alert('Error: No se encontraron datos del usuario');
      return;
    }
    
    const user = JSON.parse(userData);
    const userContact = user.celular || user.contact || user.phone;
    
    if (!userContact) {
      alert('Error: Usuario sin contacto registrado');
      return;
    }

    // Convertir fecha
    const fechaFormateada = this.dateUtils.formatToDisplayDate(this.newCompra.fechaInput);
    
    // Preparar items con valores por defecto para campos requeridos
    let processedItems = [];
    if (this.newCompra.productos && this.newCompra.productos.length > 0) {
      processedItems = this.newCompra.productos.map((producto: any) => ({
        nombre: producto.nombre || 'Producto sin nombre',
        cantidad: producto.cantidad || 1,
        precio: producto.precio || 0,
        unit: producto.unit || 'unidad', // Valor por defecto para unit
        subtotal: producto.subtotal || (producto.cantidad * producto.precio) || 0
      }));
    }
    
    // Preparar datos para el backend
    const expenseData: Expense = {
      id: Date.now(),
      comercianteContact: userContact,
      proveedor: this.newCompra.proveedor,
      tipoGasto: this.newCompra.tipoGasto || 'Otros',
      fecha: fechaFormateada,
      estado: this.newCompra.estado || 'Pendiente',
      metodoPago: this.newCompra.metodoPago || 'Efectivo',
      factura: this.newCompra.factura,
      descripcion: this.newCompra.descripcion || '',
      items: processedItems,
      total: this.newCompra.totalManual || this.calculateTotal() || 0
    };

    console.log('📤 Guardando gasto en la base de datos:', expenseData);

    this.expenseService.addExpense(expenseData).subscribe({
      next: (savedExpense) => {
        console.log('✅ Gasto guardado exitosamente:', savedExpense);
        
        // Generar notificación de gasto registrado
        this.notificationService.addExpenseNotification(
          savedExpense.total,
          savedExpense.proveedor,
          savedExpense.tipoGasto
        );
        
        this.loadCompras();
        this.closeAddModal();
        alert('¡Gasto guardado exitosamente!');
      },
      error: (error) => {
        console.error('❌ Error guardando gasto:', error);
        alert('Error al guardar: ' + (error.error?.message || error.message));
      }
    });
  }

  // Resetear los campos del formulario de nueva compra
  resetNewCompra() {
    this.newCompra = {
      proveedor: '',
      tipoGasto: 'Compra de Productos',
      fecha: '',
      fechaInput: '',
      metodoPago: '',
      factura: '',
      estado: 'Pendiente',
      descripcion: '',
      totalManual: 0,
      productos: []
    };
  }

  // Calcular subtotal de un producto específico
  calculateSubtotal(index: number) {
    const producto = this.newCompra.productos[index];
    if (producto.cantidad && producto.precio) {
      producto.subtotal = producto.cantidad * producto.precio;
    } else {
      producto.subtotal = 0;
    }
  }

  // Calcular el total de la compra
  calculateTotal(): number {
    if (this.newCompra.tipoGasto === 'Compra de Productos') {
      return this.newCompra.productos.reduce((total: number, producto: any) => {
        return total + (producto.cantidad * producto.precio || 0);
      }, 0);
    } else {
      // Para otros tipos de gastos, permitir ingreso manual del total
      return this.newCompra.totalManual || 0;
    }
  }

  // Verificar si se puede agregar un nuevo producto
  canAddProduct(): boolean {
    if (this.newCompra.productos.length === 0) return true;
    // Solo permitir agregar si el último producto tiene nombre
    const lastProduct = this.newCompra.productos[this.newCompra.productos.length - 1];
    return lastProduct && lastProduct.nombre && lastProduct.nombre.trim().length > 0;
  }

  // Método que se ejecuta cuando cambia el tipo de gasto
  onTipoGastoChange() {
    if (this.newCompra.tipoGasto === 'Compra de Productos') {
      // Si cambió a compra de productos y no hay productos, agregar uno
      if (this.newCompra.productos.length === 0) {
        this.newCompra.productos = [{ nombre: '', cantidad: 1, precio: 0, unit: '', subtotal: 0 }];
      }
    } else {
      // Si cambió a otro tipo de gasto, limpiar productos
      this.newCompra.productos = [];
    }
  }

  // Función para ver los detalles de la compra
  viewPurchaseDetails(compra: any) {
    this.selectedCompra = compra;
    this.showModal = true;
  }

  // Cerrar modal de detalles de la compra
  closeModal() {
    this.showModal = false;
  }





  // Método para obtener la abreviación de la unidad
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

