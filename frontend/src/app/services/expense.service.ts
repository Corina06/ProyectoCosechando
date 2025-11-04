import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ExpenseItem {
  nombre: string;
  cantidad: number;
  precio: number;
  unit: string;
  subtotal: number;
}

export interface Expense {
  id?: number;
  comercianteContact: string;
  proveedor: string;
  tipoGasto: 'Compra de Productos' | 'Transporte' | 'Servicios Públicos' | 'Alquiler' | 'Mantenimiento' | 'Marketing' | 'Otros';
  fecha: string;
  estado: 'Pendiente' | 'Pagado' | 'Cancelado';
  metodoPago: 'Efectivo' | 'Transferencia Bancaria' | 'Cheque' | 'Tarjeta de Crédito' | 'Tarjeta de Débito';
  factura: string;
  descripcion?: string;
  items: ExpenseItem[];
  total: number;
}

export interface ExpenseStats {
  totalExpenses: number;
  totalAmount: number;
  expensesByType: Array<{ _id: string; total: number; count: number }>;
  expensesByStatus: Array<{ _id: string; total: number; count: number }>;
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private API_URI = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Obtener todos los gastos de un comerciante
  getExpensesByUser(userContact: string): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.API_URI}/expenses/user/${userContact}`);
  }

  // Obtener un gasto por ID
  getExpense(id: string): Observable<Expense> {
    return this.http.get<Expense>(`${this.API_URI}/expenses/${id}`);
  }

  // Crear nuevo gasto
  addExpense(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(`${this.API_URI}/expenses`, expense);
  }

  // Actualizar gasto
  updateExpense(id: string, expense: Expense): Observable<Expense> {
    return this.http.put<Expense>(`${this.API_URI}/expenses/${id}`, expense);
  }

  // Eliminar gasto
  deleteExpense(id: string): Observable<any> {
    return this.http.delete(`${this.API_URI}/expenses/${id}`);
  }

  // Obtener estadísticas de gastos
  getExpenseStats(userContact: string): Observable<ExpenseStats> {
    return this.http.get<ExpenseStats>(`${this.API_URI}/expenses/stats/${userContact}`);
  }
}