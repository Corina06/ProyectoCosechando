import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navcomer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navcomer.component.html',
  styleUrl: './navcomer.component.css'
})
export class NavcomerComponent {
    
  navigateToInicio() {
    console.log('Navegando al inicio comerciante');
    this.router.navigate(['/reporte']);
  }

  notificationsVisible: boolean = false;
  profileMenuVisible: boolean = false;
  notifications: string[] = ['Nueva actualización', 'Tienes 5 nuevos mensajes'];

  constructor(private router: Router) {}

  toggleNotifications() {
    this.notificationsVisible = !this.notificationsVisible;
    // Cerrar el menú de perfil si está abierto
    if (this.profileMenuVisible) {
      this.profileMenuVisible = false;
    }
  }

  toggleProfileMenu() {
    this.profileMenuVisible = !this.profileMenuVisible;
    // Cerrar el menú de notificaciones si está abierto
    if (this.notificationsVisible) {
      this.notificationsVisible = false;
    }
  }

  goToProfile() {
    this.router.navigate(['/perfil']);
  }

  logout() {
    // Aquí puedes agregar el comportamiento para cerrar sesión, como limpiar el almacenamiento local o cerrar sesión en el backend.
    console.log("Cerrando sesión...");
    this.router.navigate(['/inicio']); // Redirige a la página de login.
  }
}
