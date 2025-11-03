import { ProductService } from './../../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { NavcomerComponent } from '../navcomer/navcomer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Order } from '../../../models/order.model';
import { PaginacionComponent } from '../../../componentes/paginacion/paginacion.component';
import { DateUtilsService } from '../../../services/date-utils.service';

type OrderKey = keyof Order;

@Component({
  selector: 'app-orden',
  standalone: true,
  imports: [NavcomerComponent, CommonModule, FormsModule, PaginacionComponent],
  templateUrl: './orden.component.html',
  styleUrl: './orden.component.css'
})

export class OrdenComponent implements OnInit{

  orders: Order[] = []; // Aquí van tus órdenes
  sortedOrders: Order[] = [];
  sortDirection: { [key in keyof Order]: number } = { id:1, client: 1, date: 1, products: 1, name:1, total: 1, status: 1 };
  selectedOrder: any; 
  
  filteredOrders: Order[] = [];
  selectedStatus: string = '';
  searchTerm: string = '';

  currentPage: number = 1; 
  itemsPerPage: number = 10;    
  totalOrders: number = 0; 

  currentOrders: Order[] = [];
  
  // Estados de carga y error
  loading: boolean = false;
  error: string = '';

    constructor(private productService: ProductService, private dateUtils: DateUtilsService) {
      this.loadOrders();
  }

  ngOnInit(): void {
    // Componente inicializado
  }

  loadOrders(): void {
    this.loading = true;
    this.error = '';
    
    // TODO: Conectar con servicio real de órdenes
    // this.orderService.getOrdersByMerchant(merchantId).subscribe(...)
    
    try {
      // Por ahora usamos datos de ejemplo más realistas para el comerciante Ana
      this.orders = this.fetchOrdersForMerchant();
      this.applyFilters();
      this.loading = false;
    } catch (error) {
      this.error = 'Error al cargar las ventas';
      this.loading = false;
    }
  }

  //Paginacion
  updateOrders(): void {
    this.totalOrders = this.filteredOrders.length;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.currentOrders = this.filteredOrders.slice(startIndex, endIndex);
  }

  // Método que se llama cuando el usuario cambia de página
  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateOrders();  // Actualizar las órdenes para la nueva página
  }

   // Método para ordenar las órdenes
   sortOrders(key: keyof Order) {
    const direction = this.sortDirection[key]; // Obtener la dirección actual
    this.sortDirection[key] = direction === 1 ? -1 : 1; // Alternar la dirección de ordenación

    this.filteredOrders = [...this.filteredOrders].sort((a, b) => {
      if (key === 'date') {
        // Si la clave es 'date', convertir las fechas dd/mm/aaaa a objetos Date para comparar
        const dateA = this.convertDateStringToDate(a[key]);
        const dateB = this.convertDateStringToDate(b[key]);
        return direction * (dateA.getTime() - dateB.getTime());
      } else {
        // Si no es 'date', comparar como texto o número (en este caso, 'name', 'total', etc.)
        return direction * (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0);
      }
    });
    
    this.updateOrders(); // Actualizar la paginación después de ordenar
  }

  // Método auxiliar para convertir fecha dd/mm/aaaa a Date
  private convertDateStringToDate(dateString: string): Date {
    const parts = dateString.split('/');
    if (parts.length === 3) {
      // dd/mm/aaaa -> new Date(aaaa, mm-1, dd)
      return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    }
    return new Date(dateString); // Fallback
  }

  // Método unificado para aplicar todos los filtros
  applyFilters(): void {
    this.filteredOrders = this.orders.filter(order => {
      // Filtro por estado
      const matchesStatus = !this.selectedStatus || order.status === this.selectedStatus;
      
      // Filtro por búsqueda (nombre de orden, cliente, productos)
      const matchesSearch = !this.searchTerm || 
        order.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.client.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.products.some(product => 
          product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      
      return matchesStatus && matchesSearch;
    });
    
    this.currentPage = 1; // Resetear a la primera página
    this.updateOrders(); // Actualizar la paginación
  }

  // Método para filtrar por estado (mantener compatibilidad)
  filterOrders(): void {
    this.applyFilters();
  }

  // Método para búsqueda
  onSearchChange(): void {
    this.applyFilters();
  }

// Método temporal con datos realistas para el comerciante Ana
fetchOrdersForMerchant(): Order[] {
  // Datos de ejemplo más realistas para mostrar ventas del local de Ana
  const orders: Order[] = [
    {
      id: 1001,
      client: 'María González',
      date: '30/10/2024',
      products: [
        { name: 'Guineos', quantity: 2, price: 1.50, unit: 'libra' }, // 2 lbs de guineo
        { name: 'Tomates', quantity: 1, price: 2.00, unit: 'libra' }
      ],
      name: 'Venta #1001',
      total: (2 * 1.50) + (1 * 2.00),
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
      total: (3 * 0.75) + (2 * 1.25) + (1 * 0.50),
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
      total: (1 * 1.00) + (2 * 0.80) + (1 * 1.50),
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
      total: (4 * 0.60) + (1 * 2.50),
      status: 'Pendiente'
    },
    {
      id: 1005,
      client: 'Sofía Herrera',
      date: '28/10/2024',
      products: [
        { name: 'Guineos', quantity: 3, price: 1.50, unit: 'libra' }, // Otra venta de guineos
        { name: 'Naranjas', quantity: 6, price: 0.40, unit: 'unidad' }
      ],
      name: 'Venta #1005',
      total: (3 * 1.50) + (6 * 0.40),
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
      total: (2 * 1.20) + (1 * 1.00) + (1 * 0.75),
      status: 'En proceso'
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
      total: (4 * 0.90) + (1 * 3.00),
      status: 'Entregado'
    },
    {
      id: 1008,
      client: 'Roberto Silva',
      date: '27/10/2024',
      products: [
        { name: 'Guineos Verdes', quantity: 5, price: 1.20, unit: 'libra' }, // Más guineos
        { name: 'Ñame', quantity: 1, price: 2.00, unit: 'libra' }
      ],
      name: 'Venta #1008',
      total: (5 * 1.20) + (1 * 2.00),
      status: 'Entregado'
    }
  ];

  console.log('📊 Cargadas', orders.length, 'ventas del local de Ana');
  return orders;
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

// Método para descargar la factura como PDF
descargarFactura(): void {
  if (!this.selectedOrder) {
    console.error('No hay orden seleccionada');
    return;
  }

  console.log('🔄 Generando factura para descarga...');
  
  // Crear el contenido HTML de la factura
  const facturaHTML = this.generarHTMLFactura();
  
  // Crear un elemento temporal para la impresión
  const ventanaImpresion = window.open('', '_blank', 'width=800,height=600');
  
  if (ventanaImpresion) {
    ventanaImpresion.document.write(facturaHTML);
    ventanaImpresion.document.close();
    
    // Esperar a que se cargue y luego imprimir
    ventanaImpresion.onload = () => {
      ventanaImpresion.print();
      // Cerrar la ventana después de imprimir (opcional)
      setTimeout(() => {
        ventanaImpresion.close();
      }, 1000);
    };
  } else {
    // Fallback: descargar como archivo HTML
    this.descargarComoHTML(facturaHTML);
  }
}

// Método para generar el HTML de la factura
private generarHTMLFactura(): string {
  const fecha = this.selectedOrder.date; // Ya está en formato dd/mm/aaaa
  
  let productosHTML = '';
  this.selectedOrder.products.forEach((product: any, index: number) => {
    const bgColor = index % 2 === 0 ? 'white' : '#f9f9f9';
    const unitAbbr = this.getUnitAbbreviation(product.unit);
    productosHTML += `
      <tr style="background-color: ${bgColor};">
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${product.name}</td>
        <td style="padding: 8px; text-align: center; border-bottom: 1px solid #eee;">${product.quantity} ${unitAbbr}</td>
        <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">$${product.price.toFixed(2)}/${unitAbbr}</td>
        <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee; font-weight: bold;">
          $${(product.quantity * product.price).toFixed(2)}
        </td>
      </tr>
    `;
  });

  const estadoColor = this.getEstadoColor(this.selectedOrder.status);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Factura ${this.selectedOrder.id} - Cosechando</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #385723; padding-bottom: 20px; }
        .company-name { color: #385723; font-size: 28px; font-weight: bold; margin: 0; }
        .company-desc { color: #572C1A; font-size: 16px; margin: 5px 0; }
        .company-contact { color: #666; font-size: 14px; margin: 0; }
        .invoice-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .invoice-to, .invoice-details { width: 45%; }
        .section-title { color: #385723; font-weight: bold; margin-bottom: 10px; font-size: 16px; }
        .products-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .products-table th { background-color: #385723; color: white; padding: 12px 8px; text-align: left; }
        .products-table td { padding: 10px 8px; border-bottom: 1px solid #eee; }
        .totals { text-align: right; margin-top: 20px; }
        .total-final { font-size: 20px; font-weight: bold; color: #385723; border-top: 2px solid #385723; padding-top: 10px; }
        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        .status-badge { padding: 4px 8px; border-radius: 4px; color: white; font-size: 12px; font-weight: bold; text-transform: uppercase; }
        @media print { body { margin: 0; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 class="company-name">COSECHANDO</h1>
        <p class="company-desc">Mercado de Productos Frescos</p>
        <p class="company-contact">Tel: (507) 123-4567 | Email: info@cosechando.com</p>
      </div>

      <div class="invoice-info">
        <div class="invoice-to">
          <h3 class="section-title">FACTURAR A:</h3>
          <p><strong>${this.selectedOrder.client}</strong></p>
          <p>Cliente registrado</p>
        </div>
        <div class="invoice-details">
          <h3 class="section-title">FACTURA</h3>
          <p><strong>No. ${this.selectedOrder.id}</strong></p>
          <p>Fecha: ${fecha}</p>
          <p><span class="status-badge" style="background-color: ${estadoColor};">${this.selectedOrder.status}</span></p>
        </div>
      </div>

      <h3 class="section-title">DETALLE DE PRODUCTOS</h3>
      <table class="products-table">
        <thead>
          <tr>
            <th>DESCRIPCIÓN</th>
            <th style="text-align: center;">CANT.</th>
            <th style="text-align: right;">PRECIO UNIT.</th>
            <th style="text-align: right;">IMPORTE</th>
          </tr>
        </thead>
        <tbody>
          ${productosHTML}
        </tbody>
      </table>

      <div class="totals">
        <p>Subtotal: $${this.selectedOrder.total.toFixed(2)}</p>
        <p>Impuestos: $0.00</p>
        <p class="total-final">TOTAL: $${this.selectedOrder.total.toFixed(2)}</p>
      </div>

      <div class="footer">
        <p><strong>Términos y Condiciones:</strong> Productos frescos del día • Garantía de calidad</p>
        <p>¡Gracias por elegir Cosechando! - Productos frescos, directamente del campo a tu mesa</p>
      </div>
    </body>
    </html>
  `;
}

// Método para obtener el color del estado
private getEstadoColor(status: string): string {
  switch (status) {
    case 'Entregado': return '#7fad39';
    case 'Pendiente': return '#7F6000';
    case 'En proceso': return '#385723';
    case 'No Retirado': return '#572C1A';
    default: return '#6c757d';
  }
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

// Método fallback para descargar como HTML
private descargarComoHTML(contenido: string): void {
  const blob = new Blob([contenido], { type: 'text/html' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Factura_${this.selectedOrder.id}_${this.selectedOrder.client.replace(/\s+/g, '_')}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  
  console.log('✅ Factura descargada como archivo HTML');
}

}
