import { Component, OnInit } from '@angular/core';
import { NavcomerComponent } from "../navcomer/navcomer.component";
import { jsPDF} from "jspdf"
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginacionComponent } from '../../../componentes/paginacion/paginacion.component';
import { DateUtilsService } from '../../../services/date-utils.service';
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
  imports: [NavcomerComponent, CommonModule, FormsModule, PaginacionComponent],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent implements OnInit {

  productos: ProductoInventario[] = [
    { id: 1, nombre: 'Guineos', descripcion: 'Guineos verdes frescos', categoria: 'Frutas', cantidad: 45, cantidadMinima: 20, precio: 1.50, costoUnitario: 1.20, unidad: 'libra', fechaUltimaCompra: '28/10/2024', fechaUltimaVenta: '30/10/2024', totalVendido: 155, estado: 'Disponible' },
    { id: 2, nombre: 'Tomates', descripcion: 'Tomates rojos maduros', categoria: 'Vegetales', cantidad: 8, cantidadMinima: 15, precio: 2.00, costoUnitario: 1.80, unidad: 'libra', fechaUltimaCompra: '26/10/2024', fechaUltimaVenta: '30/10/2024', totalVendido: 87, estado: 'Poco Stock' },
    { id: 3, nombre: 'Plátanos Maduros', descripcion: 'Plátanos amarillos maduros', categoria: 'Frutas', cantidad: 25, cantidadMinima: 10, precio: 0.75, costoUnitario: 0.60, unidad: 'unidad', fechaUltimaCompra: '28/10/2024', fechaUltimaVenta: '30/10/2024', totalVendido: 92, estado: 'Disponible' },
    { id: 4, nombre: 'Yuca', descripcion: 'Yuca fresca para cocinar', categoria: 'Raíces', cantidad: 18, cantidadMinima: 15, precio: 1.25, costoUnitario: 1.00, unidad: 'libra', fechaUltimaCompra: '28/10/2024', fechaUltimaVenta: '30/10/2024', totalVendido: 67, estado: 'Disponible' },
    { id: 5, nombre: 'Cilantro', descripcion: 'Cilantro fresco en paquetes', categoria: 'Hierbas', cantidad: 3, cantidadMinima: 8, precio: 0.50, costoUnitario: 0.35, unidad: 'paquete', fechaUltimaCompra: '26/10/2024', fechaUltimaVenta: '30/10/2024', totalVendido: 45, estado: 'Poco Stock' },
    { id: 6, nombre: 'Lechuga', descripcion: 'Lechuga americana fresca', categoria: 'Vegetales', cantidad: 12, cantidadMinima: 8, precio: 1.00, costoUnitario: 0.80, unidad: 'unidad', fechaUltimaCompra: '27/10/2024', fechaUltimaVenta: '29/10/2024', totalVendido: 38, estado: 'Disponible' },
    { id: 7, nombre: 'Cebolla', descripcion: 'Cebolla blanca fresca', categoria: 'Vegetales', cantidad: 22, cantidadMinima: 10, precio: 0.80, costoUnitario: 0.65, unidad: 'libra', fechaUltimaCompra: '26/10/2024', fechaUltimaVenta: '29/10/2024', totalVendido: 73, estado: 'Disponible' },
    { id: 8, nombre: 'Pimientos', descripcion: 'Pimientos verdes frescos', categoria: 'Vegetales', cantidad: 6, cantidadMinima: 12, precio: 1.50, costoUnitario: 1.25, unidad: 'libra', fechaUltimaCompra: '26/10/2024', fechaUltimaVenta: '29/10/2024', totalVendido: 34, estado: 'Poco Stock' },
    { id: 9, nombre: 'Naranjas', descripcion: 'Naranjas dulces para jugo', categoria: 'Frutas', cantidad: 85, cantidadMinima: 30, precio: 0.40, costoUnitario: 0.30, unidad: 'unidad', fechaUltimaCompra: '25/10/2024', fechaUltimaVenta: '28/10/2024', totalVendido: 215, estado: 'Disponible' },
    { id: 10, nombre: 'Mangos', descripcion: 'Mangos maduros dulces', categoria: 'Frutas', cantidad: 32, cantidadMinima: 15, precio: 0.90, costoUnitario: 0.70, unidad: 'unidad', fechaUltimaCompra: '25/10/2024', fechaUltimaVenta: '27/10/2024', totalVendido: 128, estado: 'Disponible' },
    { id: 11, nombre: 'Piñas', descripcion: 'Piñas maduras dulces', categoria: 'Frutas', cantidad: 8, cantidadMinima: 5, precio: 3.00, costoUnitario: 2.50, unidad: 'unidad', fechaUltimaCompra: '25/10/2024', fechaUltimaVenta: '27/10/2024', totalVendido: 23, estado: 'Disponible' },
    { id: 12, nombre: 'Maíz Tierno', descripcion: 'Mazorcas de maíz tierno', categoria: 'Vegetales', cantidad: 0, cantidadMinima: 20, precio: 0.60, costoUnitario: 0.45, unidad: 'unidad', fechaUltimaCompra: '24/10/2024', fechaUltimaVenta: '29/10/2024', totalVendido: 56, estado: 'Agotado' },
    { id: 13, nombre: 'Frijoles', descripcion: 'Frijoles rojos secos', categoria: 'Legumbres', cantidad: 15, cantidadMinima: 8, precio: 2.50, costoUnitario: 2.00, unidad: 'libra', fechaUltimaCompra: '24/10/2024', fechaUltimaVenta: '29/10/2024', totalVendido: 42, estado: 'Disponible' },
    { id: 14, nombre: 'Papas', descripcion: 'Papas amarillas frescas', categoria: 'Raíces', cantidad: 28, cantidadMinima: 20, precio: 1.20, costoUnitario: 0.95, unidad: 'libra', fechaUltimaCompra: '28/10/2024', fechaUltimaVenta: '28/10/2024', totalVendido: 89, estado: 'Disponible' },
    { id: 15, nombre: 'Zanahorias', descripcion: 'Zanahorias frescas naranjas', categoria: 'Vegetales', cantidad: 18, cantidadMinima: 15, precio: 1.00, costoUnitario: 0.80, unidad: 'libra', fechaUltimaCompra: '28/10/2024', fechaUltimaVenta: '28/10/2024', totalVendido: 67, estado: 'Disponible' },
    { id: 16, nombre: 'Apio', descripcion: 'Apio fresco en paquetes', categoria: 'Vegetales', cantidad: 5, cantidadMinima: 10, precio: 0.75, costoUnitario: 0.60, unidad: 'paquete', fechaUltimaCompra: '23/10/2024', fechaUltimaVenta: '28/10/2024', totalVendido: 28, estado: 'Poco Stock' }
  ];

  movimientos: MovimientoInventario[] = [
    { id: 1, productoId: 1, productoNombre: 'Guineos', tipo: 'Entrada', cantidad: 50, motivo: 'Compra a proveedor', fecha: '28/10/2024', referencia: 'FM-001234' },
    { id: 2, productoId: 1, productoNombre: 'Guineos', tipo: 'Salida', cantidad: 2, motivo: 'Venta a cliente', fecha: '30/10/2024', referencia: 'Venta #1001' },
    { id: 3, productoId: 2, productoNombre: 'Tomates', tipo: 'Entrada', cantidad: 20, motivo: 'Compra a proveedor', fecha: '26/10/2024', referencia: 'VC-005678' },
    { id: 4, productoId: 2, productoNombre: 'Tomates', tipo: 'Salida', cantidad: 1, motivo: 'Venta a cliente', fecha: '30/10/2024', referencia: 'Venta #1001' },
    { id: 5, productoId: 3, productoNombre: 'Plátanos Maduros', tipo: 'Entrada', cantidad: 30, motivo: 'Compra a proveedor', fecha: '28/10/2024', referencia: 'FM-001234' },
    { id: 6, productoId: 3, productoNombre: 'Plátanos Maduros', tipo: 'Salida', cantidad: 3, motivo: 'Venta a cliente', fecha: '30/10/2024', referencia: 'Venta #1002' },
    { id: 7, productoId: 12, productoNombre: 'Maíz Tierno', tipo: 'Salida', cantidad: 4, motivo: 'Venta a cliente', fecha: '29/10/2024', referencia: 'Venta #1004' }
  ];

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

  constructor(private dateUtils: DateUtilsService) {}

  ngOnInit(): void {
    this.loadInventario();
    this.calculateStats();
  }

  loadInventario(): void {
    this.loading = true;
    this.error = '';
    
    try {
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
      this.loading = false;
    } catch (error) {
      this.error = 'Error al cargar el inventario';
      this.loading = false;
    }
  }

  calculateStats(): void {
    this.valorTotalInventario = this.productos.reduce((total, producto) => 
      total + (producto.cantidad * producto.costoUnitario), 0);
    
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
      `$${(producto.cantidad * producto.costoUnitario).toFixed(2)}`
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


