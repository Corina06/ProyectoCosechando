export interface Order {
  id: number;
  client: string;
  date: string;
  products: { name: string; quantity: number }[];  // Productos dentro de la orden
  name: string;   // Nombre de la orden
  total: number;  
  status: string;
  }