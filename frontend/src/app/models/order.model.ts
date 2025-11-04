export interface Order {
  id: number;
  client: string;
  date: string; // Formato dd/mm/aaaa
  products: { name: string; quantity: number; price: number; unit: string }[];  // Productos con unidad de medida
  name: string;   // Nombre de la orden
  total: number;  
  status: string;
  }