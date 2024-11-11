import { FormsModule } from '@angular/forms';
import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule],
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
  confirmPassword: string = '';
  mensajeRegistroVisible: boolean = false;

  // Aquí puedes definir métodos del componente
  constructor(
    private router: Router
  ) {
    console.log('Valores antes de enviar el formulario:');
    console.log('Direccion:', this.direccion);
    console.log('Tipo de direccion:', typeof this.direccion);
    console.log('Puesto:', this.puesto);
    console.log('Tipo de puesto:', typeof this.puesto);
    console.log('Apellido:', this.apellido);
    console.log('Tipo de apellido:', typeof this.apellido);
    console.log('Nombre:', this.name);
    console.log('Tipo de nombre:', typeof this.name);
  }



ngOnChanges(changes: SimpleChanges) {
  console.log('Cambios detectados:', changes);
}

ngOnInit() {
  console.log('Componente RegistroComponent cargado');
    // Asegúrate de que las variables sean cadenas vacías o valores válidos
    console.log('Dirección inicial:', this.direccion);  // Debería ser una cadena vacía
    console.log('Puesto inicial:', this.puesto);  // Debería ser una cadena vacía
    console.log('Apellido inicial:', this.apellido);  // Debería ser una cadena vacía
}

// Método que se ejecuta cuando cambia el valor de 'direccion'
onChangeDireccion(value: any) {
  console.log('Valor de direccion cambiado:', value);
  console.log('Tipo de valor de direccion:', typeof value);
}
  /// Método que se ejecuta cuando se envía el formulario
  register(form: NgForm) {
    console.log('Valores antes de enviar el formulario:');
    console.log('Direccion:', this.direccion);
    console.log('Tipo de direccion:', typeof this.direccion);
    console.log('Puesto:', this.puesto);
    console.log('Tipo de puesto:', typeof this.puesto);
    console.log('Apellido:', this.apellido);
    console.log('Tipo de apellido:', typeof this.apellido);
    console.log('Nombre:', this.name);
    console.log('Tipo de nombre:', typeof this.name);

  console.log('Formulario válido?', form.valid);  // Agrega esto para comprobar la validez

  // Si el formulario no es válido, el código no pasará por aquí.
  if (!form.valid) {
    console.log('Formulario inválido', form.controls);
    return;
  }

    // Validación de contraseñas
    if (this.password !== this.confirmPassword) {
      form.controls['cnf-password'].setErrors({ notMatch: true });
      return;
    }
    
    if (form.valid) {
      // Aquí va tu lógica para registrar al usuario (por ejemplo, llamada a la API)
      this.mensajeRegistroVisible = true;
      setTimeout(() => {
        this.router.navigate(['/login']);
        this.mensajeRegistroVisible = false;
      }, 3000); // El mensaje se oculta después de 3 segundos
    } else {
      console.log('Formulario inválido');
    }
  }
  
  // Método para navegar al login
  goToLogin() {
    this.router.navigate(['/login']);  // Ajusta la ruta según tu necesidad
  }
 
  
}
