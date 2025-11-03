import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface MerchantStats {
  totalSales: number;
  totalProducts: number;
  totalOrders: number;
  monthlyGrowth: number;
}

export interface MerchantProfile {
  id: string;
  name: string;
  email: string;
  businessName: string;
  location: string;
  phone: string;
  bankInfo: {
    bankName: string;
    accountType: string;
    accountNumber: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class MerchantService {
  private API_URI = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Obtener estadísticas del comerciante
  getMerchantStats(merchantId: string): Observable<MerchantStats> {
    return this.http.get<MerchantStats>(`${this.API_URI}/merchant/${merchantId}/stats`);
  }

  // Obtener perfil del comerciante
  getMerchantProfile(merchantId: string): Observable<MerchantProfile> {
    return this.http.get<MerchantProfile>(`${this.API_URI}/merchant/${merchantId}/profile`);
  }

  // Actualizar perfil del comerciante
  updateMerchantProfile(merchantId: string, profile: Partial<MerchantProfile>): Observable<MerchantProfile> {
    return this.http.put<MerchantProfile>(`${this.API_URI}/merchant/${merchantId}/profile`, profile);
  }

  // Obtener órdenes del comerciante
  getMerchantOrders(merchantId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URI}/merchant/${merchantId}/orders`);
  }

  // Actualizar estado de orden
  updateOrderStatus(orderId: string, status: string): Observable<any> {
    return this.http.patch(`${this.API_URI}/orders/${orderId}/status`, { status });
  }
}