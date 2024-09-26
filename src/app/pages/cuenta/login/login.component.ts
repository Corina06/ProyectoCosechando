import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email: string = '';
  password: string = '';

  constructor(private authService: AuthService) {}

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login exitoso', response);
        // Aquí puedes redirigir al usuario o mostrar un mensaje
      },
      error: (error) => {
        console.error('Error en login', error);
        // Maneja el error de login
      }
    });
  }
  
}
