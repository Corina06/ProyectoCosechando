import { FormsModule, NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {

  // Aquí puedes definir propiedades del componente
  name: string = '';
  apellido: string = '';
  email: string = '';
  direccion: string = '';
  local: string = '';
  puesto: string = '';
  celular: string = '';
  codigoPais: string = '+507'; // Código de país seleccionado
  fecha: string = '';
  banco: string = '';
  tipo: string = '';
  cuenta: string = '';
  password: string = '';
  confirmPassword: string = '';
  mensajeRegistroVisible: boolean = false;
  incluirDatosBancarios: boolean = false;

  // Lista de códigos de país
  codigosPais = [
    { codigo: '+507', pais: 'Panamá', bandera: '🇵🇦' },
    { codigo: '+1', pais: 'Estados Unidos', bandera: '🇺🇸' },
    { codigo: '+1', pais: 'Canadá', bandera: '🇨🇦' },
    { codigo: '+52', pais: 'México', bandera: '🇲🇽' },
    { codigo: '+57', pais: 'Colombia', bandera: '🇨🇴' },
    { codigo: '+58', pais: 'Venezuela', bandera: '🇻🇪' },
    { codigo: '+506', pais: 'Costa Rica', bandera: '🇨🇷' },
    { codigo: '+503', pais: 'El Salvador', bandera: '🇸🇻' },
    { codigo: '+502', pais: 'Guatemala', bandera: '🇬🇹' },
    { codigo: '+504', pais: 'Honduras', bandera: '🇭🇳' },
    { codigo: '+505', pais: 'Nicaragua', bandera: '🇳🇮' },
    { codigo: '+51', pais: 'Perú', bandera: '🇵🇪' },
    { codigo: '+593', pais: 'Ecuador', bandera: '🇪🇨' },
    { codigo: '+591', pais: 'Bolivia', bandera: '🇧🇴' },
    { codigo: '+56', pais: 'Chile', bandera: '🇨🇱' },
    { codigo: '+54', pais: 'Argentina', bandera: '🇦🇷' },
    { codigo: '+598', pais: 'Uruguay', bandera: '🇺🇾' },
    { codigo: '+595', pais: 'Paraguay', bandera: '🇵🇾' },
    { codigo: '+55', pais: 'Brasil', bandera: '🇧🇷' },
    { codigo: '+34', pais: 'España', bandera: '🇪🇸' },
    { codigo: '+33', pais: 'Francia', bandera: '🇫🇷' },
    { codigo: '+39', pais: 'Italia', bandera: '🇮🇹' },
    { codigo: '+49', pais: 'Alemania', bandera: '🇩🇪' },
    { codigo: '+44', pais: 'Reino Unido', bandera: '🇬🇧' },
    { codigo: '+86', pais: 'China', bandera: '🇨🇳' },
    { codigo: '+81', pais: 'Japón', bandera: '🇯🇵' },
    { codigo: '+82', pais: 'Corea del Sur', bandera: '🇰🇷' },
    { codigo: '+91', pais: 'India', bandera: '🇮🇳' }
  ];

  // Fechas para validación
  maxDate: string = '';
  minDate: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    // Configurar fechas para validación
    const today = new Date();
    const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    const hundredYearsAgo = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
    
    this.maxDate = eighteenYearsAgo.toISOString().split('T')[0];
    this.minDate = hundredYearsAgo.toISOString().split('T')[0];
  }

  ngOnInit() {
    // Forzar la inicialización de todas las propiedades como strings vacíos
    this.name = String('');
    this.apellido = String('');
    this.email = String('');
    this.direccion = String('');
    this.local = String('');
    this.puesto = String('');
    this.celular = String('');
    this.codigoPais = String('+507'); // Panamá por defecto
    this.fecha = String('');
    this.banco = String('');
    this.tipo = String('ahorro');
    this.cuenta = String('');
    this.password = String('');
    this.confirmPassword = String('');
  }
  /// Método que se ejecuta cuando se envía el formulario
  register(form: NgForm) {
    console.log('🔄 Intento de registro iniciado');
    console.log('📋 Estado del formulario:', {
      valid: form.valid,
      submitted: form.submitted,
      errors: form.errors
    });
    console.log('📝 Datos del formulario:', {
      name: this.name,
      apellido: this.apellido,
      email: this.email,
      celular: this.celular,
      codigoPais: this.codigoPais,
      incluirDatosBancarios: this.incluirDatosBancarios,
      cuenta: this.cuenta
    });
    
    if (!form.valid) {
      console.log('❌ Formulario inválido');
      console.log('🔍 Controles inválidos:', Object.keys(form.controls).filter(key => form.controls[key].invalid));
      return;
    }
    
    console.log('✅ Formulario válido, procediendo con registro...');

    // Validación de contraseñas
    if (this.password !== this.confirmPassword) {
      console.log('❌ Las contraseñas no coinciden');
      form.controls['cnf-password'].setErrors({ notMatch: true });
      return;
    }

    // Validación de longitud de contraseña
    if (this.password.length < 6) {
      console.log('❌ Contraseña muy corta');
      form.controls['password'].setErrors({ minlength: true });
      return;
    }

    // Validación de edad (mayor de 18 años)
    if (this.fecha) {
      const birthDate = new Date(this.fecha);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 18) {
        console.log('❌ Usuario menor de edad');
        form.controls['fecha'].setErrors({ underage: true });
        return;
      }
    }

    // Validación de números de celular
    if (isNaN(parseInt(this.celular, 10))) {
      form.controls['celular'].setErrors({ invalidNumber: true });
      return;
    }

    // Validación específica por país
    const celularLength = this.celular.length;
    const validLengths: { [key: string]: number[] } = {
      '+507': [8],
      '+1': [10],
      '+52': [10],
      '+57': [10],
      '+58': [10],
      '+506': [8],
      '+503': [8],
      '+502': [8],
      '+504': [8],
      '+505': [8],
      '+51': [9],
      '+593': [9],
      '+591': [8],
      '+56': [9],
      '+54': [10],
      '+598': [8],
      '+595': [9],
      '+55': [11],
      '+34': [9],
      '+33': [10],
      '+39': [10],
      '+49': [11],
      '+44': [10],
      '+86': [11],
      '+81': [10],
      '+82': [10],
      '+91': [10]
    };

    const expectedLengths = validLengths[this.codigoPais] || [7, 8, 9, 10, 11];
    if (!expectedLengths.includes(celularLength)) {
      form.controls['celular'].setErrors({ invalidLength: true });
      return;
    }

    // Validar número de cuenta solo si se incluyen datos bancarios
    if (this.incluirDatosBancarios && this.cuenta && isNaN(parseInt(this.cuenta, 10))) {
      form.controls['cuenta'].setErrors({ invalidNumber: true });
      return;
    }
    
    if (form.valid) {
      // Preparar datos para el registro
      const userData = {
        name: this.name,
        apellido: this.apellido,
        email: this.email,
        direccion: this.direccion,
        local: this.local,
        puesto: this.puesto,
        celular: parseInt(this.celular, 10),
        codigoPais: this.codigoPais,
        fecha: this.fecha,
        banco: this.incluirDatosBancarios ? this.banco : 'Pendiente',
        tipo: this.incluirDatosBancarios ? this.tipo : 'pendiente',
        cuenta: this.incluirDatosBancarios && this.cuenta ? parseInt(this.cuenta, 10) : 0,
        password: this.password
      };

      console.log('📤 Enviando datos de registro:', userData);
      
      // Llamar al servicio de registro
      this.authService.register(userData).subscribe({
        next: (response) => {
          console.log('Registro exitoso', response);
          this.mensajeRegistroVisible = true;
          setTimeout(() => {
            this.router.navigate(['/panel']); // Redirigir al panel después del registro
            this.mensajeRegistroVisible = false;
          }, 3000);
        },
        error: (error) => {
          console.error('Error en el registro', error);
          if (error.error?.message === 'El usuario ya existe') {
            alert('Este correo electrónico ya está registrado. Por favor, usa otro correo o inicia sesión.');
          } else {
            alert('Error al registrar usuario: ' + (error.error?.message || 'Error desconocido'));
          }
        }
      });
    } else {
      console.log('Formulario inválido');
    }
  }
  
  // Getters para asegurar que siempre devuelvan strings
  get nameValue(): string {
    return String(this.name || '');
  }
  
  get apellidoValue(): string {
    return String(this.apellido || '');
  }
  
  get direccionValue(): string {
    return String(this.direccion || '');
  }
  
  get localValue(): string {
    return String(this.local || '');
  }
  
  get puestoValue(): string {
    return String(this.puesto || '');
  }

  // Método para navegar al login
  goToLogin() {
    this.router.navigate(['/login']);  // Ajusta la ruta según tu necesidad
  }

  // Método para obtener el nombre del país
  getCountryName(codigo: string): string {
    const pais = this.codigosPais.find(p => p.codigo === codigo);
    return pais ? pais.pais : 'el país seleccionado';
  }

  // Método para manejar el click del botón
  onSubmitClick(event: Event) {
    console.log('🖱️ Botón clickeado');
    console.log('📋 Estado actual del formulario:', {
      valid: event.target,
      formValid: (event.target as any).form?.checkValidity()
    });
  }

  // Método para obtener campos inválidos
  getInvalidFields(): string {
    const form = document.querySelector('form') as HTMLFormElement;
    if (!form) return '';
    
    const invalidFields: string[] = [];
    const inputs = form.querySelectorAll('input[required], select[required]');
    
    inputs.forEach((input: any) => {
      if (!input.checkValidity()) {
        const label = form.querySelector(`label[for="${input.id}"]`)?.textContent || input.name || input.id;
        invalidFields.push(label);
      }
    });
    
    return invalidFields.join(', ');
  }

  // Método para obtener placeholder específico según el país
  getPlaceholderForCountry(codigo: string): string {
    const placeholders: { [key: string]: string } = {
      '+507': '6123-4567 (8 dígitos)',
      '+1': '555-123-4567 (10 dígitos)',
      '+52': '55-1234-5678 (10 dígitos)',
      '+57': '300-123-4567 (10 dígitos)',
      '+58': '412-123-4567 (10 dígitos)',
      '+506': '8123-4567 (8 dígitos)',
      '+503': '7123-4567 (8 dígitos)',
      '+502': '5123-4567 (8 dígitos)',
      '+504': '9123-4567 (8 dígitos)',
      '+505': '8123-4567 (8 dígitos)',
      '+51': '987-123-456 (9 dígitos)',
      '+593': '98-123-4567 (9 dígitos)',
      '+591': '7123-4567 (8 dígitos)',
      '+56': '9-1234-5678 (9 dígitos)',
      '+54': '11-1234-5678 (10 dígitos)',
      '+598': '9123-4567 (8 dígitos)',
      '+595': '98-123-456 (9 dígitos)',
      '+55': '11-91234-5678 (11 dígitos)',
      '+34': '612-34-56-78 (9 dígitos)',
      '+33': '6-12-34-56-78 (10 dígitos)',
      '+39': '312-345-6789 (10 dígitos)',
      '+49': '151-12345678 (11 dígitos)',
      '+44': '7700-123456 (10 dígitos)',
      '+86': '138-0013-8000 (11 dígitos)',
      '+81': '90-1234-5678 (10 dígitos)',
      '+82': '10-1234-5678 (10 dígitos)',
      '+91': '98765-43210 (10 dígitos)'
    };
    return placeholders[codigo] || 'Número de teléfono';
  }
 
  
}
