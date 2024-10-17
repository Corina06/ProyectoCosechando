import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from '../nav/nav.component';
import { FilterPipe } from '../../../componentes/filter.pipe';

type Product = {
  name: string;
  category: string;
  price: number;
  image: string;
};

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [NavComponent,CommonModule, FilterPipe],
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})

export class ProductoComponent {
  selectedFilter: string = 'Todos';

  //Agregar productos
  products: Product[] = [
    { name: 'Fresa', category: 'Frutas', price: 30.00, image: 'fresa.jpg' },
    { name: 'Maíz', category: 'Legumbres', price: 20.00, image: 'maiz.jpg' },
    { name: 'Brócoli', category: 'Verduras', price: 25.00, image: 'brocoli.jpg' },
    { name: 'Yuca', category: 'Raíces', price: 15.00, image: 'yuca.jpg' },
    { name: 'Ají', category: 'Verduras', price: 10.00, image: 'aji.jpg' },
    { name: 'Manzana', category: 'Frutas', price: 12.00, image: 'manzana.jpg' },
    { name: 'Guandú', category: 'Legumbres', price: 18.00, image: 'guandu.jpg' },
    { name: 'Banana', category: 'Frutas', price: 22.00, image: 'banana1.jpg' },
    { name: 'Naranja', category: 'Frutas', price: 12.00, image: 'naranja.jpg' },
  ];

  getFilteredProducts() {
    return this.selectedFilter === 'Todos' ? this.products : this.products.filter(product => product.category === this.selectedFilter);
  }

   // Filtro
   setFilter(filter: string) {
    this.selectedFilter = filter;
  }

}
