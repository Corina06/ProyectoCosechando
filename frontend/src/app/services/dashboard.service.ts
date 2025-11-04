import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DashboardStats {
  totalSales: number;
  totalCustomers: number;
  totalProducts: number;
  productsSold: number;
  salesGrowth: number;
  customersGrowth: number;
  productsGrowth: number;
  soldGrowth: number;
}

export interface SalesReport {
  date: string;
  amount: number;
  orders: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private API_URI = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  // Obtener estadísticas del dashboard por contacto de usuario
  getDashboardStatsByContact(userContact: string): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.API_URI}/stats/${userContact}`);
  }

  // Obtener estadísticas del dashboard (método original - mantener compatibilidad)
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.API_URI}/stats`);
  }

  // Obtener reporte de ventas
  getSalesReport(period: string = 'month'): Observable<SalesReport[]> {
    return this.http.get<SalesReport[]>(`${this.API_URI}/sales-report?period=${period}`);
  }

  // Obtener órdenes del comerciante por contacto
  getMerchantOrdersByContact(userContact: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URI}/orders/${userContact}`);
  }

  // Obtener órdenes del comerciante (método original - mantener compatibilidad)
  getMerchantOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URI}/orders`);
  }

  // Obtener productos más vendidos
  getTopProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URI}/top-products`);
  }
}