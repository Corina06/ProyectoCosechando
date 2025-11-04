import { Component, OnInit } from '@angular/core';
import { NavcomerComponent } from "../navcomer/navcomer.component";
import { jsPDF} from "jspdf"
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PaginacionComponent } from '../../../componentes/paginacion/paginacion.component';
import { DateUtilsService } from '../../../services/date-utils.service';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';
import 'jspdf-autotable';


// Interfaces para el inventario
interface ProductoInventario {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  cantidad: number;
  cantidadMinima: number;
  precio: number;
  costoUnitario: number;
  unidad: string;
  fechaUltimaCompra: string;
  fechaUltimaVenta: string;
  totalVendido: number;
  estado: 'Disponible' | 'Poco Stock' | 'Agotado';
}

interface MovimientoInventario {
  id: number;
  productoId: number;
  productoNombre: string;
  tipo: 'Entrada' | 'Salida';
  cantidad: number;
  motivo: string;
  fecha: string;
  referencia: string;
}

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [NavcomerComponent, CommonModule, FormsModule, RouterModule, PaginacionComponent],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent implements OnInit {

  // Lista de productos del inventario (se carga desde los productos reales del comerciante)
  productos: ProductoInventario[] = [];

  // Lista de movimientos de inventario (se generará automáticamente con las compras y ventas)
  movimientos: MovimientoInventario[] = [];

  // Variables para filtros y paginación
  filteredProductos: ProductoInventario[] = [];
  selectedCategoria: string = '';
  selectedEstado: string = '';
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalProductos: number = 0;
  currentProductos: ProductoInventario[] = [];

  // Variables para estadísticas
  valorTotalInventario: number = 0;
  productosPocoStock: number = 0;
  productosAgotados: number = 0;
  
  // Estados de carga
  loading: boolean = false;
  error: string = '';

  constructor(
    private dateUtils: DateUtilsService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadInventario();
    this.calculateStats();
  }

  loadInventario(): void {
    this.loading = true;
    this.error = '';
    
    // Obtener el contacto del usuario actual para filtrar sus productos
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
        console.log('⚠️ Usuario sin contacto, mostrando inventario vacío');
        this.productos = [];
        this.applyFilters();
        this.calculateStats();
        this.loading = false;
        return;
      }

      console.log('📦 Cargando inventario para usuario con contacto:', userContact);
      
      this.productService.getProductsByUser(userContact).subscribe({
        next: (products: Product[]) => {
          console.log(`📦 ${products.length} productos encontrados para el inventario`);
          
          // Convertir productos a formato de inventario
          this.productos = products.map(product => this.convertToInventoryProduct(product));
          
          // Actualizar estados de productos basado en cantidad vs cantidad mínima
          this.productos.forEach(producto => {
            if (producto.cantidad === 0) {
              producto.estado = 'Agotado';
            } else if (producto.cantidad <= producto.cantidadMinima) {
              producto.estado = 'Poco Stock';
            } else {
              producto.estado = 'Disponible';
            }
          });
          
          this.applyFilters();
          this.calculateStats();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading inventory:', error);
          this.error = 'Error al cargar el inventario';
          this.loading = false;
        }
      });
    } catch (error) {
      console.error('Error parsing user data:', error);
      this.error = 'Error al obtener datos del usuario';
      this.loading = false;
    }
  }

  // Método para convertir Product a ProductoInventario
  private convertToInventoryProduct(product: Product): ProductoInventario {
    return {
      id: product.id || 0,
      nombre: product.name,
      descripcion: product.description,
      categoria: product.category,
      cantidad: product.quantity || 0,
      cantidadMinima: Math.max(5, Math.floor((product.quantity || 0) * 0.2)), // 20% del stock actual como mínimo
      precio: product.price,
      costoUnitario: 0, // Sin costo hasta que se registre una compra
      unidad: product.unit || 'unidad',
      fechaUltimaCompra: 'Sin compras', // No hay compras registradas
      fechaUltimaVenta: 'Sin ventas', // No hay ventas registradas
      totalVendido: 0, // No hay ventas registradas
      estado: 'Disponible' // Se calculará después
    };
  }

  calculateStats(): void {
    // Solo calcular valor para productos que tienen costo registrado
    this.valorTotalInventario = this.productos.reduce((total, producto) => 
      total + (producto.costoUnitario > 0 ? (producto.cantidad * producto.costoUnitario) : 0), 0);
    
    this.productosPocoStock = this.productos.filter(p => p.estado === 'Poco Stock').length;
    this.productosAgotados = this.productos.filter(p => p.estado === 'Agotado').length;
  }

  // Paginación
  updateProductos(): void {
    this.totalProductos = this.filteredProductos.length;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.currentProductos = this.filteredProductos.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateProductos();
  }

  // Filtros
  applyFilters(): void {
    this.filteredProductos = this.productos.filter(producto => {
      const matchesCategoria = !this.selectedCategoria || producto.categoria === this.selectedCategoria;
      const matchesEstado = !this.selectedEstado || producto.estado === this.selectedEstado;
      const matchesSearch = !this.searchTerm || 
        producto.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        producto.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      return matchesCategoria && matchesEstado && matchesSearch;
    });
    
    this.currentPage = 1;
    this.updateProductos();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  filterByCategoria(): void {
    this.applyFilters();
  }

  filterByEstado(): void {
    this.applyFilters();
  }

  // Obtener color del estado
  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'Disponible': return '#7fad39';
      case 'Poco Stock': return '#7F6000';
      case 'Agotado': return '#572C1A';
      default: return '#6c757d';
    }
  }

  // Obtener categorías únicas
  getCategorias(): string[] {
    return [...new Set(this.productos.map(p => p.categoria))];
  }

  // Obtener abreviación de unidad
  getUnitAbbreviation(unit: string): string {
    const abbreviations: { [key: string]: string } = {
      'unidad': 'u',
      'libra': 'lb',
      'kilo': 'kg',
      'paquete': 'paq',
      'bolsa': 'bolsa',
      'caja': 'caja',
      'docena': 'doc'
    };
    return abbreviations[unit] || unit || 'u';
  }

  // Generar reporte de inventario completo en PDF
  downloadInventoryPDF(): void {
    const doc = new jsPDF();
    const fechaActual = this.dateUtils.getCurrentDate();
    
    // Encabezado del reporte
    doc.setFontSize(18);
    doc.setTextColor(56, 87, 35); // Verde del tema
    doc.text('REPORTE DE INVENTARIO', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Local de Ana - Cosechando', 105, 30, { align: 'center' });
    doc.text(`Fecha: ${fechaActual}`, 105, 40, { align: 'center' });
    
    // Estadísticas generales
    doc.setFontSize(14);
    doc.setTextColor(56, 87, 35);
    doc.text('RESUMEN EJECUTIVO', 20, 60);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`• Total de productos: ${this.productos.length}`, 20, 70);
    doc.text(`• Valor total del inventario: $${this.valorTotalInventario.toFixed(2)}`, 20, 80);
    doc.text(`• Productos con poco stock: ${this.productosPocoStock}`, 20, 90);
    doc.text(`• Productos agotados: ${this.productosAgotados}`, 20, 100);
    
    // Tabla de inventario usando autoTable
    const tableData = this.productos.map(producto => [
      producto.id,
      producto.nombre,
      producto.categoria,
      `${producto.cantidad} ${this.getUnitAbbreviation(producto.unidad)}`,
      `${producto.cantidadMinima} ${this.getUnitAbbreviation(producto.unidad)}`,
      producto.estado,
      `$${producto.precio.toFixed(2)}`,
      producto.costoUnitario > 0 ? `$${(producto.cantidad * producto.costoUnitario).toFixed(2)}` : 'N/A'
    ]);
    
    (doc as any).autoTable({
      head: [['ID', 'Producto', 'Categoría', 'Stock', 'Mín.', 'Estado', 'Precio', 'Valor']],
      body: tableData,
      startY: 120,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [56, 87, 35] },
      columnStyles: {
        5: { cellWidth: 20 }, // Estado
        6: { halign: 'right' }, // Precio
        7: { halign: 'right' }  // Valor
      }
    });
    
    // Productos que necesitan reabastecimiento
    const productosReabastecer = this.productos.filter(p => p.estado === 'Poco Stock' || p.estado === 'Agotado');
    
    if (productosReabastecer.length > 0) {
      const finalY = (doc as any).lastAutoTable.finalY + 20;
      
      doc.setFontSize(14);
      doc.setTextColor(127, 96, 0); // Amarillo de alerta
      doc.text('⚠️ PRODUCTOS QUE NECESITAN REABASTECIMIENTO', 20, finalY);
      
      const alertData = productosReabastecer.map(producto => [
        producto.nombre,
        `${producto.cantidad} ${this.getUnitAbbreviation(producto.unidad)}`,
        `${producto.cantidadMinima} ${this.getUnitAbbreviation(producto.unidad)}`,
        producto.estado,
        producto.fechaUltimaCompra
      ]);
      
      (doc as any).autoTable({
        head: [['Producto', 'Stock Actual', 'Mínimo', 'Estado', 'Última Compra']],
        body: alertData,
        startY: finalY + 10,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [127, 96, 0] }
      });
    }
    
    doc.save(`Inventario_${fechaActual.replace(/\//g, '-')}.pdf`);
  }

  // Generar reporte de productos con poco stock
  downloadLowStockPDF(): void {
    const productosPocoStock = this.productos.filter(p => p.estado === 'Poco Stock' || p.estado === 'Agotado');
    
    if (productosPocoStock.length === 0) {
      alert('No hay productos con poco stock para reportar.');
      return;
    }
    
    const doc = new jsPDF();
    const fechaActual = this.dateUtils.getCurrentDate();
    
    doc.setFontSize(18);
    doc.setTextColor(127, 96, 0);
    doc.text('ALERTA DE REABASTECIMIENTO', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Local de Ana - Cosechando', 105, 30, { align: 'center' });
    doc.text(`Fecha: ${fechaActual}`, 105, 40, { align: 'center' });
    
    const tableData = productosPocoStock.map(producto => [
      producto.nombre,
      producto.categoria,
      `${producto.cantidad} ${this.getUnitAbbreviation(producto.unidad)}`,
      `${producto.cantidadMinima} ${this.getUnitAbbreviation(producto.unidad)}`,
      producto.estado,
      producto.fechaUltimaCompra,
      `${producto.cantidadMinima * 2} ${this.getUnitAbbreviation(producto.unidad)}` // Sugerencia de compra
    ]);
    
    (doc as any).autoTable({
      head: [['Producto', 'Categoría', 'Stock', 'Mínimo', 'Estado', 'Última Compra', 'Sugerencia']],
      body: tableData,
      startY: 60,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [127, 96, 0] },
      columnStyles: {
        4: { cellWidth: 20 } // Estado
      }
    });
    
    doc.save(`Reabastecimiento_${fechaActual.replace(/\//g, '-')}.pdf`);
  }

  // Generar reporte de movimientos de inventario
  downloadMovementsPDF(): void {
    const doc = new jsPDF();
    const fechaActual = this.dateUtils.getCurrentDate();
    
    doc.setFontSize(18);
    doc.setTextColor(56, 87, 35);
    doc.text('MOVIMIENTOS DE INVENTARIO', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Local de Ana - Cosechando', 105, 30, { align: 'center' });
    doc.text(`Fecha: ${fechaActual}`, 105, 40, { align: 'center' });
    
    const tableData = this.movimientos.map(movimiento => [
      movimiento.fecha,
      movimiento.productoNombre,
      movimiento.tipo,
      movimiento.cantidad,
      movimiento.motivo,
      movimiento.referencia
    ]);
    
    (doc as any).autoTable({
      head: [['Fecha', 'Producto', 'Tipo', 'Cantidad', 'Motivo', 'Referencia']],
      body: tableData,
      startY: 60,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [56, 87, 35] },
      columnStyles: {
        2: { cellWidth: 20 }, // Tipo
        3: { halign: 'center' } // Cantidad
      }
    });
    
    doc.save(`Movimientos_${fechaActual.replace(/\//g, '-')}.pdf`);
  }
}


