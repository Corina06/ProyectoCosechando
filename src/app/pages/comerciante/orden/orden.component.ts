import { Component, NgModule } from '@angular/core';
import { NavcomerComponent } from '../navcomer/navcomer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orden',
  standalone: true,
  imports: [NavcomerComponent, CommonModule],
  templateUrl: './orden.component.html',
  styleUrl: './orden.component.css'
})
export class OrdenComponent {
  // Aquí puedes definir tus datos
  orders = [
    { name: 'Robert Fox', date: 'Feb 15, 2021', total: 3500, status: 'Entregado' },
    { name: 'Theresa Webb', date: 'Mar 20, 2021', total: 4200, status: 'Entregado' },
    { name: 'Cody Fisher', date: 'Apr 10, 2021', total: 1500, status: 'No Retirado' },
    { name: 'Darlene Robertson', date: 'Apr 15, 2021', total: 2750, status: 'Pendiente' },
  ];

  // Variable para controlar el orden
  sortOrder = { column: '', direction: 'asc' };

  // Define un tipo para las claves
  private readonly validColumns: Array<keyof typeof this.orders[0]> = ['name', 'date', 'total', 'status'];

  sortTable(column: keyof typeof this.orders[0]) {
    // Cambia la dirección si la misma columna se está ordenando
    if (this.sortOrder.column === column) {
      this.sortOrder.direction = this.sortOrder.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortOrder.column = column;
      this.sortOrder.direction = 'asc';
    }

    // Ordena los datos
    this.orders.sort((a, b) => {
      const compareA = a[column];
      const compareB = b[column];

      if (this.sortOrder.direction === 'asc') {
        return compareA < compareB ? -1 : compareA > compareB ? 1 : 0;
      } else {
        return compareA > compareB ? -1 : compareA < compareB ? 1 : 0;
      }
    });
  }
}
