import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginResponse } from '../../../models/login-response.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email: string = '';
  password: string = '';

  isModalOpen: boolean =  false;
  emailError: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, 
    private router: Router) { }

  onLogin() {
    console.log("Intentando iniciar sesión...");
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
       next: (response) => {
        
         // Lógica de autenticación
         console.log('Login exitoso', response);
         
         // Si el login es exitoso, almacenar el token y redirigir al panel
        const token = response.token;
        this.authService.storeToken(token);
         // Redirige al panel después del login exitoso
         this.router.navigate(['/panel']); 
       },
       // Maneja el error de login
       error: (error) => {
         console.error('Error en Iniciar Sesion', error);
         alert('Correo o contraseña incorrectos');
         
       }
     });
  }
  
  openModal(event: Event): void {
    event.preventDefault();
    this.isModalOpen = true; // Abrir el modal
  }

   // Función para manejar el envío de la recuperación de contraseña
   onRecoverPassword() {
    this.emailError = ''; // Limpiar el error anterior
    this.successMessage = ''; // Limpiar el mensaje de éxito anterior

    // Validar si el correo está vacío o tiene un formato inválido
    if (!this.email) {
      this.emailError = 'Por favor ingresa tu correo electrónico.';
      return;
    }

    // Expresión regular para validar el formato del correo electrónico
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(this.email)) {
      this.emailError = 'Por favor ingresa un correo electrónico válido.';
      return;
    }

    // Llamada al servicio para enviar el enlace de recuperación (aquí puedes simular la API)
    this.sendPasswordResetRequest(this.email);
  }

  // Simulación de la llamada a un servicio para enviar el correo de recuperación
  sendPasswordResetRequest(email: string) {
    // Aquí deberías hacer la llamada a tu servicio que maneja la recuperación
    // Simularemos una respuesta exitosa
    setTimeout(() => {
      // Simulamos que el servicio devuelve una respuesta positiva
      const isSuccess = true; // Cambia esto según la respuesta real de la API
      if (isSuccess) {
        this.successMessage = '¡Hemos enviado un enlace a tu correo para restablecer tu contraseña!';
        this.email = ''; // Limpiar el campo de correo después de enviar
      } else {
        this.emailError = 'Hubo un problema al enviar el enlace. Intenta de nuevo más tarde.';
      }
    }, 1500); // Simulamos que la API tarda 1.5 segundos
  }

  // Función para cerrar el modal
  closeModal() {
    this.isModalOpen = false;
  }

  // Este método se puede llamar en lugar de usar routerLink
  goToPanel() {
    this.router.navigate(['/panel']);
  }
}
