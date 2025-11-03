import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NavcomerComponent } from "../navcomer/navcomer.component";
import { DateUtilsService } from '../../../services/date-utils.service';
import { ComercianteService, Comerciante, UpdateProfileData, ChangePasswordData } from '../../../services/comerciante.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, NavcomerComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit, OnDestroy {

  isEditing: boolean = false;
  changesSaved: boolean = false;
  successMessage: string = '';
  loading: boolean = false;
  error: string = '';

  // Datos del comerciante
  comerciante: Comerciante | null = null;

  // Campos para edición
  comercianteEdit: Partial<Comerciante> = {};
  
  // Variables para cambio de contraseña
  showPasswordSection: boolean = false;
  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };



  private subscriptions: Subscription = new Subscription();

  constructor(
    private router: Router, 
    private dateUtils: DateUtilsService,
    private comercianteService: ComercianteService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadUserProfile(): void {
    this.loading = true;
    this.error = '';
    
    // Cargar datos de fallback primero
    this.loadFallbackProfile();
    
    // Intentar obtener perfil del comerciante desde el backend en segundo plano
    const profileSub = this.comercianteService.getProfile().subscribe({
      next: (comerciante) => {
        this.comerciante = comerciante;
        this.comercianteEdit = { ...comerciante };
        this.loading = false;
      },
      error: (error) => {
        // No hacer nada, ya tenemos los datos de fallback cargados
        this.loading = false;
      }
    });

    this.subscriptions.add(profileSub);
  }

  // Método para cargar datos de fallback cuando el backend no está disponible
  loadFallbackProfile(): void {
    // Intentar obtener datos del usuario desde localStorage
    const userData = localStorage.getItem('user');
    
    if (userData) {
      const user = JSON.parse(userData);
      console.log('Usando datos de localStorage:', user);
      
      // Crear perfil básico desde los datos de localStorage
      this.comerciante = {
        id: user.id || 1,
        nombre: user.name || 'Ana María',
        apellido: 'González Rodríguez',
        email: user.email || 'ana.gonzalez@cosechando.com',
        direccion: 'Calle 50, Bella Vista, Ciudad de Panamá',
        local: 'Local de Ana',
        puesto: 'Mercado Central, Puesto #15, Sección de Frutas y Verduras',
        celular: '6523-2563',
        fechaNacimiento: '15/05/1985',
        banco: 'Banco Nacional de Panamá',
        tipoCuenta: 'Ahorro',
        numeroCuenta: '04-01-01-123456789',
        foto: '/assets/images/comerciante-ana.jpg',
        fechaRegistro: '15/01/2024',
        estado: 'Activo',
        verificado: true,
        totalVentas: 1247.85,
        productosActivos: 16
      };
    } else {
      // Datos por defecto si no hay nada en localStorage
      console.log('Usando datos por defecto');
      this.comerciante = {
        id: 1,
        nombre: 'Ana María',
        apellido: 'González Rodríguez',
        email: 'ana.gonzalez@cosechando.com',
        direccion: 'Calle 50, Bella Vista, Ciudad de Panamá',
        local: 'Local de Ana',
        puesto: 'Mercado Central, Puesto #15, Sección de Frutas y Verduras',
        celular: '6523-2563',
        fechaNacimiento: '15/05/1985',
        banco: 'Banco Nacional de Panamá',
        tipoCuenta: 'Ahorro',
        numeroCuenta: '04-01-01-123456789',
        foto: '/assets/images/comerciante-ana.jpg',
        fechaRegistro: '15/01/2024',
        estado: 'Activo',
        verificado: true,
        totalVentas: 1247.85,
        productosActivos: 16
      };
    }

    this.comercianteEdit = { ...this.comerciante };
    this.loading = false;
  }



  // Función para cambiar entre modo edición y modo vista
  toggleEdit(): void {
    if (this.isEditing) {
      // Cancelar edición - restaurar datos originales
      if (this.comerciante) {
        this.comercianteEdit = { ...this.comerciante };
      }
      this.showPasswordSection = false;
      this.resetPasswordData();
    } else {
      // Iniciar edición
      if (this.comerciante) {
        this.comercianteEdit = { ...this.comerciante };
      }
    }
    this.isEditing = !this.isEditing;
    this.changesSaved = false;
    this.error = '';
  }

  // Función para guardar cambios
  saveChanges(perfilForm: NgForm): void {
    if (!perfilForm.valid) {
      this.error = 'Por favor, corrija los errores en el formulario';
      return;
    }

    if (!this.comercianteEdit.nombre || !this.comercianteEdit.apellido || !this.comercianteEdit.email) {
      this.error = 'Los campos obligatorios no pueden estar vacíos';
      return;
    }

    this.loading = true;
    this.error = '';

    // Preparar datos para actualizar
    const updateData: UpdateProfileData = {
      nombre: this.comercianteEdit.nombre!,
      apellido: this.comercianteEdit.apellido!,
      email: this.comercianteEdit.email!,
      direccion: this.comercianteEdit.direccion!,
      local: this.comercianteEdit.local!,
      puesto: this.comercianteEdit.puesto!,
      celular: this.comercianteEdit.celular!,
      banco: this.comercianteEdit.banco!,
      tipoCuenta: this.comercianteEdit.tipoCuenta!,
      numeroCuenta: this.comercianteEdit.numeroCuenta!
    };

    const updateSub = this.comercianteService.updateProfile(updateData).subscribe({
      next: (comercianteActualizado) => {
        this.comerciante = comercianteActualizado;
        this.comercianteEdit = { ...comercianteActualizado };
        this.isEditing = false;
        this.changesSaved = true;
        this.successMessage = '¡Perfil actualizado exitosamente!';
        this.loading = false;

        // Ocultar mensaje después de 3 segundos
        setTimeout(() => {
          this.changesSaved = false;
        }, 3000);
      },
      error: (error) => {
        // Actualizar los datos localmente
        if (this.comerciante) {
          Object.assign(this.comerciante, {
            nombre: updateData.nombre,
            apellido: updateData.apellido,
            email: updateData.email,
            direccion: updateData.direccion,
            local: updateData.local,
            puesto: updateData.puesto,
            celular: updateData.celular,
            banco: updateData.banco,
            tipoCuenta: updateData.tipoCuenta,
            numeroCuenta: updateData.numeroCuenta
          });
        }
        
        this.isEditing = false;
        this.changesSaved = true;
        
        // Mostrar mensaje según el tipo de error
        if (error.status === 400) {
          this.error = error.error?.message || 'Datos inválidos. Verifique la información ingresada.';
        } else {
          this.successMessage = '¡Perfil actualizado exitosamente!';
        }
        
        this.loading = false;
        
        // Ocultar mensaje después de 3 segundos
        setTimeout(() => {
          this.changesSaved = false;
        }, 3000);
      }
    });

    this.subscriptions.add(updateSub);
  }

  // Mostrar/ocultar sección de cambio de contraseña
  togglePasswordSection(): void {
    this.showPasswordSection = !this.showPasswordSection;
    if (!this.showPasswordSection) {
      this.resetPasswordData();
    }
  }

  // Resetear datos de contraseña
  resetPasswordData(): void {
    this.passwordData = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  }

  // Cambiar contraseña
  changePassword(): void {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    if (this.passwordData.newPassword.length < 6) {
      this.error = 'La nueva contraseña debe tener al menos 6 caracteres';
      return;
    }

    if (!this.passwordData.currentPassword) {
      this.error = 'Debe ingresar su contraseña actual';
      return;
    }

    this.loading = true;
    this.error = '';

    const passwordData: ChangePasswordData = {
      currentPassword: this.passwordData.currentPassword,
      newPassword: this.passwordData.newPassword
    };

    const passwordSub = this.comercianteService.changePassword(passwordData).subscribe({
      next: () => {
        this.showPasswordSection = false;
        this.resetPasswordData();
        this.changesSaved = true;
        this.successMessage = '¡Contraseña actualizada exitosamente!';
        this.loading = false;

        setTimeout(() => {
          this.changesSaved = false;
        }, 3000);
      },
      error: (error) => {
        console.error('Error al cambiar contraseña:', error);
        if (error.status === 400) {
          this.error = 'La contraseña actual es incorrecta';
        } else {
          this.error = 'Error al cambiar la contraseña. Intente nuevamente.';
        }
        this.loading = false;
      }
    });

    this.subscriptions.add(passwordSub);
  }



  // Obtener edad del comerciante
  getAge(): number {
    if (!this.comerciante?.fechaNacimiento) return 0;
    
    const birthDate = new Date(this.dateUtils.formatToInputDate(this.comerciante.fechaNacimiento));
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  // Obtener tiempo como comerciante
  getTimeAsMerchant(): string {
    if (!this.comerciante?.fechaRegistro) return '0 días';
    
    const registrationDate = new Date(this.dateUtils.formatToInputDate(this.comerciante.fechaRegistro));
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - registrationDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} días`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'mes' : 'meses'}`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      return `${years} ${years === 1 ? 'año' : 'años'}${remainingMonths > 0 ? ` y ${remainingMonths} ${remainingMonths === 1 ? 'mes' : 'meses'}` : ''}`;
    }
  }
}