import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email: string = '';
  password: string = '';

  constructor(private authService: AuthService) {}

  onLogin() {
    this.authService.login(this.email, this.password).subscribe({
       next: (response) => {
         // Lógica de autenticación
         console.log('Login exitoso', response);
         
         // Redirige al panel después del login exitoso
         //this.router.navigate(['/panel']); 
       },
       error: (error) => {
         console.error('Error en Iniciar Sesion', error);
         // Maneja el error de login
       }
     });
  }
 
}
