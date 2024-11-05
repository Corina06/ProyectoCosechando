import { Component, NgModule } from '@angular/core';
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

export class OrdenComponent {

  orders: Order[] = []; // Aquí van tus órdenes
  sortedOrders: Order[] = [];
  sortDirection: { [key: string]: number } = { name: 1, date: 1, total: 1, status: 1 };
  
  filteredOrders: Order[] = [];
    selectedStatus: string = '';

    currentPage: number = 1; 
    pageSize: number = 10;    
    totalOrders: number = 0; 

    constructor() {
    
      this.orders = this.fetchOrders(); 
      this.sortedOrders = this.orders;
      this.filteredOrders = this.orders; 
      this.selectedStatus = ''; 
      this.filterOrders();
  }

  filterOrders() {
    if (this.selectedStatus === '') {
        // Si no hay estado seleccionado, mostrar todas las órdenes
        this.filteredOrders = this.orders;
    } else {
        // Filtrar las órdenes por el estado seleccionado
        this.filteredOrders = this.orders.filter(order => order.status === this.selectedStatus);
    }
    console.log('Filtered Orders:', this.filteredOrders); // Para verificar los resultados
}

fetchOrders(): Order[] {
    // Aquí debes implementar la lógica para obtener tus órdenes
    const orders =[
        { name: 'Orden 1', date: '2024-01-01', total: 100, status: 'Entregado' },
        { name: 'Orden 2', date: '2024-01-02', total: 150, status: 'Pendiente' },
        { name: 'Orden 3', date: '2024-01-03', total: 200, status: 'No Retirado' },
        { name: 'Orden 4', date: '2024-01-04', total: 250, status: 'Entregado' },
        { name: 'Orden 5', date: '2024-01-05', total: 300, status: 'Pendiente' },
        { name: 'Orden 6', date: '2024-01-06', total: 350, status: 'No Retirado' },
        { name: 'Orden 7', date: '2024-01-07', total: 400, status: 'Entregado' },
        { name: 'Orden 8', date: '2024-01-08', total: 450, status: 'Pendiente' },
        { name: 'Orden 9', date: '2024-01-09', total: 500, status: 'No Retirado' },
        { name: 'Orden 10', date: '2024-01-10', total: 550, status: 'Entregado' },
        { name: 'Orden 11', date: '2024-01-11', total: 600, status: 'Pendiente' },
        { name: 'Orden 12', date: '2024-01-12', total: 650, status: 'No Retirado' },
        { name: 'Orden 13', date: '2024-01-13', total: 700, status: 'Entregado' },
        { name: 'Orden 14', date: '2024-01-14', total: 750, status: 'Pendiente' },
        { name: 'Orden 15', date: '2024-01-15', total: 800, status: 'No Retirado' },
        { name: 'Orden 16', date: '2024-01-16', total: 850, status: 'Entregado' },
        { name: 'Orden 17', date: '2024-01-17', total: 900, status: 'Pendiente' },
        { name: 'Orden 18', date: '2024-01-18', total: 950, status: 'No Retirado' },
        { name: 'Orden 19', date: '2024-01-19', total: 1000, status: 'Entregado' },
        { name: 'Orden 20', date: '2024-01-20', total: 1050, status: 'Pendiente' },
      
        // Agrega más órdenes aquí
    ];
    console.log('Fetched Orders:', orders);
    return orders;
}


}
