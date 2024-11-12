import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavcomerComponent } from "../navcomer/navcomer.component";
import { jsPDF } from 'jspdf';
import { Compra, Producto } from '../../../models/compra.model';
import 'jspdf-autotable';  // Importa el módulo autoTable para usarlo



@Component({
  selector: 'app-compra',
  standalone: true,
  imports: [CommonModule, NavcomerComponent, FormsModule],
  templateUrl: './compra.component.html',
  styleUrl: './compra.component.css'
})
export class CompraComponent implements OnInit {

  compras: Compra[] = [
    {
      id: 1,
      proveedor: 'Proveedor A',
      fecha: new Date(),
      estado: 'Recibido',
      metodoPago: 'Transferencia',
      factura: 'FAC12345',
      productos: [
        { nombre: 'Producto X', cantidad: 100, precio: 50.00, subtotal: 50.00 * 100 },  // Calculamos el subtotal
        { nombre: 'Producto Y', cantidad: 50, precio: 100.00, subtotal: 100.00 * 50 }   // Calculamos el subtotal
      ],
      total: 10000.00  // Total de la compra
    },
    {
      id: 2,
      proveedor: 'Proveedor B',
      fecha: new Date(),
      estado: 'Pendiente',
      metodoPago: 'Efectivo',
      factura: 'FAC12346',
      productos: [
        { nombre: 'Producto Z', cantidad: 30, precio: 200.00, subtotal: 200.00 * 30 }
      ],
      total: 6000.00
    }
  ];

  showModal = false;  // Controla la visibilidad del modal
  selectedCompra: any;

  constructor() {}

  ngOnInit(): void {}
  

  showAddModal = false; // Modal para agregar compra
  newCompra: any = {
    proveedor: '',
    fecha: '',
    metodoPago: '',
    total: 0,
    estado: 'Pendiente',
    productos: [{ nombre: '', cantidad: 1, precio: 0 }]
  }; // Nueva compra

  // Abrir modal de agregar compra
  openAddPurchaseModal() {
    this.showAddModal = true;
  }

  // Cerrar modal de agregar compra
  closeAddModal() {
    this.showAddModal = false;
    this.resetNewCompra(); // Resetear el formulario al cerrar
  }

  // Función para agregar un producto vacío al formulario
  addProduct() {
    this.newCompra.productos.push({ nombre: '', cantidad: 1, precio: 0 });
  }

  // Eliminar producto del formulario
  removeProduct(index: number) {
    this.newCompra.productos.splice(index, 1);
  }

  // Función para enviar los datos de la nueva compra
  submitAddPurchase() {
    // Aquí puedes agregar la lógica para guardar la compra en el servidor
    console.log('Compra agregada:', this.newCompra);

    // Agregar la nueva compra a la lista de compras
    this.compras.push(this.newCompra);

    // Cerrar el modal y resetear el formulario
    this.closeAddModal();
  }

  // Resetear los campos del formulario de nueva compra
  resetNewCompra() {
    this.newCompra = {
      proveedor: '',
      fecha: '',
      metodoPago: '',
      total: 0,
      estado: 'Pendiente',
      productos: [{ nombre: '', cantidad: 1, precio: 0 }]
    };
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
}

