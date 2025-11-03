require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./models/order');
const User = require('./models/user');
const Product = require('./models/product');

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cosechando')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

const seedOrders = async () => {
  try {
    // Limpiar órdenes existentes
    await Order.deleteMany({});
    console.log('Órdenes existentes eliminadas');

    // Obtener un usuario comerciante (el primero que encuentre)
    const merchant = await User.findOne();
    if (!merchant) {
      console.log('No se encontró ningún usuario. Registra un usuario primero.');
      return;
    }

    // Obtener algunos productos
    const products = await Product.find().limit(5);
    if (products.length === 0) {
      console.log('No se encontraron productos. Ejecuta seedProducts.js primero.');
      return;
    }

    // Crear órdenes de ejemplo
    const sampleOrders = [
      {
        customerName: 'Juan Pérez',
        customerEmail: 'juan@email.com',
        merchantId: merchant._id,
        items: [
          {
            productId: products[0]._id,
            productName: products[0].name,
            quantity: 2,
            price: products[0].price,
            total: 2 * products[0].price
          },
          {
            productId: products[1]._id,
            productName: products[1].name,
            quantity: 1,
            price: products[1].price,
            total: 1 * products[1].price
          }
        ],
        status: 'Entregado',
        paymentStatus: 'Pagado',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 días atrás
      },
      {
        customerName: 'María García',
        customerEmail: 'maria@email.com',
        merchantId: merchant._id,
        items: [
          {
            productId: products[2]._id,
            productName: products[2].name,
            quantity: 3,
            price: products[2].price,
            total: 3 * products[2].price
          }
        ],
        status: 'Pendiente',
        paymentStatus: 'Pendiente',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 días atrás
      },
      {
        customerName: 'Carlos López',
        customerEmail: 'carlos@email.com',
        merchantId: merchant._id,
        items: [
          {
            productId: products[3]._id,
            productName: products[3].name,
            quantity: 1,
            price: products[3].price,
            total: 1 * products[3].price
          },
          {
            productId: products[4]._id,
            productName: products[4].name,
            quantity: 2,
            price: products[4].price,
            total: 2 * products[4].price
          }
        ],
        status: 'En proceso',
        paymentStatus: 'Pagado',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 día atrás
      }
    ];

    // Calcular totales y crear órdenes
    for (let orderData of sampleOrders) {
      orderData.subtotal = orderData.items.reduce((sum, item) => sum + item.total, 0);
      orderData.total = orderData.subtotal;
      
      const order = new Order(orderData);
      await order.save();
      console.log(`Orden creada: ${order.orderNumber}`);
    }

    console.log('✅ Órdenes de ejemplo creadas exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear órdenes:', error);
    process.exit(1);
  }
};

seedOrders();