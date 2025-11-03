import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navcomer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navcomer.component.html',
  styleUrl: './navcomer.component.css'
})
export class NavcomerComponent implements OnInit {
  currentUser: any = null;
  
  navigateToInicio() {
    console.log('Navegando al inicio comerciante');
    this.router.navigate(['/panel']);
  }

  notificationsVisible: boolean = false;
  profileMenuVisible: boolean = false;
  notifications = [
    {
      type: 'order',
      icon: 'fas fa-shopping-cart',
      color: '#7fad39',
      message: 'Nueva orden recibida: $15.50',
      detail: 'María Rodríguez - Tomates y Lechuga',
      time: 'Hace 5 min'
    },
    {
      type: 'stock',
      icon: 'fas fa-exclamation-triangle',
      color: '#ff6b35',
      message: 'Stock bajo: Tomates Cherry',
      detail: 'Solo quedan 3 unidades disponibles',
      time: 'Hace 1 hora'
    },
    {
      type: 'payment',
      icon: 'fas fa-dollar-sign',
      color: '#385723',
      message: 'Pago confirmado: $25.75',
      detail: 'Orden #ORD-003 - Ana Sofía López',
      time: 'Hace 2 horas'
    },
    {
      type: 'trending',
      icon: 'fas fa-chart-line',
      color: '#7F6000',
      message: 'Producto destacado',
      detail: 'Yuca Fresca es tu más vendido esta semana',
      time: 'Hoy'
    },
    {
      type: 'reminder',
      icon: 'fas fa-clock',
      color: '#572C1A',
      message: 'Recordatorio importante',
      detail: 'Actualizar precios de temporada',
      time: 'Hace 3 horas'
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

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
    console.log('🔗 Navegando al perfil desde header...');
    
    // Navegar al perfil
    this.router.navigate(['/perfil']);
    
    // Cerrar el menú después de navegar
    this.profileMenuVisible = false;
  }

  logout() {
    this.authService.logout();
    console.log("Cerrando sesión...");
    this.router.navigate(['/inicio']);
  }
}
