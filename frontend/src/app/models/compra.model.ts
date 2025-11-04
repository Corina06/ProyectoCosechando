export interface Producto {
    nombre: string;
    cantidad: number;
    precio: number;
    subtotal: number;
    unit: string;
  }

export interface Compra {
    id: number;
    comercianteContact: string;
    proveedor: string;
    tipoGasto: 'Compra de Productos' | 'Transporte' | 'Servicios Públicos' | 'Alquiler' | 'Mantenimiento' | 'Marketing' | 'Otros';
    fecha: string; // Formato dd/mm/aaaa
    estado: 'Pendiente' | 'Pagado' | 'Cancelado';
    metodoPago: 'Efectivo' | 'Transferencia Bancaria' | 'Cheque' | 'Tarjeta de Crédito' | 'Tarjeta de Débito';
    factura: string;
    descripcion?: string;
    productos: Producto[]; // Se mapea a 'items' en el backend
    total: number;
  }