export interface Producto {
    nombre: string;
    cantidad: number;
    precio: number;
    subtotal: number;
    unit: string;
  }

export interface Compra {
    id: number;
    proveedor: string;
    fecha: string; // Cambiado a string para manejar formato dd/mm/aaaa
    estado: string;
    metodoPago: string;
    factura: string;
    productos: Producto[];
    total: number;
  }