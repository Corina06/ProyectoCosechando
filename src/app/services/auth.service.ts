// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// interface LoginResponse {  // Define la interfaz aquí
//   token: string;
// }

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth'; // Cambia el puerto si es necesario

  constructor(private http: HttpClient) {}

   // Método para registrar usuario
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(email: string, password: string) {
  return this.http.post('http://localhost:3000/api/auth/login', { email, password });
  }

  
}
