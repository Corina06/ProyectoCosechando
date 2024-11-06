import { ProductService } from './../../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { NavcomerComponent } from '../navcomer/navcomer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Order } from '../../../models/order.model';
import { PaginacionComponent } from '../../../componentes/paginacion/paginacion.component';

type OrderKey = keyof Order;

@Component({
  selector: 'app-orden',
  standalone: true,
  imports: [NavcomerComponent, CommonModule, FormsModule],
  templateUrl: './orden.component.html',
  styleUrl: './orden.component.css'
})

export class OrdenComponent implements OnInit{

  orders: Order[] = []; // Aquí van tus órdenes
  sortedOrders: Order[] = [];
  sortDirection: { [key in keyof Order]: number } = { name: 1, date: 1, total: 1, status: 1 };
  selectedOrder: any; 
  
  filteredOrders: Order[] = [];
    selectedStatus: string = '';

    currentPage: number = 1; 
    pageSize: number = 10;    
    totalOrders: number = 0; 

    constructor(private productService: ProductService) {
    
      this.orders = this.fetchOrders(); 
      this.sortedOrders = this.orders;
      this.filteredOrders = this.orders; 
      this.selectedStatus = ''; 
      this.filterOrders();
  }

  ngOnInit(): void {
    // Obtener las órdenes cuando el componente se inicializa
    this.orders = this.productService.getOrders(); // Asumimos que ProductService tiene este método
  }

   // Método para ordenar las órdenes
   sortOrders(key: keyof Order) {
    const direction = this.sortDirection[key]; // Obtener la dirección actual
    this.sortDirection[key] = direction === 1 ? -1 : 1; // Alternar la dirección de ordenación

    this.sortedOrders = [...this.filteredOrders].sort((a, b) => {
      if (key === 'date') {
        // Si la clave es 'date', convertir las fechas a objetos Date para comparar
        const dateA = new Date(a[key]);
        const dateB = new Date(b[key]);
        return direction * (dateA.getTime() - dateB.getTime());
      } else {
        // Si no es 'date', comparar como texto o número (en este caso, 'name', 'total', etc.)
        return direction * (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0);
      }
    });
  }

  //Metodo para filtrar por estado
  filterOrders() {
    if (this.selectedStatus === '') {
        // Si no hay estado seleccionado, mostrar todas las órdenes
        this.filteredOrders = this.orders;
    } else {
        // Filtrar las órdenes por el estado seleccionado
        this.filteredOrders = this.orders.filter(order => order.status === this.selectedStatus);
    }
    this.sortOrders('date'); 
    console.log('Filtered Orders:', this.filteredOrders); // Para verificar los resultados
}

fetchOrders(): Order[] {
  const orders: Order[] = [
    {
      id: 1,
      client: 'Cliente A',
      date: '2024-01-01',
      products: [
        { name: 'Producto 1', quantity: 3 },
        { name: 'Producto 2', quantity: 2 }
      ],
      name: 'Orden 1',        // Aquí asignas el nombre de la orden
      total: 100,            // Aquí asignas el total de la orden
      status: 'Entregado'    // Aquí asignas el estado de la orden
    },
    {
      id: 2,
      client: 'Cliente B',
      date: '2024-01-02',
      products: [
        { name: 'Producto 3', quantity: 1 },
        { name: 'Producto 4', quantity: 4 }
      ],
      name: 'Orden 2',
      total: 150,
      status: 'Pendiente'
    },
    // Agrega más órdenes aquí...
  ];
  console.log('Fetched Orders:', orders);
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

}
