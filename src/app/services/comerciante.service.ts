import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Comerciante {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  direccion: string;
  local: string;
  puesto: string;
  celular: string;
  fechaNacimiento: string;
  banco: string;
  tipoCuenta: string;
  numeroCuenta: string;
  password?: string;
  foto: string;
  fechaRegistro: string;
  estado: 'Activo' | 'Inactivo';
  verificado: boolean;
  totalVentas: number;
  productosActivos: number;
}

export interface UpdateProfileData {
  nombre: string;
  apellido: string;
  email: string;
  direccion: string;
  local: string;
  puesto: string;
  celular: string;
  banco: string;
  tipoCuenta: string;
  numeroCuenta: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class ComercianteService {
  private API_URI = `${environment.apiUrl}/comerciante`;
  private comercianteSubject = new BehaviorSubject<Comerciante | null>(null);
  public comerciante$ = this.comercianteSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Obtener perfil del comerciante logueado
  getProfile(): Observable<Comerciante> {
    return this.http.get<Comerciante>(`${this.API_URI}/profile`)
      .pipe(
        tap(comerciante => {
          this.comercianteSubject.next(comerciante);
        })
      );
  }

  // Actualizar perfil del comerciante
  updateProfile(profileData: UpdateProfileData): Observable<Comerciante> {
    return this.http.put<Comerciante>(`${this.API_URI}/profile`, profileData)
      .pipe(
        tap(comerciante => {
          this.comercianteSubject.next(comerciante);
        })
      );
  }

  // Cambiar contraseña
  changePassword(passwordData: ChangePasswordData): Observable<any> {
    return this.http.put(`${this.API_URI}/change-password`, passwordData);
  }

  // Subir foto de perfil
  uploadProfilePhoto(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('photo', file);
    
    return this.http.post(`${this.API_URI}/upload-photo`, formData)
      .pipe(
        tap((response: any) => {
          const currentComerciante = this.comercianteSubject.value;
          if (currentComerciante) {
            currentComerciante.foto = response.photoUrl;
            this.comercianteSubject.next(currentComerciante);
          }
        })
      );
  }

  // Obtener comerciante actual del subject
  getCurrentComerciante(): Comerciante | null {
    return this.comercianteSubject.value;
  }

  // Limpiar datos del comerciante (para logout)
  clearComerciante(): void {
    this.comercianteSubject.next(null);
  }
}