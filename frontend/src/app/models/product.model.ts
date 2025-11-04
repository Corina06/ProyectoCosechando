export interface Product {
    id?: number;
    name: string;
    category: string;
    price: number; // Precio de venta
    purchasePrice?: number; // Precio de compra
    image: string;
    description: string;
    location: string; 
    CName: string;
    Contact: string;
    stock: boolean;
    quantity?: number;
    unit?: string; // Unidad de medida (unidad, libra, kilo, etc.)
    minStock?: number; // Stock mínimo para alertas
}

