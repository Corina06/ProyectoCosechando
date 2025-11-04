import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from '../../../models/cart-item.model';
import { PaymentService } from '../../../services/payment.service';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';

declare global {
  interface Window {
    paypal: any;
  }
}

import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, NavComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})

export class CheckoutComponent implements OnInit, AfterViewInit {
  total: number = 0;
  cart: CartItem[] = [];
  shippingCost: number = 0; 
  additionalCost: number = 3.00;

  // Datos del cliente (invitado)
  guestData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    province: '',
    district: '',
    corregimiento: '',
    address: '',
    apartment: ''
  };

  // Opción de crear cuenta
  createAccount: boolean = false;
  password: string = '';

  // Validación
  formErrors: any = {};

  // Datos de ubicación
  provinces = [
    { value: 'panama', label: 'Panamá' },
    { value: 'panama-oeste', label: 'Panamá Oeste' }
  ];

  districts: any = {
    'panama': [
      'Panamá',
      'San Miguelito',
      'Pedregal',
      'Río Abajo',
      'Pueblo Nuevo',
      'Betania',
      'Bella Vista',
      'Calidonia',
      'Ancón',
      'Santa Ana',
      'San Felipe'
    ],
    'panama-oeste': [
      'Arraiján',
      'La Chorrera',
      'Capira'
    ]
  };

  corregimientos: any = {
    // Provincia de Panamá
    'Panamá': [
      'Ancón',
      'Bella Vista',
      'Betania',
      'Calidonia',
      'Chorreras',
      'Curundú',
      'El Chorrillo',
      'Parque Lefevre',
      'Pedregal',
      'Pueblo Nuevo',
      'Río Abajo',
      'San Felipe',
      'San Francisco',
      'Santa Ana',
      'Tocumen',
      'Juan Díaz',
      'Pacora',
      'Peña Blanca',
      'Las Cumbres',
      'Ernesto Córdoba Campos'
    ],
    'San Miguelito': [
      'Amelia Denis de Icaza',
      'Belisario Frías',
      'José Domingo Espinar',
      'Mateo Iturralde',
      'Rufina Alfaro',
      'Villa Lucre',
      'Victoriano Lorenzo'
    ],
    'Pedregal': [
      'Pedregal'
    ],
    'Río Abajo': [
      'Río Abajo'
    ],
    'Pueblo Nuevo': [
      'Pueblo Nuevo'
    ],
    'Betania': [
      'Betania'
    ],
    'Bella Vista': [
      'Bella Vista'
    ],
    'Calidonia': [
      'Calidonia'
    ],
    'Ancón': [
      'Ancón'
    ],
    'Santa Ana': [
      'Santa Ana'
    ],
    'San Felipe': [
      'San Felipe'
    ],
    
    // Provincia de Panamá Oeste
    'Arraiján': [
      'Arraiján',
      'Burunga',
      'Cerro Silvestre',
      'Juan D. Arosemena',
      'Nuevo Chorrillo',
      'Veracruz'
    ],
    'La Chorrera': [
      'Barrio Balboa',
      'Barrio Colón',
      'El Coco',
      'Feuillet',
      'Guadalupe',
      'Herrera',
      'Hurtado',
      'Iturralde',
      'La Chorrera',
      'Los Díaz',
      'Mendoza',
      'Playa Leona',
      'Puerto Caimito',
      'Santa Rita',
      'Toboga'
    ],
    'Capira': [
      'Capira',
      'Caimito',
      'Campana',
      'Cermeño',
      'Chica',
      'Cirí de Los Sotos',
      'Cirí Grande',
      'El Cacao',
      'La Trinidad',
      'Las Ollas',
      'Lidice',
      'Villa Carmen',
      'Villa Rosario'
    ]
  };

  availableDistricts: string[] = [];
  availableCorregimientos: string[] = [];

  constructor(private route: ActivatedRoute, 
    private router: Router,
    private paymentService: PaymentService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.total = +params['total']; // Total de la compra
      this.cart = JSON.parse(params['cart']); // Convertir JSON a objeto
    });
  }

  onShippingChange(event: any): void {
    if (event.target.value === 'delivery') {
      this.shippingCost = this.additionalCost; // Agregar costo adicional
    } else {
      this.shippingCost = 0; // Sin costo adicional
    }
    this.updateTotal(); // Actualiza el total
  }

  updateTotal(): void {
    this.total = this.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0) + this.shippingCost;
  }

  navigateToInicio() {
    console.log('Navegando a inicio');
    this.router.navigate(['/inicio']);
  }

  // Validar formulario
  validateForm(): boolean {
    this.formErrors = {};
    let isValid = true;

    // Validaciones requeridas
    if (!this.guestData.firstName.trim()) {
      this.formErrors.firstName = 'El nombre es requerido';
      isValid = false;
    }

    if (!this.guestData.lastName.trim()) {
      this.formErrors.lastName = 'El apellido es requerido';
      isValid = false;
    }

    if (!this.guestData.email.trim()) {
      this.formErrors.email = 'El correo es requerido';
      isValid = false;
    } else if (!this.isValidEmail(this.guestData.email)) {
      this.formErrors.email = 'Correo electrónico inválido';
      isValid = false;
    }

    if (!this.guestData.phone.trim()) {
      this.formErrors.phone = 'El teléfono es requerido';
      isValid = false;
    }

    if (!this.guestData.province.trim()) {
      this.formErrors.province = 'La provincia es requerida';
      isValid = false;
    }

    if (!this.guestData.district.trim()) {
      this.formErrors.district = 'El distrito es requerido';
      isValid = false;
    }

    if (!this.guestData.corregimiento.trim()) {
      this.formErrors.corregimiento = 'El corregimiento es requerido';
      isValid = false;
    }

    if (!this.guestData.address.trim()) {
      this.formErrors.address = 'La dirección es requerida';
      isValid = false;
    }

    if (this.createAccount && !this.password.trim()) {
      this.formErrors.password = 'La contraseña es requerida para crear cuenta';
      isValid = false;
    }

    return isValid;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Procesar orden
  processOrder(): void {
    if (!this.validateForm()) {
      return;
    }

    // Si quiere crear cuenta, intentar crearla
    if (this.createAccount) {
      this.createGuestAccount();
    }

    // Mostrar botón de PayPal y ocultar botón de procesar
    const paypalContainer = document.getElementById('paypal-button-container');
    const processBtn = document.querySelector('.process-order-btn') as HTMLElement;
    
    if (paypalContainer && processBtn) {
      paypalContainer.style.display = 'block';
      processBtn.style.display = 'none';
    }

    // Proceder con el pago
    this.loadPayPalButton();
  }

  // Actualizar distritos según provincia seleccionada
  onProvinceChange(): void {
    if (this.guestData.province) {
      this.availableDistricts = this.districts[this.guestData.province] || [];
      // Limpiar distrito y corregimiento cuando cambie la provincia
      this.guestData.district = '';
      this.guestData.corregimiento = '';
      this.availableCorregimientos = [];
    } else {
      this.availableDistricts = [];
      this.availableCorregimientos = [];
    }
  }

  // Actualizar corregimientos según distrito seleccionado
  onDistrictChange(): void {
    if (this.guestData.district) {
      this.availableCorregimientos = this.corregimientos[this.guestData.district] || [];
      // Limpiar corregimiento cuando cambie el distrito
      this.guestData.corregimiento = '';
    } else {
      this.availableCorregimientos = [];
      this.guestData.corregimiento = '';
    }
  }

  createGuestAccount(): void {
    const accountData = {
      name: this.guestData.firstName,
      apellido: this.guestData.lastName,
      email: this.guestData.email,
      direccion: `${this.guestData.address}, ${this.guestData.apartment}`,
      local: this.guestData.district,
      puesto: 'Cliente',
      celular: parseInt(this.guestData.phone),
      fecha: new Date().toISOString(),
      banco: '',
      tipo: 'Cliente',
      cuenta: 0,
      password: this.password
    };

    this.authService.register(accountData).subscribe({
      next: (response) => {
        console.log('Cuenta creada exitosamente:', response);
      },
      error: (error) => {
        console.error('Error al crear cuenta:', error);
        // Continuar con el checkout aunque falle la creación de cuenta
      }
    });
  }

  //Pago
  ngAfterViewInit() {
    this.loadPayPalButton();
  }

  loadPayPalButton() {
    (window as any).paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: this.total.toFixed(2) 
            }
          }]
        });
      },
      onApprove: (data:any , actions: any) => {
        return actions.order.capture().then((details: any) => {
          console.log('Pago exitoso:', details);
          
          // Mostrar mensaje de confirmación mejorado
          this.showSuccessMessage(details);
          
          // Limpiar el carrito después del pago exitoso
          this.cartService.clearCart();
          
          // Redirigir después de 3 segundos
          setTimeout(() => {
            this.router.navigate(['/inicio']);
          }, 3000);
        });
      },
      onError: (err: any) => {
        console.error('Error en el pago:', err);
        alert('Ocurrió un error al procesar el pago. Por favor, inténtalo de nuevo.');
      }
    }).render('#paypal-button-container');
  }

  showSuccessMessage(details: any) {
    // Crear elemento de confirmación
    const confirmation = document.createElement('div');
    confirmation.className = 'payment-success-modal';
    confirmation.innerHTML = `
      <div class="success-content">
        <div class="success-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h2>¡Pago Completado Exitosamente!</h2>
        <div class="transaction-details">
          <p><strong>ID de Transacción:</strong> ${details.id}</p>
          <p><strong>Total Pagado:</strong> $${this.total.toFixed(2)}</p>
          <p><strong>Método de Pago:</strong> PayPal</p>
        </div>
        <div class="success-message">
          <p>Tu pedido ha sido procesado correctamente.</p>
          <p>Recibirás un correo de confirmación en breve.</p>
          <p>Serás redirigido al inicio en 3 segundos...</p>
        </div>
      </div>
    `;
    
    // Agregar estilos
    confirmation.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
    `;
    
    const successContent = confirmation.querySelector('.success-content') as HTMLElement;
    if (successContent) {
      successContent.style.cssText = `
        background: white;
        padding: 40px;
        border-radius: 12px;
        text-align: center;
        max-width: 500px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      `;
    }
    
    const successIcon = confirmation.querySelector('.success-icon i') as HTMLElement;
    if (successIcon) {
      successIcon.style.cssText = `
        font-size: 60px;
        color: #4CAF50;
        margin-bottom: 20px;
      `;
    }
    
    document.body.appendChild(confirmation);
    
    // Remover después de 3 segundos
    setTimeout(() => {
      document.body.removeChild(confirmation);
    }, 3000);
  }

  // Métodos para unidades de medida
  getUnitName(unit: string): string {
    const units: { [key: string]: string } = {
      'unidad': 'unidad',
      'libra': 'libra',
      'kilo': 'kilogramo',
      'gramo': 'gramo',
      'onza': 'onza',
      'docena': 'docena',
      'paquete': 'paquete',
      'bolsa': 'bolsa',
      'caja': 'caja',
      'litro': 'litro',
      'galon': 'galón'
    };
    return units[unit] || unit || 'unidad';
  }

  getUnitAbbreviation(unit: string): string {
    const abbreviations: { [key: string]: string } = {
      'unidad': 'u',
      'libra': 'lb',
      'kilo': 'kg',
      'gramo': 'g',
      'onza': 'oz',
      'docena': 'doc',
      'paquete': 'paq',
      'bolsa': 'bolsa',
      'caja': 'caja',
      'litro': 'L',
      'galon': 'gal'
    };
    return abbreviations[unit] || unit || 'u';
  }
}
