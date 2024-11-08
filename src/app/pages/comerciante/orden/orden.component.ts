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

    currentPage: number = 1; 
    itemsPerPage: number = 5;    
    totalOrders: number = 0; 

    currentOrders: Order[] = [];

    constructor(private productService: ProductService) {
    
      this.orders = this.fetchOrders(); 
      this.sortedOrders = this.orders;
      this.filteredOrders = this.orders; 
      this.selectedStatus = ''; 
      this.filterOrders();
  }

  ngOnInit(): void {
    // Obtener las órdenes cuando el componente se inicializa
    this.updateOrders();
  }

  //Paginacion
  updateOrders(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.currentOrders = this.orders.slice(startIndex, endIndex);
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
        { name: 'Producto 1', quantity: 3, price: 20 },
        { name: 'Producto 2', quantity: 2, price: 15 }
      ],
      name: 'Orden 1',
      total: (3 * 20) + (2 * 15), // Total calculado
      status: 'Entregado'
    },
    {
      id: 2,
      client: 'Cliente B',
      date: '2024-01-02',
      products: [
        { name: 'Producto 3', quantity: 1, price: 40 },
        { name: 'Producto 4', quantity: 4, price: 27 }
      ],
      name: 'Orden 2',
      total: (1 * 40) + (4 * 27), // Total calculado
      status: 'Pendiente'
    },
    {
      id: 3,
      client: 'Cliente C',
      date: '2024-01-03',
      products: [
        { name: 'Producto 1', quantity: 5, price: 20 },
        { name: 'Producto 5', quantity: 3, price: 50 }
      ],
      name: 'Orden 3',
      total: (5 * 20) + (3 * 50), // Total calculado
      status: 'En proceso'
    },
    {
      id: 4,
      client: 'Cliente D',
      date: '2024-01-04',
      products: [
        { name: 'Producto 6', quantity: 2, price: 35 },
        { name: 'Producto 7', quantity: 1, price: 60 }
      ],
      name: 'Orden 4',
      total: (2 * 35) + (1 * 60), // Total calculado
      status: 'Entregado'
    },
    {
      id: 5,
      client: 'Cliente E',
      date: '2024-01-05',
      products: [
        { name: 'Producto 2', quantity: 1, price: 15 },
        { name: 'Producto 8', quantity: 4, price: 30 }
      ],
      name: 'Orden 5',
      total: (1 * 15) + (4 * 30), // Total calculado
      status: 'Pendiente'
    },
    {
      id: 6,
      client: 'Cliente F',
      date: '2024-01-06',
      products: [
        { name: 'Producto 9', quantity: 2, price: 25 },
        { name: 'Producto 10', quantity: 3, price: 20 }
      ],
      name: 'Orden 6',
      total: (2 * 25) + (3 * 20), // Total calculado
      status: 'En proceso'
    },
    {
      id: 7,
      client: 'Cliente G',
      date: '2024-01-07',
      products: [
        { name: 'Producto 1', quantity: 4, price: 20 },
        { name: 'Producto 11', quantity: 2, price: 40 }
      ],
      name: 'Orden 7',
      total: (4 * 20) + (2 * 40), // Total calculado
      status: 'Entregado'
    },
    {
      id: 8,
      client: 'Cliente H',
      date: '2024-01-08',
      products: [
        { name: 'Producto 3', quantity: 1, price: 40 },
        { name: 'Producto 12', quantity: 5, price: 25 }
      ],
      name: 'Orden 8',
      total: (1 * 40) + (5 * 25), // Total calculado
      status: 'Pendiente'
    },
    {
      id: 9,
      client: 'Cliente I',
      date: '2024-01-09',
      products: [
        { name: 'Producto 4', quantity: 2, price: 27 },
        { name: 'Producto 13', quantity: 3, price: 30 }
      ],
      name: 'Orden 9',
      total: (2 * 27) + (3 * 30), // Total calculado
      status: 'En proceso'
    },
    {
      id: 10,
      client: 'Cliente J',
      date: '2024-01-10',
      products: [
        { name: 'Producto 5', quantity: 4, price: 50 },
        { name: 'Producto 14', quantity: 1, price: 70 }
      ],
      name: 'Orden 10',
      total: (4 * 50) + (1 * 70), // Total calculado
      status: 'Entregado'
    },
    {
      id: 11,
      client: 'Cliente K',
      date: '2024-01-11',
      products: [
        { name: 'Producto 2', quantity: 3, price: 15 },
        { name: 'Producto 15', quantity: 2, price: 45 }
      ],
      name: 'Orden 11',
      total: (3 * 15) + (2 * 45), // Total calculado
      status: 'Pendiente'
    },
    {
      id: 12,
      client: 'Cliente L',
      date: '2024-01-12',
      products: [
        { name: 'Producto 6', quantity: 5, price: 35 },
        { name: 'Producto 16', quantity: 3, price: 55 }
      ],
      name: 'Orden 12',
      total: (5 * 35) + (3 * 55), // Total calculado
      status: 'En proceso'
    },
    {
      id: 13,
      client: 'Cliente M',
      date: '2024-01-13',
      products: [
        { name: 'Producto 7', quantity: 2, price: 60 },
        { name: 'Producto 17', quantity: 4, price: 25 }
      ],
      name: 'Orden 13',
      total: (2 * 60) + (4 * 25), // Total calculado
      status: 'Entregado'
    },
    {
      id: 14,
      client: 'Cliente N',
      date: '2024-01-14',
      products: [
        { name: 'Producto 3', quantity: 3, price: 40 },
        { name: 'Producto 18', quantity: 2, price: 50 }
      ],
      name: 'Orden 14',
      total: (3 * 40) + (2 * 50), // Total calculado
      status: 'Pendiente'
    },
    {
      id: 15,
      client: 'Cliente O',
      date: '2024-01-15',
      products: [
        { name: 'Producto 8', quantity: 4, price: 30 },
        { name: 'Producto 19', quantity: 1, price: 90 }
      ],
      name: 'Orden 15',
      total: (4 * 30) + (1 * 90), // Total calculado
      status: 'En proceso'
    },
    {
      id: 16,
      client: 'Cliente P',
      date: '2024-01-16',
      products: [
        { name: 'Producto 9', quantity: 3, price: 25 },
        { name: 'Producto 20', quantity: 3, price: 35 }
      ],
      name: 'Orden 16',
      total: (3 * 25) + (3 * 35), // Total calculado
      status: 'Entregado'
    },
    {
      id: 17,
      client: 'Cliente Q',
      date: '2024-01-17',
      products: [
        { name: 'Producto 10', quantity: 2, price: 20 },
        { name: 'Producto 21', quantity: 1, price: 80 }
      ],
      name: 'Orden 17',
      total: (2 * 20) + (1 * 80), // Total calculado
      status: 'Pendiente'
    },
    {
      id: 18,
      client: 'Cliente R',
      date: '2024-01-18',
      products: [
        { name: 'Producto 11', quantity: 1, price: 55 },
        { name: 'Producto 22', quantity: 4, price: 40 }
      ],
      name: 'Orden 18',
      total: (1 * 55) + (4 * 40), // Total calculado
      status: 'En proceso'
    },
    {
      id: 19,
      client: 'Cliente S',
      date: '2024-01-19',
      products: [
        { name: 'Producto 12', quantity: 2, price: 45 },
        { name: 'Producto 23', quantity: 3, price: 30 }
      ],
      name: 'Orden 19',
      total: (2 * 45) + (3 * 30), // Total calculado
      status: 'Entregado'
    },
    {
      id: 20,
      client: 'Cliente T',
      date: '2024-01-20',
      products: [
        { name: 'Producto 13', quantity: 5, price: 30 },
        { name: 'Producto 24', quantity: 2, price: 75 }
      ],
      name: 'Orden 20',
      total: (5 * 30) + (2 * 75), // Total calculado
      status: 'Pendiente'
    }
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
