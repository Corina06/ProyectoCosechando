// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginResponse } from '../models/login-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

   // Método para registrar usuario
  //register(userData: any): Observable<any> {
    //return this.http.post(`${this.apiUrl}/register`, userData);
  //}

  // Método para login
  //login(email: string, password: string) {
  //return this.http.post('http://localhost:3000/api/auth/login', { email, password });
  //}

  //login(email: string, password: string): Observable<any> {
    //const loginData = { email, password };
    //return this.http.post<any>(this.apiUrl, loginData);
  //}

  login(email: string, password: string) : Observable<LoginResponse> {
    const body = { email, password };
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, body); 
  }
  
  storeToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);  // Redirigir al login
  }

  isAuthenticated(): boolean {
    return !!this.getToken();  // Verifica si el token existe
  }

}
