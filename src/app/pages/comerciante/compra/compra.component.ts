import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavcomerComponent } from "../navcomer/navcomer.component";
import { jsPDF } from 'jspdf';
import { Compra, Producto } from '../../../models/compra.model';
import { DateUtilsService } from '../../../services/date-utils.service';
import { PaginacionComponent } from '../../../componentes/paginacion/paginacion.component';
import 'jspdf-autotable';  // Importa el módulo autoTable para usarlo



@Component({
  selector: 'app-compra',
  standalone: true,
  imports: [CommonModule, NavcomerComponent, FormsModule, PaginacionComponent],
  templateUrl: './compra.component.html',
  styleUrl: './compra.component.css'
})
export class CompraComponent implements OnInit {

  compras: Compra[] = [
    {
      id: 2001,
      proveedor: 'Finca Los Mangos',
      fecha: '28/10/2024',
      estado: 'Recibido',
      metodoPago: 'Transferencia Bancaria',
      factura: 'FM-001234',
      productos: [
        { nombre: 'Guineos Verdes', cantidad: 50, precio: 1.20, subtotal: 60.00, unit: 'libra' },
        { nombre: 'Plátanos Maduros', cantidad: 30, precio: 0.80, subtotal: 24.00, unit: 'libra' },
        { nombre: 'Yuca', cantidad: 25, precio: 1.00, subtotal: 25.00, unit: 'libra' }
      ],
      total: 109.00
    },
    {
      id: 2002,
      proveedor: 'Verduras del Campo',
      fecha: '26/10/2024',
      estado: 'Recibido',
      metodoPago: 'Efectivo',
      factura: 'VC-005678',
      productos: [
        { nombre: 'Tomates', cantidad: 20, precio: 1.80, subtotal: 36.00, unit: 'libra' },
        { nombre: 'Cebolla Blanca', cantidad: 15, precio: 0.90, subtotal: 13.50, unit: 'libra' },
        { nombre: 'Pimientos', cantidad: 10, precio: 2.00, subtotal: 20.00, unit: 'libra' },
        { nombre: 'Cilantro', cantidad: 12, precio: 0.75, subtotal: 9.00, unit: 'paquete' }
      ],
      total: 78.50
    },
    {
      id: 2003,
      proveedor: 'Frutas Tropicales S.A.',
      fecha: '25/10/2024',
      estado: 'Recibido',
      metodoPago: 'Cheque',
      factura: 'FT-009876',
      productos: [
        { nombre: 'Naranjas', cantidad: 100, precio: 0.35, subtotal: 35.00, unit: 'unidad' },
        { nombre: 'Mangos', cantidad: 40, precio: 0.85, subtotal: 34.00, unit: 'unidad' },
        { nombre: 'Piñas', cantidad: 12, precio: 2.50, subtotal: 30.00, unit: 'unidad' }
      ],
      total: 99.00
    },
    {
      id: 2004,
      proveedor: 'Granos y Cereales Panamá',
      fecha: '24/10/2024',
      estado: 'Pendiente',
      metodoPago: 'Transferencia Bancaria',
      factura: 'GCP-001122',
      productos: [
        { nombre: 'Frijoles Rojos', cantidad: 10, precio: 2.80, subtotal: 28.00, unit: 'libra' },
        { nombre: 'Maíz Amarillo', cantidad: 15, precio: 1.50, subtotal: 22.50, unit: 'libra' },
        { nombre: 'Arroz', cantidad: 20, precio: 1.20, subtotal: 24.00, unit: 'libra' }
      ],
      total: 74.50
    },
    {
      id: 2005,
      proveedor: 'Hierbas y Especias del Valle',
      fecha: '23/10/2024',
      estado: 'Recibido',
      metodoPago: 'Efectivo',
      factura: 'HEV-003344',
      productos: [
        { nombre: 'Apio', cantidad: 8, precio: 1.25, subtotal: 10.00, unit: 'paquete' },
        { nombre: 'Perejil', cantidad: 10, precio: 0.60, subtotal: 6.00, unit: 'paquete' },
        { nombre: 'Lechuga Americana', cantidad: 15, precio: 1.40, subtotal: 21.00, unit: 'unidad' }
      ],
      total: 37.00
    }
  ];

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

  constructor(private dateUtils: DateUtilsService) {}

  ngOnInit(): void {
    this.loadCompras();
  }

  loadCompras(): void {
    this.loading = true;
    this.error = '';
    
    try {
      // Aplicar filtros y paginación
      this.applyFilters();
      this.loading = false;
    } catch (error) {
      this.error = 'Error al cargar las compras';
      this.loading = false;
    }
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
    fecha: '',
    fechaInput: '', // Para el input HTML (formato yyyy-mm-dd)
    metodoPago: '',
    factura: '',
    estado: 'Pendiente',
    productos: [{ nombre: '', cantidad: 1, precio: 0, unit: '', subtotal: 0 }]
  }; // Nueva compra

  // Abrir modal de agregar compra
  openAddPurchaseModal() {
    this.newCompra.fechaInput = this.dateUtils.getCurrentInputDate();
    this.showAddModal = true;
  }

  // Cerrar modal de agregar compra
  closeAddModal() {
    this.showAddModal = false;
    this.resetNewCompra(); // Resetear el formulario al cerrar
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
    console.log('🔄 Guardando nueva compra...');
    
    // Calcular subtotales y total final
    this.newCompra.productos.forEach((producto: any) => {
      producto.subtotal = producto.cantidad * producto.precio;
    });
    
    // Convertir fecha del input (yyyy-mm-dd) a formato dd/mm/aaaa
    const fechaFormateada = this.dateUtils.formatToDisplayDate(this.newCompra.fechaInput);
    
    // Crear la nueva compra con ID único
    const nuevaCompra: Compra = {
      id: Date.now(), // ID temporal basado en timestamp
      proveedor: this.newCompra.proveedor,
      fecha: fechaFormateada, // Usar fecha en formato dd/mm/aaaa
      estado: this.newCompra.estado,
      metodoPago: this.newCompra.metodoPago,
      factura: this.newCompra.factura,
      productos: this.newCompra.productos,
      total: this.calculateTotal()
    };

    console.log('📤 Datos de la compra a guardar:', nuevaCompra);

    // TODO: Aquí se conectaría con el servicio para guardar en BD
    // this.compraService.addCompra(nuevaCompra).subscribe(...)

    // Por ahora, agregar a la lista local
    this.compras.unshift(nuevaCompra); // Agregar al inicio de la lista
    
    // Actualizar filtros y paginación
    this.applyFilters();
    
    console.log('✅ Compra guardada exitosamente');
    
    // Cerrar el modal y resetear el formulario
    this.closeAddModal();
    
    // Mostrar mensaje de éxito (opcional)
    // this.showSuccessMessage('Compra registrada exitosamente');
  }

  // Resetear los campos del formulario de nueva compra
  resetNewCompra() {
    this.newCompra = {
      proveedor: '',
      fecha: '',
      fechaInput: '',
      metodoPago: '',
      factura: '',
      estado: 'Pendiente',
      productos: [{ nombre: '', cantidad: 1, precio: 0, unit: '', subtotal: 0 }]
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
    return this.newCompra.productos.reduce((total: number, producto: any) => {
      return total + (producto.cantidad * producto.precio || 0);
    }, 0);
  }

  // Verificar si se puede agregar un nuevo producto
  canAddProduct(): boolean {
    // Solo permitir agregar si el último producto tiene nombre
    const lastProduct = this.newCompra.productos[this.newCompra.productos.length - 1];
    return lastProduct && lastProduct.nombre && lastProduct.nombre.trim().length > 0;
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

