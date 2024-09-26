import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  // Aquí puedes definir propiedades del componente
  name: string = '';
  apellido: string = '';
  email: string = '';
  direccion: string = '';
  local: string = '';
  puesto: string = '';
  celular: number = 0;
  fecha: Date = new Date();
  banco: string = '';
  tipo: string = '';
  cuenta: number = 0;
  password: string = '';
  // Aquí puedes definir métodos del componente

  constructor(private authService: AuthService) {}

  register() {
    // Lógica para manejar el envío del formulario
    const userData = {
      name: this.name,
      apellido: this.apellido, 
      email: this.email,
      direccion: this.direccion,
      local: this.local,
      puesto: this.puesto,
      celular: this.celular,
      fecha: this.fecha,
      banco: this.banco,
      tipo: this.tipo,
      cuenta: this.cuenta,
      password: this.password,
    };
    
     // Aquí puedes llamar al servicio de autenticación para registrar al usuario
    this.authService.register(userData).subscribe({
      next: response => {
        console.log('Registro exitoso', response);
      },
      error: err => {
        console.error('Error en el registro', err);
      }
    });

 }
}
