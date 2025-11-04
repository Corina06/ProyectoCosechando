import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  type: 'order' | 'stock' | 'payment' | 'trending' | 'reminder' | 'expense' | 'profit';
  icon: string;
  color: string;
  message: string;
  detail: string;
  time: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  constructor() {
    // Cargar notificaciones del localStorage al inicializar
    this.loadNotificationsFromStorage();
  }

  private loadNotificationsFromStorage(): void {
    const stored = localStorage.getItem('notifications');
    if (stored) {
      try {
        const notifications = JSON.parse(stored);
        this.notificationsSubject.next(notifications);
      } catch (error) {
        console.error('Error loading notifications from storage:', error);
        this.notificationsSubject.next([]);
      }
    }
  }

  private saveNotificationsToStorage(notifications: Notification[]): void {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }

  getNotifications(): Observable<Notification[]> {
    return this.notifications$;
  }

  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date(),
      read: false
    };

    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = [newNotification, ...currentNotifications];
    
    // Mantener solo las últimas 50 notificaciones
    const limitedNotifications = updatedNotifications.slice(0, 50);
    
    this.notificationsSubject.next(limitedNotifications);
    this.saveNotificationsToStorage(limitedNotifications);
  }

  markAsRead(notificationId: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.map(notification =>
      notification.id === notificationId 
        ? { ...notification, read: true }
        : notification
    );
    
    this.notificationsSubject.next(updatedNotifications);
    this.saveNotificationsToStorage(updatedNotifications);
  }

  markAllAsRead(): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.map(notification => ({
      ...notification,
      read: true
    }));
    
    this.notificationsSubject.next(updatedNotifications);
    this.saveNotificationsToStorage(updatedNotifications);
  }

  removeNotification(notificationId: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.filter(
      notification => notification.id !== notificationId
    );
    
    this.notificationsSubject.next(updatedNotifications);
    this.saveNotificationsToStorage(updatedNotifications);
  }

  clearAllNotifications(): void {
    this.notificationsSubject.next([]);
    this.saveNotificationsToStorage([]);
  }

  getUnreadCount(): Observable<number> {
    return new BehaviorSubject(
      this.notificationsSubject.value.filter(n => !n.read).length
    ).asObservable();
  }

  // Métodos específicos para diferentes tipos de notificaciones
  
  addStockAlert(productName: string, currentStock: number, minStock: number): void {
    this.addNotification({
      type: 'stock',
      icon: 'fas fa-exclamation-triangle',
      color: '#ff6b35',
      message: `Stock bajo: ${productName}`,
      detail: `Solo quedan ${currentStock} unidades (mínimo: ${minStock})`,
      time: this.getRelativeTime(new Date()),
      priority: currentStock === 0 ? 'high' : 'medium'
    });
  }

  addOrderNotification(orderTotal: number, customerName: string, items: string): void {
    this.addNotification({
      type: 'order',
      icon: 'fas fa-shopping-cart',
      color: '#7fad39',
      message: `Nueva orden recibida: $${orderTotal.toFixed(2)}`,
      detail: `${customerName} - ${items}`,
      time: this.getRelativeTime(new Date()),
      priority: 'high'
    });
  }

  addPaymentNotification(amount: number, orderId: string, customerName: string): void {
    this.addNotification({
      type: 'payment',
      icon: 'fas fa-dollar-sign',
      color: '#385723',
      message: `Pago confirmado: $${amount.toFixed(2)}`,
      detail: `Orden ${orderId} - ${customerName}`,
      time: this.getRelativeTime(new Date()),
      priority: 'medium'
    });
  }

  addExpenseNotification(amount: number, supplier: string, type: string): void {
    this.addNotification({
      type: 'expense',
      icon: 'fas fa-receipt',
      color: '#572C1A',
      message: `Nuevo gasto registrado: $${amount.toFixed(2)}`,
      detail: `${type} - ${supplier}`,
      time: this.getRelativeTime(new Date()),
      priority: 'low'
    });
  }

  addProfitAlert(productName: string, margin: number): void {
    const color = margin >= 50 ? '#7fad39' : margin >= 20 ? '#7F6000' : '#ff6b35';
    this.addNotification({
      type: 'profit',
      icon: 'fas fa-chart-line',
      color: color,
      message: `Margen de ganancia: ${margin.toFixed(1)}%`,
      detail: `${productName} - ${margin >= 50 ? 'Excelente' : margin >= 20 ? 'Bueno' : 'Bajo'} margen`,
      time: this.getRelativeTime(new Date()),
      priority: margin < 20 ? 'medium' : 'low'
    });
  }

  addReminderNotification(message: string, detail: string): void {
    this.addNotification({
      type: 'reminder',
      icon: 'fas fa-clock',
      color: '#7F6000',
      message: message,
      detail: detail,
      time: this.getRelativeTime(new Date()),
      priority: 'medium'
    });
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private getRelativeTime(date: Date): string {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora mismo';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
    
    return date.toLocaleDateString();
  }
}