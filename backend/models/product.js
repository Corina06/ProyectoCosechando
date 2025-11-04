const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true }, // Precio de venta
  purchasePrice: { type: Number, default: 0 }, // Precio de compra
  image: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  CName: { type: String, required: true },
  Contact: { type: String, required: true },
  stock: { type: Boolean, default: true },
  quantity: { type: Number, default: 0 },
  unit: { type: String, default: 'unidad' },
  minStock: { type: Number, default: 5 } // Stock mínimo para alertas
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
