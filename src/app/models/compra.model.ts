export interface Producto {
    nombre: string;
    cantidad: number;
    precio: number;
    subtotal: number;
  }

export interface Compra {
    id: number;
    proveedor: string;
    fecha: Date;
    estado: string;
    metodoPago: string;
    factura: string;
    productos: Producto[];
    total: number;
  }