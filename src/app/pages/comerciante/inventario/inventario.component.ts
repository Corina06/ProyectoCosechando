import { Component } from '@angular/core';
import { NavcomerComponent } from "../navcomer/navcomer.component";
import { jsPDF} from "jspdf"
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [NavcomerComponent, CommonModule],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent {

  productos = [
    { id: 1, nombre: 'Manzana', descripcion: 'Manzana Roja Fresca', categoria: 'Frutas', cantidad: 100, precio: 1.2 },
    { id: 2, nombre: 'Banano', descripcion: 'Banano Amarillo Maduro', categoria: 'Frutas', cantidad: 200, precio: 0.5 },
    { id: 3, nombre: 'Pera', descripcion: 'Pera de la variedad Williams', categoria: 'Frutas', cantidad: 150, precio: 1.0 },
    { id: 4, nombre: 'Naranja', descripcion: 'Naranja de Sumo', categoria: 'Frutas', cantidad: 80, precio: 1.5 },
    { id: 5, nombre: 'Papaya', descripcion: 'Papaya fresca de la región', categoria: 'Frutas', cantidad: 120, precio: 2.0 },
    { id: 6, nombre: 'Lechuga', descripcion: 'Lechuga fresca y orgánica', categoria: 'Vegetales', cantidad: 250, precio: 1.0 },
    { id: 7, nombre: 'Espinaca', descripcion: 'Espinaca de hoja verde', categoria: 'Vegetales', cantidad: 180, precio: 1.5 },
    { id: 8, nombre: 'Pepino', descripcion: 'Pepino fresco y crujiente', categoria: 'Vegetales', cantidad: 300, precio: 0.8 },
    { id: 9, nombre: 'Tomate', descripcion: 'Tomate rojo maduro', categoria: 'Vegetales', cantidad: 100, precio: 1.2 },
    { id: 10, nombre: 'Zanahoria', descripcion: 'Zanahorias frescas', categoria: 'Vegetales', cantidad: 200, precio: 0.6 },
    { id: 11, nombre: 'Papa', descripcion: 'Papa amarilla de campo', categoria: 'Raíces', cantidad: 400, precio: 0.9 },
    { id: 12, nombre: 'Yuca', descripcion: 'Yuca fresca y cocinable', categoria: 'Raíces', cantidad: 150, precio: 1.5 },
    { id: 13, nombre: 'Ñame', descripcion: 'Ñame de campo', categoria: 'Raíces', cantidad: 120, precio: 2.2 },
    { id: 14, nombre: 'Betabel', descripcion: 'Betabel orgánico', categoria: 'Raíces', cantidad: 80, precio: 1.8 },
    { id: 15, nombre: 'Apio', descripcion: 'Apio fresco y crujiente', categoria: 'Raíces', cantidad: 50, precio: 1.3 },
    { id: 16, nombre: 'Guisante', descripcion: 'Guisantes verdes', categoria: 'Legumbres', cantidad: 200, precio: 1.0 },
    { id: 17, nombre: 'Frijol', descripcion: 'Frijoles negros', categoria: 'Legumbres', cantidad: 300, precio: 1.4 },
    { id: 18, nombre: 'Lenteja', descripcion: 'Lentejas de alta calidad', categoria: 'Legumbres', cantidad: 100, precio: 2.0 },
    { id: 19, nombre: 'Arveja', descripcion: 'Arvejas frescas', categoria: 'Legumbres', cantidad: 150, precio: 1.3 },
    { id: 20, nombre: 'Garbanzo', descripcion: 'Garbanzo seco', categoria: 'Legumbres', cantidad: 250, precio: 1.5 }
  ];

  // Método para descargar un solo producto en formato PDF
  downloadProductPDF(item: any) {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    
    // Título del producto
    doc.setTextColor(0, 0, 255); // Color azul
    doc.text(`Producto: ${item.nombre}`, 10, 10);
    
    // Descripción del producto
    doc.setTextColor(0, 0, 0); // Texto negro
    doc.text(`Descripción: ${item.descripcion}`, 10, 20);
    doc.text(`Categoría: ${item.categoria}`, 10, 30);
    doc.text(`Cantidad: ${item.cantidad}`, 10, 40);
    doc.text(`Precio: ${item.precio} USD`, 10, 50);
    
    // Descargar el PDF con el nombre del producto
    doc.save(`${item.nombre}_Detalles.pdf`);
  }

   // Método para descargar todo el inventario en un solo archivo PDF
   downloadInventoryPDF() {
    const doc = new jsPDF();
    let yPosition = 20;

    // Título del inventario
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 255); // Título en azul
    doc.text('Inventario Completo', 10, yPosition);
    yPosition += 10; // Dejar espacio después del título

    // Encabezados de la tabla
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0); // Texto en negro
    doc.setFontSize(12);

    const headers = ['ID', 'Nombre', 'Descripción', 'Categoría', 'Cantidad', 'Precio'];

    const colWidths = [20, 40, 60, 40, 30, 30]; // Anchos de las columnas

    // Dibujamos la tabla con bordes
    let startX = 10;
    let startY = yPosition;
    const tableHeight = 8;

    // Dibujar encabezados
    doc.setFillColor(230, 230, 230); // Fondo gris claro para las cabeceras
    doc.rect(startX, startY, colWidths[0], tableHeight, 'F');
    doc.rect(startX + colWidths[0], startY, colWidths[1], tableHeight, 'F');
    doc.rect(startX + colWidths[0] + colWidths[1], startY, colWidths[2], tableHeight, 'F');
    doc.rect(startX + colWidths[0] + colWidths[1] + colWidths[2], startY, colWidths[3], tableHeight, 'F');
    doc.rect(startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], startY, colWidths[4], tableHeight, 'F');
    doc.rect(startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], startY, colWidths[5], tableHeight, 'F');

    headers.forEach((header, index) => {
      doc.text(header, startX + colWidths.slice(0, index).reduce((acc, val) => acc + val, 0) + 5, startY + 5);
    });

    yPosition += tableHeight; // Dejar más espacio después de los encabezados

    // Dibujar filas de productos
    this.productos.forEach((item, index) => {
      // Verificar si el índice actual está fuera del límite de la página (evitar sobrecargar la página)
      if (yPosition > 270) { // Si se llega al final de la página
        doc.addPage(); // Añadir una nueva página
        yPosition = 20; // Resetear la posición y al comienzo de la nueva página
        doc.setFontSize(12);
        // Redibujar los encabezados en la nueva página
        headers.forEach((header, index) => {
          doc.text(header, startX + colWidths.slice(0, index).reduce((acc, val) => acc + val, 0) + 5, yPosition + 5);
        });
        yPosition += tableHeight;
      }

      // Dibujar cada fila del producto
      doc.rect(startX, yPosition, colWidths[0], tableHeight); // ID
      doc.rect(startX + colWidths[0], yPosition, colWidths[1], tableHeight); // Nombre
      doc.rect(startX + colWidths[0] + colWidths[1], yPosition, colWidths[2], tableHeight); // Descripción
      doc.rect(startX + colWidths[0] + colWidths[1] + colWidths[2], yPosition, colWidths[3], tableHeight); // Categoría
      doc.rect(startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], yPosition, colWidths[4], tableHeight); // Cantidad
      doc.rect(startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], yPosition, colWidths[5], tableHeight); // Precio

      doc.text(item.id.toString(), startX + 5, yPosition + 5);
      doc.text(item.nombre, startX + colWidths[0] + 5, yPosition + 5);
      doc.text(item.descripcion, startX + colWidths[0] + colWidths[1] + 5, yPosition + 5);
      doc.text(item.categoria, startX + colWidths[0] + colWidths[1] + colWidths[2] + 5, yPosition + 5);
      doc.text(item.cantidad.toString(), startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 5, yPosition + 5);
      doc.text(item.precio.toFixed(2), startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + 5, yPosition + 5);

      yPosition += tableHeight;
    });

    // Descargar el archivo PDF
    doc.save('inventario.pdf');
  }
}


