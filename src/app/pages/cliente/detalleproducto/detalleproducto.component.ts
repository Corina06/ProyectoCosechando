import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-detalleproducto',
  standalone: true,
  imports: [NavComponent, CommonModule],
  templateUrl: './detalleproducto.component.html',
  styleUrl: './detalleproducto.component.css'
})
export class DetalleproductoComponent implements OnInit{
  product: Product | null = null;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.currentProduct.subscribe(data => {
      console.log('Detalles del producto recibidos:', data); 
      this.product = data; // Obtiene el producto almacenado en el servicio
    });
  }
}
