import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { SearchService } from '../../../services/search.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {
  cartItemCount$: Observable<number>;
  searchTerm: string = '';

  constructor(
    private cartService: CartService,
    private searchService: SearchService,
    private router: Router
  ) {
    this.cartItemCount$ = this.cartService.cartItemCount$;
  }

  ngOnInit(): void {
    // Suscribirse a cambios en el término de búsqueda
    this.searchService.searchTerm$.subscribe(term => {
      this.searchTerm = term;
    });
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.searchService.setSearchTerm(this.searchTerm.trim());
      // Navegar a la página de productos si no estamos ya ahí
      if (this.router.url !== '/producto') {
        this.router.navigate(['/producto']);
      }
    } else {
      // Si el campo está vacío, limpiar la búsqueda
      this.searchService.clearSearch();
    }
  }



  clearSearch(): void {
    this.searchTerm = '';
    this.searchService.clearSearch();
  }

  // Método de prueba para verificar que el clic funcione
  onUserIconClick(): void {
    console.log('Icono de usuario clickeado');
    this.router.navigate(['/login']);
  }
}
