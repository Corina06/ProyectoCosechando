import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navcomer',
  standalone: true,
  imports: [],
  templateUrl: './navcomer.component.html',
  styleUrl: './navcomer.component.css'
})
export class NavcomerComponent {

  constructor( 
    private router: Router  ) {}
    
  navigateToInicio() {
    console.log('Navegando a inicio');
    this.router.navigate(['/inicio']);
  }
}
