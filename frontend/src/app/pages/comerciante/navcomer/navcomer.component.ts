import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { NotificationService, Notification } from '../../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navcomer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navcomer.component.html',
  styleUrl: './navcomer.component.css'
})
export class NavcomerComponent implements OnInit, OnDestroy {
  currentUser: any = null;
  notificationsVisible: boolean = false;
  profileMenuVisible: boolean = false;
  notifications: Notification[] = [];
  unreadCount: number = 0;
  private subscriptions: Subscription[] = [];
  
  navigateToInicio() {
    console.log('Navegando al inicio comerciante');
    this.router.navigate(['/panel']);
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    // Suscribirse a las notificaciones
    const notificationsSub = this.notificationService.getNotifications().subscribe(
      notifications => {
        this.notifications = notifications;
        this.unreadCount = notifications.filter(n => !n.read).length;
      }
    );
    
    this.subscriptions.push(notificationsSub);
    
    // Generar algunas notificaciones de ejemplo si no hay ninguna
    this.initializeExampleNotifications();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private initializeExampleNotifications(): void {
    // Solo agregar notificaciones de ejemplo si no hay ninguna
    if (this.notifications.length === 0) {
      this.notificationService.addReminderNotification(
        'Bienvenido al sistema de notificaciones',
        'Ahora recibirás alertas automáticas sobre tu inventario y ventas'
      );
    }
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

  // Métodos para manejar notificaciones
  markAsRead(notification: Notification): void {
    if (!notification.read) {
      this.notificationService.markAsRead(notification.id);
    }
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  removeNotification(notification: Notification): void {
    this.notificationService.removeNotification(notification.id);
  }

  clearAllNotifications(): void {
    this.notificationService.clearAllNotifications();
  }
}
