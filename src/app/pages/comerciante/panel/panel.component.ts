import { Component, OnInit } from '@angular/core';
import { NavcomerComponent } from "../navcomer/navcomer.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Order } from '../../../models/order.model';
import { ProductService } from './../../../services/product.service';
import { DashboardService, DashboardStats } from '../../../services/dashboard.service';
import { DateUtilsService } from '../../../services/date-utils.service';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Interfaces adicionales para reportes
interface ProductoMasVendido {
  nombre: string;
  categoria: string;
  cantidadVendida: number;
  ingresoTotal: number;
  unidad: string;
}

interface VentasPorPeriodo {
  periodo: string;
  ventas: number;
  ordenes: number;
  crecimiento: number;
}

interface AlertaInventario {
  producto: string;
  stockActual: number;
  stockMinimo: number;
  estado: 'Agotado' | 'Poco Stock';
  diasSinVenta: number;
}

interface ResumenFinanciero {
  ventasHoy: number;
  ventasSemana: number;
  ventasMes: number;
  promedioVentaDiaria: number;
  margenGanancia: number;
  costoInventario: number;
}

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [NavcomerComponent, CommonModule, FormsModule],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.css'
})
export class PanelComponent implements OnInit {

  // Estadísticas del dashboard
  dashboardStats: DashboardStats = {
    totalSales: 0,
    totalCustomers: 0,
    totalProducts: 0,
    productsSold: 0,
    salesGrowth: 0,
    customersGrowth: 0,
    productsGrowth: 0,
    soldGrowth: 0
  };

  // Datos para reportes y análisis
  productosMasVendidos: ProductoMasVendido[] = [];
  ventasPorPeriodo: VentasPorPeriodo[] = [];
  alertasInventario: AlertaInventario[] = [];
  resumenFinanciero: ResumenFinanciero = {
    ventasHoy: 0,
    ventasSemana: 0,
    ventasMes: 0,
    promedioVentaDiaria: 0,
    margenGanancia: 0,
    costoInventario: 0
  };

  orders: Order[] = [];
  sortedOrders: Order[] = [];
  filteredOrders: Order[] = [];
  totalOrders: number = 0;
  recentOrders: Order[] = []; // Órdenes recientes para el dashboard
  selectedOrder: any;
  
  // Filtros para reportes
  selectedPeriod: string = 'mes';
  selectedReportType: string = 'ventas';
  
  loading: boolean = true;
  error: string = '';

  // Para usar Math en el template
  Math = Math;

  constructor(
    private productService: ProductService,
    private dashboardService: DashboardService,
    private dateUtils: DateUtilsService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadReportsData();
  }

  loadDashboardData(): void {
    this.loading = true;
    
    // Cargar estadísticas del dashboard
    this.dashboardService.getDashboardStats().subscribe({
      next: (stats) => {
        this.dashboardStats = stats;
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
        // this.error = 'Error al cargar estadísticas'; // Comentado para no mostrar el error
        // Usar datos de ejemplo si hay error
        this.loadExampleData();
      }
    });

    // Cargar órdenes
    this.dashboardService.getMerchantOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.sortedOrders = orders;
        this.filteredOrders = orders;
        this.totalOrders = orders.length;
        this.updateOrders();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar órdenes:', error);
        // this.error = 'Error al cargar órdenes'; // Comentado para no mostrar el error
        // Usar datos de ejemplo si hay error
        this.loadExampleData();
        this.loading = false;
      }
    });
  }

  updateOrders(): void {
    // Método para actualizar las órdenes después de cargarlas
    // Aquí se pueden aplicar filtros, ordenamientos, etc.
    this.recentOrders = this.orders.slice(0, 5); // Mostrar las 5 más recientes
  }

  loadReportsData(): void {
    // TODO: Conectar con servicios reales de BD
    // this.dashboardService.getTopProducts().subscribe(...)
    // this.dashboardService.getSalesReport().subscribe(...)
    
    // Por ahora usar datos de ejemplo
    this.loadExampleReportsData();
  }

  loadExampleData(): void {
    // Datos de ejemplo para cuando no hay conexión a la BD
    this.dashboardStats = {
      totalSales: 1247.85,
      totalCustomers: 89,
      totalProducts: 16,
      productsSold: 342,
      salesGrowth: 15.3,
      customersGrowth: 8.7,
      productsGrowth: -6.2,
      soldGrowth: 12.4
    };
    
    this.orders = this.fetchOrders();
    this.recentOrders = this.orders.slice(0, 5); // Solo las 5 más recientes
  }

  loadExampleReportsData(): void {
    // Productos más vendidos (basado en datos reales del inventario)
    this.productosMasVendidos = [
      { nombre: 'Guineos', categoria: 'Frutas', cantidadVendida: 155, ingresoTotal: 232.50, unidad: 'libra' },
      { nombre: 'Naranjas', categoria: 'Frutas', cantidadVendida: 215, ingresoTotal: 86.00, unidad: 'unidad' },
      { nombre: 'Mangos', categoria: 'Frutas', cantidadVendida: 128, ingresoTotal: 115.20, unidad: 'unidad' },
      { nombre: 'Plátanos Maduros', categoria: 'Frutas', cantidadVendida: 92, ingresoTotal: 69.00, unidad: 'unidad' },
      { nombre: 'Papas', categoria: 'Raíces', cantidadVendida: 89, ingresoTotal: 106.80, unidad: 'libra' }
    ];

    // Ventas por período
    this.ventasPorPeriodo = [
      { periodo: 'Hoy', ventas: 127.50, ordenes: 8, crecimiento: 5.2 },
      { periodo: 'Esta Semana', ventas: 892.30, ordenes: 47, crecimiento: 12.8 },
      { periodo: 'Este Mes', ventas: 3247.85, ordenes: 189, crecimiento: 15.3 },
      { periodo: 'Último Mes', ventas: 2819.45, ordenes: 164, crecimiento: -2.1 }
    ];

    // Alertas de inventario
    this.alertasInventario = [
      { producto: 'Maíz Tierno', stockActual: 0, stockMinimo: 20, estado: 'Agotado', diasSinVenta: 2 },
      { producto: 'Tomates', stockActual: 8, stockMinimo: 15, estado: 'Poco Stock', diasSinVenta: 1 },
      { producto: 'Cilantro', stockActual: 3, stockMinimo: 8, estado: 'Poco Stock', diasSinVenta: 1 },
      { producto: 'Pimientos', stockActual: 6, stockMinimo: 12, estado: 'Poco Stock', diasSinVenta: 2 },
      { producto: 'Apio', stockActual: 5, stockMinimo: 10, estado: 'Poco Stock', diasSinVenta: 3 }
    ];

    // Resumen financiero
    this.resumenFinanciero = {
      ventasHoy: 127.50,
      ventasSemana: 892.30,
      ventasMes: 3247.85,
      promedioVentaDiaria: 104.77,
      margenGanancia: 28.5, // Porcentaje
      costoInventario: 2156.40
    };
  }

  // Métodos para cambiar período de reporte
  changePeriod(period: string): void {
    this.selectedPeriod = period;
    // TODO: Recargar datos según el período seleccionado
    // this.loadReportsData();
  }

  // Métodos para cambiar tipo de reporte
  changeReportType(type: string): void {
    this.selectedReportType = type;
  }

  // Obtener color para el crecimiento
  getGrowthColor(growth: number): string {
    return growth >= 0 ? '#7fad39' : '#572C1A';
  }

  // Obtener icono para el crecimiento
  getGrowthIcon(growth: number): string {
    return growth >= 0 ? 'bi-arrow-up' : 'bi-arrow-down';
  }

  // Obtener productos agotados
  getProductosAgotados(): number {
    return this.alertasInventario.filter(a => a.estado === 'Agotado').length;
  }

  // Verificar si hay productos agotados
  hasProductosAgotados(): boolean {
    return this.alertasInventario.filter(a => a.estado === 'Agotado').length > 0;
  }

fetchOrders(): Order[] {
  // Datos más completos para el panel
  const orders: Order[] = [
    {
      id: 1001,
      client: 'María González',
      date: '30/10/2024',
      products: [
        { name: 'Guineos', quantity: 2, price: 1.50, unit: 'libra' },
        { name: 'Tomates', quantity: 1, price: 2.00, unit: 'libra' }
      ],
      name: 'Venta #1001',
      total: 5.00,
      status: 'Entregado'
    },
    {
      id: 1002,
      client: 'Carlos Rodríguez',
      date: '30/10/2024',
      products: [
        { name: 'Plátanos Maduros', quantity: 3, price: 0.75, unit: 'unidad' },
        { name: 'Yuca', quantity: 2, price: 1.25, unit: 'libra' },
        { name: 'Cilantro', quantity: 1, price: 0.50, unit: 'paquete' }
      ],
      name: 'Venta #1002',
      total: 4.75,
      status: 'Entregado'
    },
    {
      id: 1003,
      client: 'Ana Morales',
      date: '29/10/2024',
      products: [
        { name: 'Lechuga', quantity: 1, price: 1.00, unit: 'unidad' },
        { name: 'Cebolla', quantity: 2, price: 0.80, unit: 'libra' },
        { name: 'Pimientos', quantity: 1, price: 1.50, unit: 'libra' }
      ],
      name: 'Venta #1003',
      total: 4.10,
      status: 'Entregado'
    },
    {
      id: 1004,
      client: 'Pedro Jiménez',
      date: '29/10/2024',
      products: [
        { name: 'Maíz Tierno', quantity: 4, price: 0.60, unit: 'unidad' },
        { name: 'Frijoles', quantity: 1, price: 2.50, unit: 'libra' }
      ],
      name: 'Venta #1004',
      total: 4.90,
      status: 'Pendiente'
    },
    {
      id: 1005,
      client: 'Sofía Herrera',
      date: '28/10/2024',
      products: [
        { name: 'Guineos', quantity: 3, price: 1.50, unit: 'libra' },
        { name: 'Naranjas', quantity: 6, price: 0.40, unit: 'unidad' }
      ],
      name: 'Venta #1005',
      total: 6.90,
      status: 'Entregado'
    },
    {
      id: 1006,
      client: 'Luis Vargas',
      date: '28/10/2024',
      products: [
        { name: 'Papas', quantity: 2, price: 1.20, unit: 'libra' },
        { name: 'Zanahorias', quantity: 1, price: 1.00, unit: 'libra' },
        { name: 'Apio', quantity: 1, price: 0.75, unit: 'paquete' }
      ],
      name: 'Venta #1006',
      total: 4.15,
      status: 'Entregado'
    },
    {
      id: 1007,
      client: 'Carmen López',
      date: '27/10/2024',
      products: [
        { name: 'Mangos', quantity: 4, price: 0.90, unit: 'unidad' },
        { name: 'Piñas', quantity: 1, price: 3.00, unit: 'unidad' }
      ],
      name: 'Venta #1007',
      total: 6.60,
      status: 'Entregado'
    },
    {
      id: 1008,
      client: 'Roberto Silva',
      date: '27/10/2024',
      products: [
        { name: 'Guineos Verdes', quantity: 5, price: 1.20, unit: 'libra' },
        { name: 'Ñame', quantity: 1, price: 2.00, unit: 'libra' }
      ],
      name: 'Venta #1008',
      total: 8.00,
      status: 'Entregado'
    }
  ];

  console.log('📊 Panel - Órdenes cargadas:', orders.length);
  return orders;
}

// Métodos para generar reportes PDF
generateSalesReport(): void {
  const doc = new jsPDF();
  const fechaActual = this.dateUtils.getCurrentDate();
  
  // Encabezado
  doc.setFontSize(18);
  doc.setTextColor(56, 87, 35);
  doc.text('REPORTE DE VENTAS', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Local de Ana - Cosechando', 105, 30, { align: 'center' });
  doc.text(`Fecha: ${fechaActual}`, 105, 40, { align: 'center' });
  
  // Resumen ejecutivo
  doc.setFontSize(14);
  doc.setTextColor(56, 87, 35);
  doc.text('RESUMEN EJECUTIVO', 20, 60);
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`• Ventas totales: $${this.dashboardStats.totalSales.toFixed(2)}`, 20, 70);
  doc.text(`• Órdenes procesadas: ${this.dashboardStats.totalCustomers}`, 20, 80);
  doc.text(`• Productos vendidos: ${this.dashboardStats.productsSold}`, 20, 90);
  doc.text(`• Crecimiento vs mes anterior: ${this.dashboardStats.salesGrowth}%`, 20, 100);
  
  // Ventas por período
  const ventasData = this.ventasPorPeriodo.map(periodo => [
    periodo.periodo,
    `$${periodo.ventas.toFixed(2)}`,
    periodo.ordenes.toString(),
    `${periodo.crecimiento > 0 ? '+' : ''}${periodo.crecimiento.toFixed(1)}%`
  ]);
  
  (doc as any).autoTable({
    head: [['Período', 'Ventas', 'Órdenes', 'Crecimiento']],
    body: ventasData,
    startY: 120,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [56, 87, 35] }
  });
  
  // Productos más vendidos
  const finalY = (doc as any).lastAutoTable.finalY + 20;
  
  doc.setFontSize(14);
  doc.setTextColor(56, 87, 35);
  doc.text('PRODUCTOS MÁS VENDIDOS', 20, finalY);
  
  const productosData = this.productosMasVendidos.map(producto => [
    producto.nombre,
    producto.categoria,
    `${producto.cantidadVendida} ${producto.unidad}`,
    `$${producto.ingresoTotal.toFixed(2)}`
  ]);
  
  (doc as any).autoTable({
    head: [['Producto', 'Categoría', 'Cantidad', 'Ingresos']],
    body: productosData,
    startY: finalY + 10,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [127, 173, 57] }
  });
  
  doc.save(`Reporte_Ventas_${fechaActual.replace(/\//g, '-')}.pdf`);
}

generateFinancialReport(): void {
  const doc = new jsPDF();
  const fechaActual = this.dateUtils.getCurrentDate();
  
  // Encabezado
  doc.setFontSize(18);
  doc.setTextColor(56, 87, 35);
  doc.text('REPORTE FINANCIERO', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Local de Ana - Cosechando', 105, 30, { align: 'center' });
  doc.text(`Fecha: ${fechaActual}`, 105, 40, { align: 'center' });
  
  // Resumen financiero
  doc.setFontSize(14);
  doc.setTextColor(56, 87, 35);
  doc.text('RESUMEN FINANCIERO', 20, 60);
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`• Ventas hoy: $${this.resumenFinanciero.ventasHoy.toFixed(2)}`, 20, 75);
  doc.text(`• Ventas esta semana: $${this.resumenFinanciero.ventasSemana.toFixed(2)}`, 20, 85);
  doc.text(`• Ventas este mes: $${this.resumenFinanciero.ventasMes.toFixed(2)}`, 20, 95);
  doc.text(`• Promedio venta diaria: $${this.resumenFinanciero.promedioVentaDiaria.toFixed(2)}`, 20, 105);
  doc.text(`• Margen de ganancia: ${this.resumenFinanciero.margenGanancia.toFixed(1)}%`, 20, 115);
  doc.text(`• Costo del inventario: $${this.resumenFinanciero.costoInventario.toFixed(2)}`, 20, 125);
  
  // Análisis de rentabilidad
  const gananciaEstimada = this.resumenFinanciero.ventasMes * (this.resumenFinanciero.margenGanancia / 100);
  const roi = (gananciaEstimada / this.resumenFinanciero.costoInventario) * 100;
  
  doc.setFontSize(14);
  doc.setTextColor(127, 173, 57);
  doc.text('ANÁLISIS DE RENTABILIDAD', 20, 150);
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`• Ganancia estimada este mes: $${gananciaEstimada.toFixed(2)}`, 20, 165);
  doc.text(`• ROI (Retorno sobre inversión): ${roi.toFixed(1)}%`, 20, 175);
  doc.text(`• Capital de trabajo: $${this.resumenFinanciero.costoInventario.toFixed(2)}`, 20, 185);
  
  doc.save(`Reporte_Financiero_${fechaActual.replace(/\//g, '-')}.pdf`);
}

generateInventoryAlertsReport(): void {
  const doc = new jsPDF();
  const fechaActual = this.dateUtils.getCurrentDate();
  
  // Encabezado
  doc.setFontSize(18);
  doc.setTextColor(127, 96, 0);
  doc.text('ALERTAS DE INVENTARIO', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Local de Ana - Cosechando', 105, 30, { align: 'center' });
  doc.text(`Fecha: ${fechaActual}`, 105, 40, { align: 'center' });
  
  // Resumen de alertas
  const productosAgotados = this.alertasInventario.filter(a => a.estado === 'Agotado').length;
  const productosPocoStock = this.alertasInventario.filter(a => a.estado === 'Poco Stock').length;
  
  doc.setFontSize(14);
  doc.setTextColor(127, 96, 0);
  doc.text('RESUMEN DE ALERTAS', 20, 60);
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`• Productos agotados: ${productosAgotados}`, 20, 75);
  doc.text(`• Productos con poco stock: ${productosPocoStock}`, 20, 85);
  doc.text(`• Total de alertas: ${this.alertasInventario.length}`, 20, 95);
  
  // Tabla de alertas
  const alertasData = this.alertasInventario.map(alerta => [
    alerta.producto,
    alerta.stockActual.toString(),
    alerta.stockMinimo.toString(),
    alerta.estado,
    `${alerta.diasSinVenta} días`
  ]);
  
  (doc as any).autoTable({
    head: [['Producto', 'Stock Actual', 'Stock Mínimo', 'Estado', 'Días sin Venta']],
    body: alertasData,
    startY: 110,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [127, 96, 0] }
  });
  
  doc.save(`Alertas_Inventario_${fechaActual.replace(/\//g, '-')}.pdf`);
}



verDetalles(order: Order) {
  // Asignar la orden seleccionada a la propiedad selectedOrder
  this.selectedOrder = order;
  // Aquí podrías abrir un modal, mostrar un cuadro de diálogo o cualquier otra cosa
  console.log('Detalles de la orden:', order);
}

// Método para cerrar detalles si es necesario
cerrarDetalles() {
  this.selectedOrder = null;
}

 // Método para manejar la acción de ver detalles
 abrirDetalles(order: any): void {
  this.selectedOrder = order;  // Al hacer clic, se asigna la orden seleccionada
}


}
