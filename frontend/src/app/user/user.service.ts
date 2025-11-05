import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/admin/users`; // Usa la ruta de admin para desarrollo

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addUser(user: any): Observable<any> {
    // Nota: No hay endpoint POST para usuarios en admin, usar /api/auth/register
    return this.http.post<any>(`${environment.apiUrl}/auth/register`, user);
  }
}
