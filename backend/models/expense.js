const mongoose = require('mongoose');

const expenseItemSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  cantidad: { type: Number, required: true, min: 0 },
  precio: { type: Number, required: true, min: 0 },
  unit: { type: String, required: true },
  subtotal: { type: Number, required: true, min: 0 }
});

const expenseSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  comercianteContact: { type: String, required: true }, // Para filtrar por comerciante
  proveedor: { type: String, required: true },
  tipoGasto: { 
    type: String, 
    required: true,
    enum: ['Compra de Productos', 'Transporte', 'Servicios Públicos', 'Alquiler', 'Mantenimiento', 'Marketing', 'Otros']
  },
  fecha: { type: String, required: true }, // Formato dd/mm/aaaa
  estado: { 
    type: String, 
    required: true,
    enum: ['Pendiente', 'Pagado', 'Cancelado'],
    default: 'Pendiente'
  },
  metodoPago: { 
    type: String, 
    required: true,
    enum: ['Efectivo', 'Transferencia Bancaria', 'Cheque', 'Tarjeta de Crédito', 'Tarjeta de Débito']
  },
  factura: { type: String, required: true },
  descripcion: { type: String }, // Descripción general del gasto
  items: [expenseItemSchema], // Para gastos de productos (puede estar vacío para otros gastos)
  total: { type: Number, required: true, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);