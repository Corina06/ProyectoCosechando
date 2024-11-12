import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { NavcomerComponent } from "../navcomer/navcomer.component"; 

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, NavcomerComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {

  isEditing: boolean = false;
  changesSaved: boolean = false;  // Variable para manejar el mensaje de éxito
  successMessage: string = '¡Cambios guardados con éxito!';

  // Datos del comerciante
  comerciante = {
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan.perez@example.com',
    direccion: 'Calle 123, Ciudad, País',
    local: 'Frutería La Mejor',
    puesto: 'Calle principal, Frente a la plaza',
    celular: '6523-2563',
    fecha: '1980-05-15',
    banco: 'Banco Nacional',
    tipo: 'Ahorro',
    cuenta: '81234567890',
    password: '******',  // No deberías mostrar la contraseña en un perfil real, es solo un ejemplo
    foto: 'images/avatar.jpg'
  };


  onFormChange() {
    // Esto es para asegurarse de que el formulario es sucio después de un cambio
    console.log('Formulario modificado');
  }

  // Función para cambiar entre modo edición y modo vista
  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.changesSaved = false; 
  }

  // Función para guardar cambios
   saveChanges(perfilForm: NgForm) {
    if (perfilForm.dirty) {
      this.changesSaved = true;  // Mostrar el mensaje de cambios guardados
      this.successMessage = '¡Cambios guardados con éxito!';

      // Después de 3 segundos, ocultamos el mensaje de éxito
      setTimeout(() => {
        this.changesSaved = false;
      }, 3000);
    }
  }
}

